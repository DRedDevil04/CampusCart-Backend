const User = require('../models/user.models');
const {response_400, response_200,response_500} = require('../utils/responseCodes.utils')
const {generateToken} = require("./authControllers")

exports.updateProfile = async (req, res) => {
    try {
        const { name, profilePicture, address, email } = req.body;
        const { user } = req.body;

        const userExists = await User.findOne({ email: user.email }).exec();
        if (!userExists) {
            return response_400(res, "User not found with this email.");
        }

        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email }).exec();
            if (emailExists) {
                return response_400(res, "Email already exists.");
            }
        }

        let updateObj = {};
        if (name) updateObj.name = name;
        if (profilePicture) updateObj.profilePicture = profilePicture;
        if (address) updateObj.address = address;
        if (email) updateObj.email = email;

        const updatedUser = await User.findByIdAndUpdate(userExists._id, updateObj, { new: true });

        await generateToken(res, updatedUser);

        return response_200(res, "Profile updated successfully", {
            name: updatedUser.name,
            email: updatedUser.email,
            address: updatedUser.address,
            profilePicture: updatedUser.profilePicture,
        });
    } catch (err) {
        return response_400(res, err.message || "Error updating profile.");
    }
};



exports.getProfile = async (req, res) => {
    
    try{
        const {email} = req.body.user;
        if(!email){
            return response_400(res, "I require user email");
        }

        const userExists = await User.findOne({ email: email })
    .populate({
        path: 'orders',
        populate: {
            path: 'items.item',
            model: 'Item',
            select: 'name price images'
        }
    });
        if (!userExists) {
            return response_400(res, "This email doesn't exist");
        }

        return response_200(res, "get Profile", {
            name: userExists.name,
            email: userExists.email,
            address: userExists.address,
            profilePicture: userExists.profilePicture,
            role: userExists.role,
            orders:userExists.orders,
        });

    }
    catch(err){
        return response_400(res, err);
    }
}


exports.updateUserRole = async (req, res) => {
    try {
        const { email, newrole } = req.body;

        if (!email || !newrole) {
            return response_400(res, "Email and new role are required");
        }

        const userExists = await User.findOne({ email: email });
        if (!userExists) {
            return response_400(res, "User not found");
        }

        userExists.role = newrole;

        await userExists.save();

        return response_200(res, "User role updated successfully", {
            email: userExists.email,
            newRole: userExists.role,
        });
    } catch (err) {
        return response_500(res, "Failed to update user role", err);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role __created orders');

        if (!users || users.length === 0) {
            return response_400(res, "No users found");
        }

        return response_200(res, "Users fetched successfully", users);
    } catch (err) {
        return response_500(res, "Failed to fetch users", err);
    }
};