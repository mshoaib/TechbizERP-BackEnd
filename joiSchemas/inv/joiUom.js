const Joi = require('@hapi/joi');

const joiUOMInsert = Joi.object({
	UOM_Name: Joi.string().max(50).required(),
	UM_Desc: Joi.string().max(250).required(),
	UOM_Short_Code: Joi.string().max(15).required(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiUOMInsert
}