const express = require('express');
const {updateProfile, getProfile, updateUserRole, getAllUsers} = require('../controllers/userControllers');
const {isAuthorized, isAdmin} = require("../middlewares/isAuthorised.middleware");
const router = express.Router();

router.put("/updateProfile", isAuthorized, updateProfile);
router.get("/getProfile", isAuthorized, getProfile);
router.put("/updaterole",isAuthorized, isAdmin, updateUserRole);
router.get("/getallusers",isAuthorized,isAdmin,getAllUsers);

module.exports = router;
