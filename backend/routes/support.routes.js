const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const {
  createSupportRequest,
  getMySupportRequests,
  getAllSupportRequests,
  respondToSupportRequest,
  deleteSupportRequest,
} = require("../controllers/support.controller");

// Student: create + my requests
router.post("/", auth, (req, res, next) => {
  if (req.user.role !== "student") return res.status(403).json({ message: "Access denied" });
  next();
}, createSupportRequest);

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
}, respondToSupportRequest);

router.delete("/:id", auth, deleteSupportRequest);

module.exports = router;
