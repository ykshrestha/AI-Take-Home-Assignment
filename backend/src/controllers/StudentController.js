/**
 * Student Controller
 * Handles student CRUD operations
 */

const Student = require("../models/Student");

class StudentController {
  /**
   * Create a new student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    try {
      const {
        name,
        email,
        status,
        isScholarship,
        attendancePercentage,
        assignmentScore,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !email ||
        !status ||
        attendancePercentage === undefined ||
        assignmentScore === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Validate percentages
      if (attendancePercentage < 0 || attendancePercentage > 100) {
        return res.status(400).json({
          success: false,
          message: "Attendance percentage must be between 0 and 100",
        });
      }

      if (assignmentScore < 0 || assignmentScore > 100) {
        return res.status(400).json({
          success: false,
          message: "Assignment score must be between 0 and 100",
        });
      }

      // Validate status
      const validStatuses = ["active", "inactive", "graduated"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be: active, inactive, or graduated",
        });
      }

      const student = await Student.createStudent(req.body, req.user.userId);

      res.status(201).json({
        success: true,
        message: "Student created successfully",
        student,
      });
    } catch (error) {
      console.error("Create student error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create student",
      });
    }
  }

  /**
   * Get all students with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { page, limit, status, isScholarship, sortBy, sortOrder, search } =
        req.query;

      const options = {
        page: page || 1,
        limit: limit || 10,
        userId: req.user.userId,
        status,
        isScholarship:
          isScholarship === "true"
            ? true
            : isScholarship === "false"
            ? false
            : undefined,
        sortBy,
        sortOrder,
        search,
      };

      const result = await Student.getPaginated(options);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch students",
      });
    }
  }

  /**
   * Get a single student by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.findByIdAndUser(id, req.user.userId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      res.json({
        success: true,
        student,
      });
    } catch (error) {
      console.error("Get student error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch student",
      });
    }
  }

  /**
   * Update a student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        email,
        status,
        isScholarship,
        attendancePercentage,
        assignmentScore,
      } = req.body;

      // Validate required fields
      if (
        !name ||
        !email ||
        !status ||
        attendancePercentage === undefined ||
        assignmentScore === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format",
        });
      }

      // Validate percentages
      if (attendancePercentage < 0 || attendancePercentage > 100) {
        return res.status(400).json({
          success: false,
          message: "Attendance percentage must be between 0 and 100",
        });
      }

      if (assignmentScore < 0 || assignmentScore > 100) {
        return res.status(400).json({
          success: false,
          message: "Assignment score must be between 0 and 100",
        });
      }

      const student = await Student.updateStudent(
        id,
        req.body,
        req.user.userId
      );

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      res.json({
        success: true,
        message: "Student updated successfully",
        student,
      });
    } catch (error) {
      console.error("Update student error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update student",
      });
    }
  }

  /**
   * Delete a student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const student = await Student.deleteStudent(id, req.user.userId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      res.json({
        success: true,
        message: "Student deleted successfully",
      });
    } catch (error) {
      console.error("Delete student error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete student",
      });
    }
  }

  /**
   * Get statistics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getStatistics(req, res) {
    try {
      const statistics = await Student.getStatistics(req.user.userId);

      res.json({
        success: true,
        statistics,
      });
    } catch (error) {
      console.error("Get statistics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch statistics",
      });
    }
  }
}

module.exports = new StudentController();
