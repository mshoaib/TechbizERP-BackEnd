const Joi = require('@hapi/joi');

const joiPurchaseLineInsert = Joi.object({
	Item_ID: Joi.number().integer().min(1).max(99999999999).required(),
	UOM_Name: Joi.string().max(25).required(),
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

const joiPurchaseLineArray = Joi.array().items(joiPurchaseLineInsert).options({stripUnknown:true});

const joiPurchaseLineUpdate = Joi.object({
	PO_Line_ID: Joi.number().integer().min(1).max(99999999999),
	Item_ID: Joi.number().integer().min(1).max(99999999999),
	Item_Qty: Joi.number().integer().min(1).max(99999999999),
	UOM_Name: Joi.string().max(25),
	Price: Joi.number().min(1).max(99999999999),
	GST_Amt: Joi.number().min(1).max(99999999999),
	GST_Per: Joi.number(),
	Total_Amt: Joi.number().min(1).max(99999999999),
	Last_Updated_Date: Joi.date(),
	Last_Updated_By: Joi.number().integer().min(1).max(99999999999),
})

const joiPurchaseLineUpdateArray = Joi.array().items(joiPurchaseLineUpdate).options({stripUnknown:true});


module.exports = {
	joiPurchaseLineArray,
	joiPurchaseLineUpdateArray
}