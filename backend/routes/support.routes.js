const router = require("express").Router();
const { body, param } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
  createSupportRequest,
  getMySupportRequests,
  getAllSupportRequests,
  respondToSupportRequest,
  deleteSupportRequest,
} = require("../controllers/support.controller");

const supportRequestValidation = [
    body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 100 }).withMessage("Subject max 100 chars"),
    body("message").trim().notEmpty().withMessage("Message is required").isLength({ max: 1500 }).withMessage("Message max 1500 chars"),
    validate
];

const respondValidation = [
    param("id").isMongoId().withMessage("Invalid request ID"),
    body("counselorReply").trim().notEmpty().withMessage("Reply is required").isLength({ max: 1500 }).withMessage("Reply max 1500 chars"),
    validate
];

// Student: create + my requests
router.post("/", auth, (req, res, next) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });
  next();
}, supportRequestValidation, createSupportRequest);

router.get("/my", auth, (req, res, next) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });
  next();
}, getMySupportRequests);

// Counselor: view all + respond
router.get("/", auth, (req, res, next) => {
  if (req.user.role !== "counselor") return res.status(403).json({ message: "Access denied" });
  next();
}, getAllSupportRequests);

router.put("/:id/respond", auth, (req, res, next) => {
  if (req.user.role !== "counselor") return res.status(403).json({ message: "Access denied" });
  next();
}, respondValidation, respondToSupportRequest);

router.delete("/:id", auth, [param("id").isMongoId(), validate], deleteSupportRequest);

module.exports = router;
