//@ Validation for Item Sub Category
const Joi = require('@hapi/joi');

const joiIscValidate = Joi.object({
	Item_Sub_Category_Name : Joi.string().max(250).required(),
    Item_Sub_Category_Desc: Joi.string().max(500).required(),
    Item_Category_ID: Joi.number().required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiIscValidate
}