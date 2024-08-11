const Kit = require("../models/kits");
const { response_200, response_500, response_400 } = require("../utils/responseCodes.utils");

exports.getKits = async (req, res) => {
    try{
        const kits = await Kit.find().populate("items");
        return response_200(res, "fetched", kits);
    }
    catch(err){
        return response_500(res, "Internal server error occured" ,err);
    }
};

exports.getKit = async (req, res) => {
    try{
        const kit = await Kit.findById(req.params.id).populate("items");
        if(!kit){
            response_400(res, "error finding kit");
        }
        return response_200(res, "fetched", kit);
    }
    catch(err){
        return response_500(res, "Internal server error occured" ,err);
    }
};