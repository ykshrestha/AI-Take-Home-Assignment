/**
 * User Model
 * Handles user-related database operations
 */

const BaseModel = require("./BaseModel");
const bcrypt = require("bcryptjs");

class User extends BaseModel {
  constructor() {
    super("users");
  }

  /**
   * Find user by username
   * @param {string} username - Username
   * @returns {Promise<Object|null>} User object or null
   */
  async findByUsername(username) {
    return await this.findOne({ username });
  }

  /**
   * Create a new user with hashed password
   * @param {string} username - Username
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Created user (without password)
   */
  async createUser(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.create({
      username,
      password: hashedPassword,
    });

    // Remove password from response
    delete user.password;
    return user;
  }

  /**
   * Verify user password
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password from database
   * @returns {Promise<boolean>} True if password matches
   */
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} True if username exists
   */
  async usernameExists(username) {
    const user = await this.findByUsername(username);
    return user !== null;
  }

  /**
   * Get user by ID (without password)
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id) {
    const user = await super.findById(id);
    if (user) {
      delete user.password;
    }
    return user;
  }
}

module.exports = new User();
