import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const server = express();
const PORT = process.env.PORT || 5000;
const db = new sqlite3.Database('./data/credentials.db');

server.use(cors());             // Allow Cross Origin Resource Sharing (CORS)
server.use(express.json());     // Responses must be in JSON to post anything from the server.

// Handle get request from the server here.
server.get('/api/data', (req, res) => {
    db.all('SELECT * FROM user_data', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

/**
 * The /users endpoint takes in an EMAIL and PASSWORD in plaintext.
 * 
 * Returns 500 (interal server error), 404 (user not found), or a 200 (user found with response)
 */
server.post('/api/users', (req, res) => {
    const {email, password} = req.body;

    db.get('SELECT * FROM user_data WHERE email = ? AND pass = ?', [email, password], (err, user) => {

        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 
        res.status(200).json(user);
    });
})

/**
 * The /register endpoint takes in a name, email, and password in plaintext.
 * 
 * Returns 500 (interal server error) or a 200 (user successfully created within the database).
 */
server.post('/api/register', (req, res) => {
    const { name, email, pass } = req.body;

    db.run(`INSERT INTO user_data (name, email, pass) VALUES (?, ?, ?)`, [name, email, pass], function (err) {

        // Handle database query.
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        } else {
            return res.json({ message: `${name} was successfully added to the database`});
        }
    });

});

// Actively listen for incoming requests from the react app.
server.listen(PORT, () => {
    console.log(`The server is running and listening on port ${PORT}`);
});
