const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const checkInController = require("../controllers/checkin.controller");
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const validate = require("../middleware/validate.middleware");

const checkInValidation = [
  body("moodLevel").isInt({ min: 1, max: 5 }).withMessage("Mood level must be between 1 and 5"),
  body("message").optional().trim().isLength({ max: 500 }).withMessage("Message too long (max 500 chars)"),
  body("anonymous").optional().isBoolean().withMessage("Anonymous must be a boolean"),
  validate,
];

router.post("/", auth, upload.array("media", 5), checkInValidation, checkInController.createCheckIn);
router.get("/my", auth, checkInController.getMyCheckIns);

module.exports = router;
