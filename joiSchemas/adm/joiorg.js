//@ Validation for Organization
const Joi = require('@hapi/joi');

const joiOrgValidate = Joi.object({
	Organization_Name : Joi.string().max(250).required(),
    Organization_AddressLine1 : Joi.string().max(250).required(),
    City_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiOrgValidate
}