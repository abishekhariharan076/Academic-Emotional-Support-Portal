const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validate = require("../middleware/validate.middleware");

const registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["student", "counselor", "admin"]).withMessage("Invalid role"),
    validate
];

const loginValidation = [
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    validate
];

const forgotPasswordValidation = [
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    validate
];

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);
router.post("/google", authController.googleLogin);
router.post("/forgot-password", forgotPasswordValidation, authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
