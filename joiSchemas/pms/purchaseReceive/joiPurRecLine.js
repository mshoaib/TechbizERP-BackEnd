//@ Validation for Purchase Receving Line
const Joi = require('@hapi/joi');

const joiPurRecLineValidate = Joi.object({
    Item_ID : Joi.number().required(),
    UOM_Name: Joi.string(), 
    Qty: Joi.number().required(),
    Price: Joi.number().min(1).max(99999999999).required(),
	GST_Amt: Joi.number().min(1).max(99999999999).required(),
	GST_Per: Joi.number().min(1).max(99999999999).required(),
	Item_Qty: Joi.number().integer().min(1).max(99999999999).required(),
	Total_Amt: Joi.number().min(1).max(99999999999).required(),
	Created_By: Joi.number().integer().min(1).max(99999999999).required(),
	Creation_Date: Joi.date().required(),
	Last_Updated_Date: Joi.date().required(),
	Last_Updated_By: Joi.number().integer().min(1).max(99999999999).required(),

})

module.exports = {
	joiPurRecLineValidate
}