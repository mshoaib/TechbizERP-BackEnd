//@ Validation for Purchase Receving Header
const Joi = require('@hapi/joi');

const joiPurRecHeaderValidate = Joi.object({
	PR_NO : Joi.string().max(25).required(),
    PR_Date: Joi.date().required(), 
    Supplier_ID: Joi.number().required(),
    PO_Header_ID: Joi.number().required(),
    Receive_Location_ID: Joi.number().required(),
    Status: Joi.string().max(20).required(),
    Approved_By_ID : Joi.number().allow(null).allow(''),
    Approved_Date: Joi.date().allow('').allow(null),
    Remarks: Joi.string().max(500).allow(null),
    Organization_ID: Joi.number().required(),
    Branch_ID : Joi.number().allow('').allow(null),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiPurRecHeaderValidate
}