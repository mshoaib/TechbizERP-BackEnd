//@ Validation for Item Category
const Joi = require('@hapi/joi');

const joiSupplierValidate = Joi.object({
	Supplier_Name : Joi.string().max(250).required(),
    Supplier_Type: Joi.string().max(50).required(),
    Address_Line1: Joi.string().max(250).required(),
    Address_Line2: Joi.string().max(250).required(),
    City_ID : Joi.number().required(),
    Country_ID: Joi.number().required(),
    Tel_NO1: Joi.string().max(50).allow(null),
    Tel_NO2: Joi.string().max(50).allow(null),  
    Email: Joi.string().max(150).allow(null),
    Website: Joi.string().max(150).allow(null),
    Contact_Person : Joi.string().max(150).allow(null),
    Contact_Person_Mobile: Joi.string().max(50).required(),
    Contact_Person_Email: Joi.string().max(50).allow(null),
    NTN_NO: Joi.string().max(50).allow(null),
    Sales_Tax_NO: Joi.string().max(50).allow(null),  
    Remarks: Joi.string().max(500).allow(null),
    Organization_ID: Joi.number().required(),
    Branch_ID : Joi.number().allow(''),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiSupplierValidate
}