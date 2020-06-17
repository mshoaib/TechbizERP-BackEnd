const router = require('express').Router();
const asynchandler = require(`../../middleware/async`);
const ErrorResponse = require(`../../utils/errorResponse`);
const connectDb = require(`../../config/db`);

// @route    GET /api/inv/items
// @desc     Get Items
// @access   Private
router.get(
  '/items',
  asynchandler(async (req, res, next) => {
    const reqQuery = { ...req.query };
    const {
      subCategory,
      purchasableItem,
      SalesOrderItem,
      InventoryItem
    } = reqQuery;

    let query = `
SELECT i.Item_Code,i.Item_Name,isc.Item_Sub_Category_Name "SubCat",u.UOM_Short_Code "UOM",

 IF ( i.Purchaseable_Item_Flag = "Y", true,false) "PItem", IF ( i.Customer_Order_Item_Flag = "Y", true,false) "COItem" ,

 IF ( i.Inventory_Item_Flag = "Y", true,false) "InvItem", IF ( i.Sales_Order_Item_Flag = "Y", true,false) "SOItem"

FROM item i , uom u, item_sub_category isc

WHERE i.UOM_ID = u.UOM_ID

and i.Item_Sub_Category_ID = isc.Item_Sub_Category_ID
${subCategory ? ` AND ( isc.Item_Sub_Category_Name = '${subCategory}' ) ` : ''}
${InventoryItem ? ` AND ( i.Inventory_Item_Flag = '${InventoryItem}' ) ` : ''}
${
  SalesOrderItem
    ? ` AND ( i.Sales_Order_Item_Flag = '${SalesOrderItem}' ) `
    : ''
}
${
  purchasableItem
    ? ` AND ( i.Purchaseable_Item_Flag = '${purchasableItem}' ) `
    : ''
}
  `;

    connectDb.query(query, (error, results, fields) => {
      if (error) {
        return next(new ErrorResponse(error.message), 404);
      }

      res.status(200).json({
        success: true,
        data: results
      });
    });
  })
);

// @route    GET /api/inv/subcategory
// @desc     Get Sub Category
// @access   Private
router.get(
  '/subcategory',
  asynchandler(async (req, res, next) => {
    let query = `
 SELECT Item_Sub_Category_Name, Item_Sub_Category_ID FROM item_sub_category
  `;

    connectDb.query(query, (error, results, fields) => {
      if (error) {
        return next(new ErrorResponse(error.message), 404);
      }
      res.status(200).json({
        success: true,
        data: results
      });
    });
  })
);

module.exports = router;
