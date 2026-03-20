const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const { 
  getStats, getUsers, deleteUser, updateUserRole, createCounselor, getCounselorLogs,
  getInstitutionRequests, fulfillInstitutionRequest, assignCounselorToUser
} = require("../controllers/admin.controller");

router.get("/stats", auth, role(["admin"]), getStats);
router.get("/users", auth, role(["admin"]), getUsers);
router.post("/counselors", auth, role(["admin"]), createCounselor);
router.get("/logs", auth, role(["admin"]), getCounselorLogs);
router.patch("/users/:id/role", auth, role(["admin"]), updateUserRole);
router.delete("/users/:id", auth, role(["admin"]), deleteUser);

// Connection management
router.get("/institution-requests", auth, role(["admin"]), getInstitutionRequests);
router.post("/institution-requests/:id/fulfill", auth, role(["admin"]), fulfillInstitutionRequest);
router.post("/users/:id/assign-counselor", auth, role(["admin"]), assignCounselorToUser);

module.exports = router;
