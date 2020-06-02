const Joi = require('@hapi/joi');

const joiUserRolesInsert = Joi.object({
	User_ID : Joi.number().integer().min(1).max(99999999999).required(),
	Role_ID: Joi.number().integer().min(1).max(99999999999).required(),
	Enabled_Flag: Joi.string().max(1).required(),
	Organization_ID: Joi.number().integer().min(1).max(99999999999).required(),
	Creation_Date: Joi.date().required(),
	Created_By: Joi.number().integer().min(1).max(99999999999).required(),
	Last_Updated_Date: Joi.date().required(),
	Last_Updated_By: Joi.number().integer().min(1).max(99999999999).required(),
}).options({stripUnknown:true})

const joiUserRolesUpdate = Joi.object({
	User_Role_ID: Joi.number().integer().min(1).max(99999999999),
	User_ID : Joi.number().integer().min(1).max(99999999999),
	Roles_ID: Joi.number().integer().min(1).max(99999999999),
	Enabled_Flag: Joi.string().max(1),
	Organization_ID: Joi.number().integer().min(1).max(99999999999),
	Created_By: Joi.number().integer().min(1).max(99999999999),
	Last_Updated_Date: Joi.date(),
	Last_Updated_By: Joi.number().integer().min(1).max(99999999999),
}).options({stripUnknown:true})


module.exports = {
	joiUserRolesInsert,
	joiUserRolesUpdate
}