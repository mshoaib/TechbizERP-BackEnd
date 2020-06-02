//@ Validation for Item Category Group Type
const Joi = require('@hapi/joi');

const joiIcgtValidate = Joi.object({
	Item_Cat_Grp_Type_Name : Joi.string().max(250).required(),
	Item_Cat_Grp_Type_Desc: Joi.string().max(15).required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiIcgtValidate
}