//@ Validation for Item Category
const Joi = require('@hapi/joi');

const joiBranchValidate = Joi.object({
  Branch_Name: Joi.string().max(250).required(),
  Branch_Code: Joi.string().max(50).required(),
  Remarks: Joi.string().max(500).allow(null).allow(''),
  Organization_ID: Joi.number().required(),
  Bank_ID: Joi.number().required(),
  City_ID: Joi.number().required(),
  Address_Line1: Joi.string().required(),
  Address_Line2: Joi.string().allow(''),
  Tel_NO1: Joi.string().required(),
  Tel_NO2: Joi.string().allow(''),
  Email: Joi.string().email().allow(''),
  Enabled_Flag: Joi.string(),
  Creation_Date: Joi.date(),
  Created_By: Joi.number().required(),
  Last_Updated_By: Joi.number().required()
});

module.exports = {
  joiBranchValidate
};
