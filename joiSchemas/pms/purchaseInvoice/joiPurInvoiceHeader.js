const Joi = require('@hapi/joi');

const joiPurInvoiceHeader = Joi.object({
  Invoice_NO: Joi.string().max(50).required().allow(null),
  Invoice_Date: Joi.string().allow(null),
  PO_Date: Joi.date().allow('').allow(null),
  Supplier_ID: Joi.number().integer().min(1).max(99999999999).required(),
  PO_Header_ID: Joi.number().integer().min(1).max(99999999999).allow(null),
  Deliver_To_ID: Joi.number().allow(null).allow(''),
  Creation_Date: Joi.date(),
  Set_of_Book_ID: Joi.number()
    .integer()
    .min(1)
    .max(99999999999)
    .allow(null)
    .allow(''),
  PO_NO: Joi.string().max(25).allow(null).allow(''),
  Invoice_Currency_Code: Joi.string().max(25).allow(null).allow(''),
  Invoice_Amount: Joi.number().allow(null).allow(''),
  Approved_Amount: Joi.number().allow(null).allow(''),
  Invoice_Type: Joi.string().allow(null).allow(''),
  Invoice_Status: Joi.string().allow(null).allow(''),
  Remarks: Joi.string().max(500).allow(null).allow(''),
  Status: Joi.string().max(50).allow(null).allow(''),
  Organization_ID: Joi.number()
    .integer()
    .min(1)
    .max(99999999999)
    .allow(null)
    .allow(''),
  Branch_ID: Joi.number()
    .integer()
    .min(1)
    .max(99999999999)
    .allow(null)
    .allow(''),
  Created_By: Joi.number()
    .integer()
    .min(1)
    .max(99999999999)
    .allow(null)
    .allow(''),
  Last_Updated_Date: Joi.date().allow(null).allow(''),
  Last_Updated_By: Joi.number()
    .integer()
    .min(1)
    .max(99999999999)
    .allow(null)
    .allow(''),
  Sup_Inv_Rece_Date: Joi.string().allow(null).allow(''),
  Goods_Rece_Ddate: Joi.string().allow(null).allow(''),
  Inv_Pay_Dues_Days: Joi.number().allow(null).allow('')
});

module.exports = {
  joiPurInvoiceHeader
};
