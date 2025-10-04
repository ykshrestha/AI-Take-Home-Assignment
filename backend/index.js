
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

const pool = new Pool({
  user: 'ai_take_home_assignment_user',
  host: 'dpg-d3ggdeb3fgac73905r30-a.oregon-postgres.render.com',
  database: 'ai_take_home_assignment',
  password: 'E1XNZzPt1E08PVmQlRnLw7ckm0wO20Ul',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(cors());
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ success: true, message: 'Login successful', token, user: { id: user.id, username: user.username } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    
    const newUser = result.rows[0];
    
    res.json({ 
      success: true, 
      message: 'User created successfully',
      user: { id: newUser.id, username: newUser.username }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      res.status(400).json({ success: false, message: 'Username already exists' });
    } else {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
