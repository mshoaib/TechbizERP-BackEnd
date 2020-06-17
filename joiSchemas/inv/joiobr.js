//@ Validation for Opening Balance
const Joi = require('@hapi/joi');

const joiOpenBalValidate = Joi.object({
  Document_No: Joi.string().max(250),
  Document_Date: Joi.date(),
  Item_ID: Joi.number().required(),
  Opening_Bal: Joi.number(),
  Current_Bal: Joi.number(),
  Rate: Joi.number(),
  From_Year: Joi.number().required(),
  To_Year: Joi.number().required(),
  Status: Joi.string(),
  Organization_ID: Joi.number().required(),
  Branch_ID: Joi.number().required(),
  Department_ID: Joi.number().required(),
  Created_By: Joi.number(),
  Creation_Date: Joi.date(),
  Last_Updated_By: Joi.number()
});

module.exports = {
  joiOpenBalValidate
};
