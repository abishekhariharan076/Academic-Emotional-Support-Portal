const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { getStats, getUsers } = require("../controllers/admin.controller");

router.get("/stats", auth, role(["admin"]), getStats);
router.get("/users", auth, role(["admin"]), getUsers);

module.exports = router;
