//@ Validation for Business Group
const Joi = require('@hapi/joi');

const joiBusgrpValidate = Joi.object({
    Business_Group_Name : Joi.string().max(250).required(),
    Business_Group_Desc : Joi.string().max(250),
    Business_Group_AddressLine1: Joi.string().max(250),
    Business_Group_AddressLine2: Joi.string().max(250).required(),
    City_ID: Joi.number().required(), 
    Business_Group_TelNo1 : Joi.string().max(50),
    Business_Group_TelNo2  : Joi.string().max(50),
    Business_Group_Email   : Joi.string().max(50),
    Business_Group_Website : Joi.string().max(50),
    Business_Group_NTN_NO  : Joi.string().max(50),
    Business_Group_GST_NO  : Joi.string().max(50),
    Business_Group_Book_ID : Joi.string().max(50),
    Business_Group_Account_ID : Joi.string().max(50),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
	joiBusgrpValidate
}