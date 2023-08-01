const express = require('express')
const {Pool} = require('pg') // importing Pool class (allows interaction w PostgreSQL database) from pg

const app = express()
const PORT = 8765

app.use(express.json())

//postgreSQL database setup
const pool = new Pool({ // config w the connection configuration
    user: 'username',
    host: 'pgl_host',
    database: 'db_name',
    password: 'pass',
    port: PORT // default is 5432
})

pool.query( // use pool querty method to exec sql query
    `CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY, 
        title TEXT NOT NULL
    )`, // unique id for each row
    (err, result) => {
        if(err) {
            console.error('Error creating table', err.message)
        }
        else {
            console.log('Table MOVIES created successfully')
        }
    }
)

// Endpoint to save movie titles 
app.post('/movies', async (req, res) => { // using post cause creating new records in table
    const { title } = req.body;
  
    if (!title) { // if no title, error
      return res.status(400).json({ error: 'Movie title not provided.' });
    }
  
    try { 
      const insertQuery = 'INSERT INTO movies (title) VALUES ($1)'; // insert movie title into movies tables
      await pool.query(insertQuery, [title]); // pause exec of route handler until database operation is complete. if error -> throw exception
  
      res.status(200).json({ message: 'Movie title saved successfully.' });
    } catch (error) { // if error, jumps here
      console.error('Error inserting movie:', error.message);
      res.status(500).json({ error: 'An error occurred while saving the movie title.' });
    }
  });
  
  // Endpoint to list all movie titles
  app.get('/movies', async (req, res) => {
    try {
      const selectQuery = 'SELECT title FROM movies'; // fetch movie titles from db
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
  