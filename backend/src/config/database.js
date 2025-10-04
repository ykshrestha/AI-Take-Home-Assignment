/**
 * Database Configuration Module
 * Implements Singleton pattern for database connection pool
 */

require("dotenv").config();
const { Pool } = require("pg");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
      connectionTimeoutMillis: 2000, // How long to wait for a connection
    });

    // Handle pool errors
    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
      process.exit(-1);
    });

    Database.instance = this;
  }

  /**
   * Get the database pool instance
   * @returns {Pool} PostgreSQL connection pool
   */
  getPool() {
    return this.pool;
  }

  /**
   * Test database connection
   * @returns {Promise<boolean>}
   */
  async testConnection() {
    try {
      const client = await this.pool.connect();
      await client.query("SELECT NOW()");
      client.release();
      console.log("✅ Database connection successful");
      return true;
    } catch (error) {
      console.error("❌ Database connection failed:", error.message);
      return false;
    }
  }

  /**
   * Close all database connections
   */
  async close() {
    await this.pool.end();
    console.log("Database connections closed");
  }
}

module.exports = new Database();
