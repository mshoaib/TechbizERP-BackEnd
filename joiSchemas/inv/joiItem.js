//@ Validation for Item
const Joi = require('@hapi/joi');

const joiItemValidate = Joi.object({
	Item_Name : Joi.string().max(250).required(),
    Item_Code: Joi.string().max(15),
    Item_Desc: Joi.string().max(500),
    UOM_ID : Joi.number(),
    Purchaseable_Item_Flag: Joi.string().max(1),
    Customer_Order_Item_Flag: Joi.string().max(1),
    Inventory_Item_Flag: Joi.string().max(1),
    Sales_Order_Item_Flag: Joi.string().max(1),
    Item_Sub_Category_ID: Joi.string().max(1),
    Min_Qty: Joi.number(),
    Max_Qty: Joi.number(),
    Organization_ID: Joi.number().required(),
    Enabled_Flag:Joi.string(),
    Creation_Date:Joi.date(),
	Created_By: Joi.number().required(),
	Last_Updated_By: Joi.number().required()
})

module.exports = {
    joiItemValidate}