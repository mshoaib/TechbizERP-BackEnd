const Joi = require('@hapi/joi');

const joiPurInvoiceLine = Joi.array().items({
  Item_ID: Joi.number().max(50).required(),
  UOM_Name: Joi.string().required(),
  priceWithoutGST: Joi.number(),
  items: Joi.string(),
  Qty: Joi.number().required(),
  Price: Joi.number().required(),
  GST_Per: Joi.number().required(),
  GST_Amt: Joi.number().required(),
  AMT_Without_GST: Joi.number(),
  WHT_Per: Joi.number(),
  WHT_Amt: Joi.number(),
  Total_Amt: Joi.number().required(),
  Created_By: Joi.number().integer().min(1).max(99999999999).allow(null),
  Last_Updated_By: Joi.number().integer().min(1).max(99999999999).allow(null)
});

module.exports = {
  joiPurInvoiceLine
};
