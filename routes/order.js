const express = require('express');
const Router = express.Router();
const {isAuthorized, isAdmin} = require("../middlewares/isAuthorised.middleware");
const {addNewOrder,editOrderStatus,editPaymentStatus,editShippingDetails,editShippingAddress,getAllOrders,getOrderDetails,getParticularUserAllOrders} = require("../controllers/order");


Router.get('/',isAuthorized,isAdmin,getAllOrders);
Router.get('/user',isAuthorized,getParticularUserAllOrders);
Router.get('/:id',isAuthorized,getOrderDetails);
Router.post('/',isAuthorized,addNewOrder);
Router.put('/address/:id',isAuthorized,editShippingAddress);
Router.put('/payment/:id',isAuthorized,isAdmin,editPaymentStatus);
Router.put('/shipping/:id',isAuthorized,isAdmin,editShippingDetails);
Router.put('/status/:id',isAuthorized,isAdmin,editOrderStatus);

module.exports = Router;