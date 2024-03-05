/**
 * @file server.js
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This file handles the database and API endpoints for the website.
 * 
 * @see {@link: https://github.com/ryannishikawa/CPSC362proj} for our project repository and the README.md file within the server
 * directory for a less stressful viewing experience.
 * 
 * Resources:
 * @see {@link: https://security.stackexchange.com/questions/157422/store-encrypted-user-data-in-database} for encryption inspiration
 * @see {@link: https://nodejs.org/api/crypto.html} for crypto docs
 * @see {@link https://www.sqlitetutorial.net/sqlite-nodejs/} for sqlite3 docs
 * @see {@link: https://expressjs.com/en/guide/routing.html} for express docs
 * @see {@link: https://expressjs.com/en/resources/middleware/cors.html} for more about the CORS module.
 * 
 */
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import crypto from 'crypto';

const server = express();
const PORT = process.env.PORT || 5000;
const credDB = new sqlite3.Database('./data/credentials.db');
const taskDB = new sqlite3.Database('./data/taskdata.db');

server.use(cors());             // Allow Cross Origin Resource Sharing (CORS)
server.use(express.json());     // Responses must be in JSON to post anything from the server.

// Actively listen for incoming requests from the react app.
server.listen(PORT, () => {
    console.log(`The server is running and listening on port ${PORT}`);
});


/**
 * Given a string of plaintext data, encrypt using the given key.
 * @param {string} data The data to encrypt
 * @param {string} key The key used to encrypt the data with
 * @returns {string} Hexadecimal representation of the IV and encrypted data.
 */
function encryptData(data, key) {

    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);

        let encryptData = cipher.update(data, 'utf-8', 'hex');
        encryptData += cipher.final('hex');

        return {
            encryptedData: encryptData,
            iv: iv.toString('hex')
        };
    } catch (err) {
        console.log(`Error encrypting data: ${err}`);
    }

}

/**
 * Given an encrypted password and IV of the password, attempt to decrypt using given key.
 * @param {Object} data The data object that has the encrypted data and IV 
 * @param {string} key The key used to decrypt the data with
 * @returns {string} Decrypted data using provided key in hexadecimal.
 */
function decryptData(data, key) {
    try {
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(data.iv, 'hex'));
        let decryptedData = decipher.update(data.encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');

        return decryptedData;

    } catch (err) {

        console.log(`Error decrypting data: ${err}`);
    }

}

/**
 * Derive a key based on a plaintext password and a 16 byte salt.
 * @param {string} password The password in plaintext
 * @param {string} salt The 16 bit salt in hexadecimal
 * @returns {string} Resolved derived key or rejected error.
 */
function deriveKey(password, salt) {

    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 300000, 32, 'sha256', (err, dKey) => {

            if(err) {
                reject(err);
            } else {
                resolve(dKey.toString('hex'));
            }
        });
    });
}




// ==================== API ENDPOINTS DEFINED BELOW ==================== \\

/**
 * See if the backend is running!
 * 
 * Returns 200 for a successful GET.
 */
server.get('/api', (req, res) => {

    return res.status(200).json('Hello, I am alive! Read more about our API endpoints in the GitHub repository!');
});



/**
 * The /users/find endpoint takes in an EMAIL and PASSWORD in plaintext.
 * 
 * Returns 500 (interal server error), 404 (user not found), or a 200 (user found with response)
 */
server.post('/api/users/find', (req, res) => {
    const {email, pass} = req.body;

    // Pull associated record from the email
    credDB.get('SELECT * FROM user_data WHERE email = ?', [email], (iErr, findUser) => {

        if (iErr) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!findUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Once an associated record via email is found, pull the encrypted password and salt from that record.
        credDB.get('SELECT name, email, pass, user_key, salt, uid FROM user_data WHERE email = ?', [email], (nErr, user) => {

            if(nErr) {
                return res.status(500).json({error: 'Internal server error'});
            }

            if(!user) {
                return res.status(500).json({error: 'User record unable to be pulled.'});
            }

            // Since the database returns a string, parse the password and user key to an object.
            let userPasswordObject = JSON.parse(user.pass);
            let userKeyObject = JSON.parse(user.user_key);


            // Derive a key based on given plaintext password and the salt with associated record for the user_key
            deriveKey(pass, user.salt).then((dkey) => {

                // Parse the password object, decrypt the user key with the derived key
                const decryptedUserKey = decryptData(userKeyObject, dkey);

                // With the user_key decrypted, decrypt the password with the decrypted user_key
                const decryptedPass = decryptData(userPasswordObject, decryptedUserKey);

                if(pass == decryptedPass) {
                    return res.status(200).json({user: user});
                } else {
                    return res.status(404).json({error: 'User not found'});
                }
            });

        });
    });
})



/**
 * The /users/register endpoint takes in a name, email, and password in plaintext.
 * The password is encrypted before being stored into the database
 * 
 * Returns 500 (interal server error) or a 200 (user successfully created within the database).
 */
server.post('/api/users/register', (req, res) => {
    const { name, email, pass } = req.body;

    // Generate a random user key to persist sessions. Generate a random salt as well.
    const newUserKey = crypto.randomBytes(32).toString('hex');
    const salt = crypto.randomBytes(16).toString('hex');

    // Encrypt the user password with the newly generated user key
    const encPassword = JSON.stringify(encryptData(pass, newUserKey));

    // Derive a key based on the password in the request body
    deriveKey(pass, salt).then((dKey) => {

        // Encrypt the user key with the derived key from the password.
        const encUserKey = JSON.stringify(encryptData(newUserKey, dKey));

        // Begin database insertion with the encrypted password, encrypted user_key and the salt used to encrypt the password & user_key.
        credDB.run(`INSERT INTO user_data (name, email, pass, user_key, salt) VALUES (?, ?, ?, ?, ?)`, [name, email, encPassword, encUserKey, salt], function (err) {

            // Output result
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            } else {
                return res.status(200).json({ message: `${name} was successfully added to the database`});
            }
        });
    });

});



/**
 * The /api/tasks/add endpoint takes in a unique User ID (uid) and a description for the task, and adds a task to their table within the taskdata database.
 * If the user does not have a table within this database, it also creates it for them.
 */
server.post('/api/tasks/add', (req, res) => {
    const {uid, description} = req.body;

    let tableQuery = `CREATE TABLE IF NOT EXISTS \`u_${uid}\` (\`tid\` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, \`description\` TEXT NOT NULL, \`completed\` TEXT NOT NULL DEFAULT 'FALSE') STRICT`;
    let newTaskQuery = `INSERT INTO \`u_${uid}\` (\`description\`) VALUES (?)`;

    // If the table does not exist, create a new table with the first task to the database.
    taskDB.run(tableQuery, function (ctErr) {

        if (ctErr) {
            console.log(ctErr);
            return res.status(500).json({ error: 'Internal server error' });
        }

        taskDB.run(newTaskQuery, [description], function (ntErr) {

            if (ntErr) {
                console.log(ntErr);
                return res.status(500).json({ error: 'Internal server error' });
            }
    
            console.log(`New task for ${uid} added successfully!`);

            return res.status(200).json({ message: `A task for user with ID ${uid} was successfully added to the database` });
        });

    });
});



/**
 * The /api/tasks/find endpoint takes in a User ID (uid) and returns an array of tasks.
 */
server.post('/api/tasks/find', (req, res) => {
    const {uid} = req.body;

    let fetchQuery = `SELECT * FROM \`u_${uid}\` ORDER BY tid`;

    taskDB.all(fetchQuery, [], (err, rows) => {

        if(err) {
            return res.status(500).json({ error: 'Internal server error' }); 
        }

            return res.status(200).json(rows);
    });
});