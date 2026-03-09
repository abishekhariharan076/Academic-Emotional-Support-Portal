const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const registerValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").optional().isIn(["student", "counselor", "admin"]).withMessage("Invalid role"),
];

const loginValidation = [
    body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, authController.register);
router.post("/login", loginValidation, authController.login);

module.exports = router;
