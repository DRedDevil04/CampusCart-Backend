const Router = require("express").Router();
const {GetItem, GetAllItems, AddItem, UpdateItem, DeleteItem} = require("../controllers/item");
const {isAuthorized, isAdmin} = require("../middlewares/isAuthorised.middleware");

Router.post("/",isAuthorized,isAdmin,AddItem);
Router.put("/:id",isAuthorized,isAdmin,UpdateItem);
Router.delete("/:id",isAuthorized,isAdmin,DeleteItem);
Router.get("/:id",GetItem);
Router.get("/",GetAllItems);


module.exports = Router;