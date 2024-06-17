const express = require('express');
const {signup, login, logout} = require('../controllers/authControllers');
const {isAuthorized} = require("../middlewares/isAuthorised.middleware");
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/logout", isAuthorized, logout);

module.exports = router;
