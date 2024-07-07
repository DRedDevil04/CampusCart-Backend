const Order = require('../models/order');
const User = require('../models/user.models');
const Item = require('../models/item');

const addNewOrder = async (req, res) => {
    try {
        const { items, payment, shipping, user } = req.body;

        const customer = user._id;
        const customerExists = await User.findById(customer);
        if (!customerExists) {
            return res.status(400).json({ message: "Invalid customer ID" });
        }

        for (const item of items) {
            const itemExists = await Item.findById(item.item);
            if (!itemExists) {
                return res.status(400).json({ message: `Invalid item ID: ${item.item}` });
            }
        }

        const newOrder = new Order({
            customer,
            items,
            payment,
            shipping,
        });
        customerExists.orders.push(newOrder._id);
        await newOrder.save();
        await customerExists.save();

        return res.status(201).json({
            message: "Order Placed Successfully!",
            orderId:newOrder._id,
            savedOrder: newOrder
        });
    } catch (error) {
        console.error("Error adding new order:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const editOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.order_status = status;
        const updatedOrder = await order.save();

        return res.status(200).json({
            message: "Order Status Updated Successfully!",
            updatedOrder
        });
    } catch (error) {
        console.error("Error editing order status:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const editPaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.payment.status = status;
        const updatedOrder = await order.save();

        return res.status(200).json({
            message: "Order Payment Status Updated Successfully!",
            updatedOrder
        });
    } catch (error) {
        console.error("Error editing payment status:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const editShippingDetails = async (req, res) => {
    try {
        const { estimated_delivery_date, shipping_status } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (estimated_delivery_date) {
            order.shipping.estimated_delivery_date = estimated_delivery_date;
        }

        if (shipping_status) {
            order.shipping.shipping_status = shipping_status;
        }

        const updatedOrder = await order.save();

        return res.status(200).json({
            message: "Shipping Details Updated Successfully!",
            updatedOrder
        });
    } catch (error) {
        console.error("Error editing shipping details:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const editShippingAddress = async (req, res) => {
    try {
        const { room, floor, hostel, contact_number, user } = req.body;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.customer._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to view this order" });
        }

        if (room) order.shipping.address.room = room;
        if (floor) order.shipping.address.floor = floor;
        if (hostel) order.shipping.address.hostel = hostel;
        if (contact_number) order.shipping.address.contact_number = contact_number;

        const updatedOrder = await order.save();

        return res.status(200).json({
            message: "Shipping Address Updated Successfully!",
            updatedOrder
        });
    } catch (error) {
        console.error("Error editing shipping address:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).sort({ __created: -1 })
            .populate('customer', 'name email enrollment_number')
            .populate('items.item', 'name price');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const user = req.body.user;

        if (user.role !== 'admin' && order.customer._id.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to view this order" });
        }

        return res.status(200).json({
            message: "Order Details Successfully Fetched!",
            order,
        });
    } catch (error) {
        console.error("Error getting order details:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ __created: -1 })
            .populate('customer', 'name email enrollment_number')
            .populate('items.item', 'name price');

        return res.status(200).json({
            message: "All Orders Details Fetched Successfully!",
            orders
        });
    } catch (error) {
        console.error("Error getting all orders:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

const getParticularUserAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.body.user._id }).sort({ __created: -1 })
    .populate('items.item', 'name price images')
    .exec();

        if (orders.length === 0) {
            return res.status(404).json({ message: "No Orders Found!" });
        }

        return res.status(200).json({
            message: "User Order Details Fetched Successfully!",
            orders
        });
    } catch (error) {
        console.error("Error getting orders", error);
        return res.status(500).json({ message: "Server Error!" });
    }
};

module.exports = {
    addNewOrder,
    editOrderStatus,
    editPaymentStatus,
    editShippingDetails,
    editShippingAddress,
    getOrderDetails,
    getAllOrders,
    getParticularUserAllOrders
};
