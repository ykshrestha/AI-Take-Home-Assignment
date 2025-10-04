
const { Pool } = require('pg');

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

const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "users" created successfully.');
  } catch (error) {
    console.error('Error creating table:', error);
  }
};

const insertUser = async () => {
  try {
    // Check if any users exist
    const result = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(result.rows[0].count);
    
    if (userCount === 0) {
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('password', 10);
      await pool.query("INSERT INTO users (username, password) VALUES ('admin', $1)", [hashedPassword]);
      console.log('Sample admin user inserted successfully.');
    } else {
      console.log(`Users table already has ${userCount} users. Skipping sample user insertion.`);
    }
  } catch (error) {
    console.error('Error inserting user:', error);
  }
};

const init = async () => {
  await createTable();
  await insertUser();
  pool.end();
};

init();
