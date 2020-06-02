//@ Validation for Department
const Joi = require('@hapi/joi');

const joiDeptValidate = Joi.object({
	Department_Name : Joi.string().max(250).required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiDeptValidate
}