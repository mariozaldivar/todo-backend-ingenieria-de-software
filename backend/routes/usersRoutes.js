const express = require("express");
const router = express.Router();
const { login, register, data } = require("../controllers/usersControllers");
const protect = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/", register);

router.get("/datos", protect, data);

module.exports = router;
