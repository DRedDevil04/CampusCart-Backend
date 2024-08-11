const express = require("express");
const { getKits, getKit } = require("../controllers/kitControllers");
 
const Router = express.Router();
const {isAuthorized} = require("../middlewares/isAuthorised.middleware");

Router.get("/getKits",isAuthorized, getKits);
Router.get("/getKit/:id",isAuthorized, getKit);

module.exports = Router;