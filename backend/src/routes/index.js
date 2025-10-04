/**
 * Routes Configuration
 * Defines all API routes
 */

const express = require("express");
const AuthController = require("../controllers/AuthController");
const StudentController = require("../controllers/StudentController");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// ==================== AUTHENTICATION ROUTES ====================
router.post("/signup", AuthController.signup.bind(AuthController));
router.post("/login", AuthController.login.bind(AuthController));
router.get(
  "/verify",
  authenticateToken,
  AuthController.verifyToken.bind(AuthController)
);

// ==================== STUDENT ROUTES (Protected) ====================
router.post(
  "/api/students",
  authenticateToken,
  StudentController.create.bind(StudentController)
);
router.get(
  "/api/students",
  authenticateToken,
  StudentController.getAll.bind(StudentController)
);
router.get(
  "/api/students/:id",
  authenticateToken,
  StudentController.getById.bind(StudentController)
);
router.put(
  "/api/students/:id",
  authenticateToken,
  StudentController.update.bind(StudentController)
);
router.delete(
  "/api/students/:id",
  authenticateToken,
  StudentController.delete.bind(StudentController)
);

// ==================== STATISTICS ROUTE (Protected) ====================
router.get(
  "/api/statistics",
  authenticateToken,
  StudentController.getStatistics.bind(StudentController)
);

module.exports = router;
