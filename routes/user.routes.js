const express = require('express');
const {updateProfile, getProfile, updateUserRole} = require('../controllers/userControllers');
const {isAuthorized, isAdmin} = require("../middlewares/isAuthorised.middleware");
const router = express.Router();

router.put("/updateProfile", isAuthorized, updateProfile);
router.get("/getProfile", isAuthorized, getProfile);
router.put("/updaterole",isAuthorized, isAdmin, updateUserRole);

module.exports = router;
