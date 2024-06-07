const express = require('express');
const {signup, login, logout} = require('../controllers/authControllers');
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
