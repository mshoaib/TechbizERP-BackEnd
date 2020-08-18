//@ Validation for Item Category
const Joi = require('@hapi/joi');

const joiCoaValidate = Joi.object({
  COA_Name: Joi.string().max(250),
  COA_PARENT_CODE: Joi.string().max(250),
  COA_Parent_ID: Joi.number(),
  COA_Level_ID: Joi.number(),

  Organization_ID: Joi.number().required(),
  Enabled_Flag: Joi.string(),
  Creation_Date: Joi.date(),
  Created_By: Joi.number().required(),
  Last_Updated_By: Joi.number().required()
});

module.exports = {
  joiCoaValidate
};
