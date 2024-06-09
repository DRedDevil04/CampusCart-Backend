const express = require("express");

const Router = express.Router();
const {AddCategory,UpdateCategory,DeleteCategory,GetAllCategories,GetCategory} = require("../controllers/category");
const {isAuthorized, isAdmin} = require("../middlewares/isAuthorised.middleware");


Router.get("/:id",GetCategory);
Router.put("/:id",isAuthorized,isAdmin,UpdateCategory);
Router.delete("/:id",isAuthorized,isAdmin,DeleteCategory);
Router.post("/",isAuthorized,isAdmin,AddCategory);
Router.get("/",GetAllCategories);


module.exports = Router;