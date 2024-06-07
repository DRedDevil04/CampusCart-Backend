const express = require('express');
const {updateProfile, getProfile} = require('../controllers/userControllers');
const isAuthorized = require("../middlewares/isAuthorised.middleware");
const router = express.Router();

router.put("/updateProfile", isAuthorized, updateProfile);
router.post("/getProfile", isAuthorized, getProfile);

module.exports = router;
