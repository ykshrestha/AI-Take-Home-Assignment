require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy and running!');
});

const startServer = async () => {
  try {
    console.log('--- Connecting to database... ---');
    await db.setupTables();
    console.log('✅ Database connection successful and tables are ready.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is now running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ FATAL ERROR: Could not connect to the database.');
    console.error(error);
    process.exit(1);
  }
};

// 7. Start the Application
startServer();

