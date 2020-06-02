//@ Validation for Item Category Group 
const Joi = require('@hapi/joi');

const joiIcgValidate = Joi.object({
	Item_Cat_Group_Name : Joi.string().max(250).required(),
    Item_Cat_Group_Desc: Joi.string().max(500).required(),
    Item_Cat_Grp_Type_ID: Joi.number().required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiIcgValidate
}