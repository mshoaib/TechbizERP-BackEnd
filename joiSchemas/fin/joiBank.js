//@ Validation for Item Category
const Joi = require('@hapi/joi');

const joiBankValidate = Joi.object({
  Bank_Name: Joi.string().max(250).required(),
  Bank_Short_Code: Joi.string().max(50),
  IBN_NO: Joi.string().max(50),
  email: Joi.string().email().allow(''),
  website: Joi.string()
    .regex(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
    )
    .allow(''),
  Remarks: Joi.string().max(500).allow(null).allow(''),
  Organization_ID: Joi.number().required(),
  Enabled_Flag: Joi.string(),
  Creation_Date: Joi.date(),
  Created_By: Joi.number().required(),
  Last_Updated_By: Joi.number().required()
});

module.exports = {
  joiBankValidate
};
