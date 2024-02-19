import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const server = express();
const PORT = process.env.PORT || 5000;
const db = new sqlite3.Database('./data/credentials.db');

// Allow Cross Origin Resource Sharing for the server.
server.use(cors());
server.use(express.json());

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
 * Returns 500, 404 or 200 with appropriate json responses.
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
        res.json(user);
    });
})

// Handle post request to the server here for registration.
server.post('/api/register', (req, res) => {

    const { email, pass } = req.body;
    const query = `INSERT INTO user_data (email, pass) VALUES (?, ?)`;

    db.run(query, [email, pass], function (err) {

        // Handle database query.
        if (err) {
            console.err(err.message);
            res.status(500).json({ error: 'Failed to insert data into database' });
        } else {
            res.json({ message: 'Data inserted successfully', rowId: this.lastID });
        }
    });

});

// Actively listen for incoming requests from the react app.
server.listen(PORT, () => {
    console.log(`The server is running and listening on port ${PORT}`);
});
