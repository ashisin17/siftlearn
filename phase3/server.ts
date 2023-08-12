import express, { Request, Response } from 'express';
import { Pool } from 'pg';

const app = express();
const PORT = 8765;

app.use(express.json());

// PostgreSQL database setup
const pool = new Pool({
    user: 'username',
    host: 'pgl_host',
    database: 'db_name',
    password: 'pass',
    port: PORT // default is 5432
});

pool.query(
    `CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY, 
        title TEXT NOT NULL
    )`,
    (err, result) => {
        if (err) {
            console.error('Error creating table', err.message);
        } else {
            console.log('Table MOVIES created successfully');
        }
    }
);

// Endpoint to save movie titles
app.post('/movies', async (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Movie title not provided.' });
    }

    try {
        const insertQuery = 'INSERT INTO movies (title) VALUES ($1)';
        await pool.query(insertQuery, [title]);

        res.status(200).json({ message: 'Movie title saved successfully.' });
    } catch (error) {
        console.error('Error inserting movie:', error.message);
        res.status(500).json({ error: 'An error occurred while saving the movie title.' });
    }
});

// Endpoint to list all movie titles
app.get('/movies', async (_req: Request, res: Response) => {
    try {
        const selectQuery = 'SELECT title FROM movies';
        const result = await pool.query(selectQuery);

        const movieTitles = result.rows.map((row) => row.title);
        res.status(200).json({ movies: movieTitles });
    } catch (error) {
        console.error('Error fetching movie titles:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching movie titles.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
