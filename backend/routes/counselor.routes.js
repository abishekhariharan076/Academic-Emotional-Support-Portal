const router = require("express").Router();
const { getAllCheckIns, reviewCheckIn, getStudents, getCounselors } = require("../controllers/counselor.controller");
const auth = require("../middleware/auth.middleware");

const counselorOnly = (req, res, next) => {
  if (req.user.role !== "counselor") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

router.get("/checkins", auth, counselorOnly, getAllCheckIns);
router.put("/checkins/:id", auth, counselorOnly, reviewCheckIn);
router.get("/students", auth, counselorOnly, getStudents);
router.get("/all", auth, getCounselors); // Accessible by students to find counselors

module.exports = router;

module.exports = router;
