const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./guesses.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(
            `CREATE TABLE IF NOT EXISTS guesses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                guess INTEGER NOT NULL
            )`
        );
    }
});

// API Endpoints

// Submit a guess
app.post('/api/guess', (req, res) => {
    const { name, guess } = req.body;

    if (!name || !guess || isNaN(guess)) {
        return res.status(400).json({ message: 'Invalid name or guess.' });
    }

    const query = `INSERT INTO guesses (name, guess) VALUES (?, ?)`;
    db.run(query, [name, guess], function (err) {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                res.status(400).json({ message: 'You have already submitted a guess.' });
            } else {
                res.status(500).json({ message: 'Database error.' });
            }
        } else {
            res.status(201).json({ message: 'Guess submitted successfully!', id: this.lastID });
        }
    });
});

// Get all guesses
app.get('/api/guesses', (req, res) => {
    db.all(`SELECT * FROM guesses`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ message: 'Database error.' });
        } else {
            res.status(200).json(rows);
        }
    });
});

// Search guesses by name
app.get('/api/guesses/:name', (req, res) => {
    const { name } = req.params;
    db.get(`SELECT * FROM guesses WHERE name = ?`, [name], (err, row) => {
        if (err) {
            res.status(500).json({ message: 'Database error.' });
        } else if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ message: 'No guess found for this name.' });
        }
    });
});

// Delete a guess by ID
app.delete('/api/guesses/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM guesses WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Guess not found.' });
        }
        res.status(200).json({ message: 'Guess deleted successfully!' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
