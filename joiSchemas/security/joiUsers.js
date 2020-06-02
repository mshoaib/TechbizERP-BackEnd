const Joi = require('@hapi/joi');

const joiUsersInsert = Joi.object({
	User_Name : Joi.string().max(50).required(),
	User_hpassword: Joi.string().max(250).required(),
	User_Status: Joi.string().max(25).required(),
	User_Email: Joi.string().max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
	User_Mobile: Joi.number().integer().max(99999999999).required(),
	Employee_ID: Joi.number().integer().max(99999999999).allow(''),
	Host_ID_Restric: Joi.string().max(50).allow(''),
	Last_Login_Date: Joi.date().required(),
	Last_Host_ID: Joi.string().max(50).required(),
	Account_Locked_Flag:  Joi.string().max(1).required(),
	HostID_at_Time_Locked: Joi.string().max(50).required(),
	Time_Date_Locked: Joi.date().required(),
	Organization_ID: Joi.number().integer().max(99999999999).required(),
	Branch_ID: Joi.number().integer().max(99999999999).required(),
	Enabled_Flag: Joi.string().max(1).required(),
	Creation_Date: Joi.date().required(),
	Created_By: Joi.number().required(),
	Last_Updated_Date: Joi.date().required(),
	Last_Updated_By: Joi.number().required(),
}).options({stripUnknown:true})

const joiUsersUpdate = Joi.object({
	User_Name : Joi.string().max(50),
	User_hpassword: Joi.string().max(250),
	User_Status: Joi.string().max(25),
	User_Email: Joi.string().max(50).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
	User_Mobile: Joi.number().integer().max(99999999999),
	Employee_ID: Joi.number().integer().max(99999999999).allow(''),
	Host_ID_Restric: Joi.string().max(50).allow(''),
	Last_Host_ID: Joi.string().max(50),
	Last_Login_Date: Joi.date(),
	Account_Locked_Flag:  Joi.string().max(1),
	HostID_at_Time_Locked: Joi.string().max(50),
	Time_Date_Locked: Joi.date(),
	Organization_ID: Joi.number().integer().max(99999999999),
	Branch_ID: Joi.number().integer().max(99999999999),
	Enabled_Flag: Joi.string().max(1),
	Last_Updated_Date: Joi.date(),
	Last_Updated_By: Joi.number().integer().max(99999999999),
}).options({stripUnknown:true})


module.exports = {
	joiUsersInsert,
	joiUsersUpdate
}