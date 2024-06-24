const User = require('../models/user.models');
const {response_400, response_200} = require('../utils/responseCodes.utils')
const bcrypt = require("bcrypt");
const {generateToken} = require("./authControllers")

exports.updateProfile = async (req, res) => {
    
    try{
        const {name, profilePicture, address} = req.body;

        const {email} = req.body.user;

        const userExists = await User.findOne({ email: email }).exec();
        if (!userExists) {
            return response_400(res, "This email doesn't exist");
        }

        let updateobj = {};

        if(name) updateobj.name = name;
        if(profilePicture) updateobj.profilePicture = profilePicture;
        if(address) updateobj.address = address;
          
        const updatedUser = await User.findByIdAndUpdate(userExists._id, updateobj, { new: true });
        const newToken = await generateToken(res, updatedUser);

        return response_200(res, "Data updated", {
            name: updatedUser.name,
            email: updatedUser.email,
            address: updatedUser.address,
            profilePicture: updatedUser.profilePicture,
            token: newToken,
        });

    }
    catch(err){
        return response_400(res, err);
    }
}

exports.getProfile = async (req, res) => {
    
    try{
        const {email} = req.body.user;

        if(!email){
            return response_400(res, "I require user email");
        }

        const userExists = await User.findOne({ email: email }).exec();
        if (!userExists) {
            return response_400(res, "This email doesn't exist");
        }
          
        return response_200(res, "get Profile", {
            name: userExists.name,
            email: userExists.email,
            address: userExists.address,
            profilePicture: userExists.profilePicture,
            role: userExists.role,
        });

    }
    catch(err){
        return response_400(res, err);
    }
}


exports.updateUserRole = async (req, res) => {
    try {
        const { email, newrole } = req.body.user;

        if (!email || !newrole) {
            return response_400(res, "Email and new role are required");
        }

        const userExists = await User.findOne({ email: email }).exec();
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
        const users = await User.find({}, 'name email role');

        if (!users || users.length === 0) {
            return response_400(res, "No users found");
        }

        return response_200(res, "Users fetched successfully", users);
    } 
    catch (err) {
        return response_500(res, "Failed to fetch users", err);
    }
};