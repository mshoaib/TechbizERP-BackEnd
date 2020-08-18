//@ Validation for Item Category
const Joi = require('@hapi/joi');

const joiCoaLeveValidate = Joi.object({
  COA_Desc: Joi.string().max(250),
  COA_Length: Joi.number(),
  COA_Div_Seg: Joi.string().max(1),
  Remarks: Joi.string().max(500).allow(null).allow(''),
  Organization_ID: Joi.number().required(),
  Enabled_Flag: Joi.string(),
  Creation_Date: Joi.date(),
  Created_By: Joi.number().required(),
  Last_Updated_By: Joi.number().required()
});

module.exports = {
  joiCoaLeveValidate
};
