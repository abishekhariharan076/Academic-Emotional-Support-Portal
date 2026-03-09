const router = require("express").Router();
const { getResources } = require("../controllers/resource.controller");

router.get("/", getResources);

module.exports = router;
