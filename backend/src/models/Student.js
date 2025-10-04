/**
 * Student Model
 * Handles student-related database operations
 */

const BaseModel = require("./BaseModel");

class Student extends BaseModel {
  constructor() {
    super("students");
  }

  /**
   * Calculate GPA based on attendance and assignment score
   * @param {number} attendancePercentage - Attendance percentage (0-100)
   * @param {number} assignmentScore - Assignment score (0-100)
   * @returns {number} Calculated GPA
   */
  calculateGPA(attendancePercentage, assignmentScore) {
    return (attendancePercentage * 0.4 + assignmentScore * 0.6) / 10;
  }

  /**
   * Create a new student with calculated GPA
   * @param {Object} data - Student data
   * @param {number} userId - User ID who owns this student
   * @returns {Promise<Object>} Created student
   */
  async createStudent(data, userId) {
    const gpa = this.calculateGPA(
      data.attendancePercentage,
      data.assignmentScore
    );

    const studentData = {
      name: data.name,
      email: data.email,
      status: data.status,
      is_scholarship: data.isScholarship,
      attendance_percentage: data.attendancePercentage,
      assignment_score: data.assignmentScore,
      grade_point_average: gpa,
      user_id: userId,
    };

    return await this.create(studentData);
  }

  /**
   * Update student with recalculated GPA
   * @param {number} id - Student ID
   * @param {Object} data - Updated student data
   * @param {number} userId - User ID for ownership verification
   * @returns {Promise<Object|null>} Updated student or null
   */
  async updateStudent(id, data, userId) {
    // Verify ownership
    const student = await this.findOne({ id, user_id: userId });
    if (!student) {
      return null;
    }

    const gpa = this.calculateGPA(
      data.attendancePercentage,
      data.assignmentScore
    );

    const updateData = {
      name: data.name,
      email: data.email,
      status: data.status,
      is_scholarship: data.isScholarship,
      attendance_percentage: data.attendancePercentage,
      assignment_score: data.assignmentScore,
      grade_point_average: gpa,
    };

    return await this.update(id, updateData);
  }

  /**
   * Delete student with ownership verification
   * @param {number} id - Student ID
   * @param {number} userId - User ID for ownership verification
   * @returns {Promise<Object|null>} Deleted student or null
   */
  async deleteStudent(id, userId) {
    const student = await this.findOne({ id, user_id: userId });
    if (!student) {
      return null;
    }
    return await this.delete(id);
  }

  /**
   * Get paginated students with filtering and sorting
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Students and pagination info
   */
  async getPaginated(options) {
    const {
      page = 1,
      limit = 10,
      userId,
      status,
      isScholarship,
      sortBy = "created_at",
      sortOrder = "DESC",
      search = "",
    } = options;

    const offset = (page - 1) * limit;
    let query = "SELECT * FROM students WHERE user_id = $1";
    let countQuery = "SELECT COUNT(*) FROM students WHERE user_id = $1";
    const params = [userId];
    let paramIndex = 2;

    // Add filters
    if (status) {
      query += ` AND status = $${paramIndex}`;
      countQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    if (isScholarship !== undefined) {
      query += ` AND is_scholarship = $${paramIndex}`;
      countQuery += ` AND is_scholarship = $${paramIndex}`;
      params.push(isScholarship);
      paramIndex++;
    }

    // Add search
    if (search) {
      query += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      countQuery += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Add sorting
    const validSortColumns = [
      "name",
      "email",
      "status",
      "grade_point_average",
      "created_at",
      "attendance_percentage",
      "assignment_score",
    ];
    const sortColumn = validSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
    query += ` ORDER BY ${sortColumn} ${order}`;

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const queryParams = [...params, parseInt(limit), offset];

    // Execute queries
    const [studentsResult, countResult] = await Promise.all([
      this.query(query, queryParams),
      this.query(countQuery, params),
    ]);

    const totalStudents = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalStudents / limit);

    return {
      students: studentsResult.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalStudents,
        studentsPerPage: parseInt(limit),
      },
    };
  }

  /**
   * Get statistics for a user's students
   * @param {number} userId - User ID
   * @returns {Promise<Object>} Statistics object
   */
  async getStatistics(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_students,
        COUNT(*) FILTER (WHERE status = 'active') as active_students,
        COUNT(*) FILTER (WHERE is_scholarship = true) as scholarship_students,
        ROUND(AVG(grade_point_average)::numeric, 2) as average_gpa
      FROM students 
      WHERE user_id = $1
    `;

    const result = await this.query(query, [userId]);
    return result.rows[0];
  }

  /**
   * Find student by ID with ownership verification
   * @param {number} id - Student ID
   * @param {number} userId - User ID
   * @returns {Promise<Object|null>} Student or null
   */
  async findByIdAndUser(id, userId) {
    return await this.findOne({ id, user_id: userId });
  }
}

module.exports = new Student();
