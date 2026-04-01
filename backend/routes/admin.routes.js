const router = require("express").Router();
const { body, param } = require("express-validator");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const validate = require("../middleware/validate.middleware");
const {
  getStats,
  getUsers,
  deleteUser,
  updateUserRole,
  createCounselor,
  getCounselorLogs,
  getInstitutionRequests,
  fulfillInstitutionRequest,
  assignCounselorToUser,
} = require("../controllers/admin.controller");

router.get("/stats", auth, role(["admin"]), getStats);
router.get("/users", auth, role(["admin"]), getUsers);

router.post(
  "/counselors",
  auth,
  role(["admin"]),
  [body("name").trim().notEmpty(), body("email").isEmail().normalizeEmail(), body("password").isLength({ min: 6 }), validate],
  createCounselor
);

router.get("/logs", auth, role(["admin"]), getCounselorLogs);

router.patch(
  "/users/:id/role",
  auth,
  role(["admin"]),
  [param("id").isMongoId(), body("role").isIn(["student", "counselor", "admin"]), validate],
  updateUserRole
);

router.delete("/users/:id", auth, role(["admin"]), [param("id").isMongoId(), validate], deleteUser);
router.get("/institution-requests", auth, role(["admin"]), getInstitutionRequests);
router.post("/institution-requests/:id/fulfill", auth, role(["admin"]), [param("id").isMongoId(), validate], fulfillInstitutionRequest);
router.post("/users/:id/assign-counselor", auth, role(["admin"]), [param("id").isMongoId(), validate], assignCounselorToUser);

module.exports = router;
