//@ Validation for Item Category
const Joi = require('@hapi/joi');

const joiIcValidate = Joi.object({
	Item_Category_Name : Joi.string().max(250).required(),
    Item_Category_Desc: Joi.string().max(500).required(),
    Item_Cat_Group_ID: Joi.number().required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiIcValidate
}