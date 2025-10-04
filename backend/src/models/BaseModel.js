/**
 * Base Model Class
 * Implements common database operations following OOP principles
 */

const database = require("../config/database");

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
    this.pool = database.getPool();
  }

  /**
   * Execute a query with parameters
   * @param {string} query - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<Object>} Query result
   */
  async query(query, params = []) {
    try {
      const result = await this.pool.query(query, params);
      return result;
    } catch (error) {
      console.error(`Query error in ${this.tableName}:`, error);
      throw error;
    }
  }

  /**
   * Find all records with optional conditions
   * @param {Object} options - Query options (where, orderBy, limit, offset)
   * @returns {Promise<Array>} Array of records
   */
  async findAll(options = {}) {
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];
    let paramIndex = 1;

    if (options.where) {
      const conditions = Object.keys(options.where)
        .map((key) => {
          params.push(options.where[key]);
          return `${key} = $${paramIndex++}`;
        })
        .join(" AND ");
      query += ` WHERE ${conditions}`;
    }

    if (options.orderBy) {
      query += ` ORDER BY ${options.orderBy}`;
    }

    if (options.limit) {
      query += ` LIMIT ${options.limit}`;
    }

    if (options.offset) {
      query += ` OFFSET ${options.offset}`;
    }

    const result = await this.query(query, params);
    return result.rows;
  }

  /**
   * Find a single record by ID
   * @param {number} id - Record ID
   * @returns {Promise<Object|null>} Record or null
   */
  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find a single record by conditions
   * @param {Object} conditions - Where conditions
   * @returns {Promise<Object|null>} Record or null
   */
  async findOne(conditions) {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const whereClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");

    const query = `SELECT * FROM ${this.tableName} WHERE ${whereClause}`;
    const result = await this.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Create a new record
   * @param {Object} data - Record data
   * @returns {Promise<Object>} Created record
   */
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a record by ID
   * @param {number} id - Record ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} Updated record or null
   */
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;

    const result = await this.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  /**
   * Delete a record by ID
   * @param {number} id - Record ID
   * @returns {Promise<Object|null>} Deleted record or null
   */
  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
    const result = await this.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Count records with optional conditions
   * @param {Object} conditions - Where conditions
   * @returns {Promise<number>} Count of records
   */
  async count(conditions = {}) {
    let query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      const whereClause = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(" AND ");
      query += ` WHERE ${whereClause}`;
      params.push(...values);
    }

    const result = await this.query(query, params);
    return parseInt(result.rows[0].count);
  }
}

module.exports = BaseModel;
