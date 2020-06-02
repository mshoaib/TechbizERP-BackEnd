const Joi = require('@hapi/joi');

const joiPurchaseHeaderInsert = Joi.object({
	PO_NO: Joi.string().max(50).required(),
	PO_Date: Joi.date().required(),
	Supplier_ID: Joi.number().integer().min(1).max(99999999999).required(),
	Ship_To_ID: Joi.number().integer().min(1).max(99999999999).required(),
	Payment_Type : Joi.string().max(25).required(),
	Ref_No: Joi.string().max(25).required(),
	Remarks: Joi.string().max(500).required(),
	Status: Joi.string().max(50).required(),
	Approved_By_ID: Joi.number().integer().min(1).max(99999999999).required(),
	Approved_Date: Joi.date().required(),
	Organization_ID: Joi.number().integer().min(1).max(99999999999).required(),
	Created_By:Joi.number().integer().min(1).max(99999999999).required(),
	Last_Updated_Date: Joi.date().required(),
	Last_Updated_By: Joi.number().integer().min(1).max(99999999999).required()
})

const joiPurchaseHeaderUpdate = Joi.object({
	PO_Header_ID: Joi.number().integer().min(1).max(99999999999), 
	PO_NO: Joi.string().max(50),
	PO_Date: Joi.date(),
	Supplier_ID: Joi.number().integer().min(1).max(99999999999),
	Ship_To_ID: Joi.number().integer().min(1).max(99999999999),
	Payment_Type : Joi.string().max(25),
	Ref_No: Joi.string().max(25),
	Remarks: Joi.string().max(500),
	Status: Joi.string().max(50),
	Enabled_Flag: Joi.string().max(1),
	Approved_By_ID: Joi.number().integer().min(1).max(99999999999),
	Approved_Date: Joi.date(),
	Last_Updated_Date: Joi.date(),
	Last_Updated_By: Joi.number().integer().min(1).max(99999999999)
}).options({stripUnknown:true})

module.exports = {
	joiPurchaseHeaderInsert,
	joiPurchaseHeaderUpdate
} 