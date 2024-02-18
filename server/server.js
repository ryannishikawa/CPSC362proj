import express from 'express';
import sqlite3 from 'sqlite3';

const server = express();
const PORT = process.env.PORT || 5000;
const db = new sqlite3.Database('./data/credentials.db');

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

server.listen(PORT, () => {
    console.log(`The server is running and listening on port ${PORT}`);
});
