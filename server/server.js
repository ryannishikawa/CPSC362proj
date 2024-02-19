import express from 'express';
import sqlite3 from 'sqlite3';

const server = express();
const PORT = process.env.PORT || 5000;
const db = new sqlite3.Database('./data/credentials.db');

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
