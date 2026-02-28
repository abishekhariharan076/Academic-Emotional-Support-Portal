const router = require("express").Router();
const { createCheckIn, getMyCheckIns } = require("../controllers/checkin.controller");
const auth = require("../middleware/auth.middleware");

router.post("/", auth, createCheckIn);
router.get("/my", auth, getMyCheckIns);

module.exports = router;
