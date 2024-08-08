const express = require("express");
const { addUser, validateSignup } = require("../utils/user-router-logic");

const router = express.Router();

// Add a User - URL: /api/users
router.post("/", validateSignup, addUser);

module.exports = router;
