//@ Validation for Branch
const Joi = require('@hapi/joi');

const joiBranchValidate = Joi.object({
	Branch_Name : Joi.string().max(250).required(),
    Branch_Address_Line1 : Joi.string().max(250).required(),
    City_ID: Joi.number().required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiBranchValidate
}