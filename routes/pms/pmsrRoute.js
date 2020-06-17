const router = require('express').Router();
const asynchandler = require(`../../middleware/async`);
const ErrorResponse = require(`../../utils/errorResponse`);
const connectDb = require(`../../config/db`);

// @route    GET /api/pms/suppliers
// @desc     Get Supplier List
// @access   Private
router.get(
  '/suppliers/:city?/:type?',
  asynchandler(async (req, res, next) => {
    const reqQuery = { ...req.query };
    const { city, type } = reqQuery;

    let query = `
 SELECT Supplier_Name, supplier_type, concat(supplier.Address_Line1,' ',supplier.Address_Line2)Address, City_Name, Tel_NO1, Email, Contact_Person, supplier.Enabled_Flag, supplier.NTN_NO,supplier.Sales_Tax_NO FROM supplier
JOIN city
WHERE supplier.City_ID = city.City_ID
${city ? ` AND ( city.City_Name = '${city}' ) ` : ''}
${type ? ` AND ( supplier.Supplier_Type = '${type}' ) ` : ''}
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

// @route    GET /api/pms/cities
// @desc     Get cities
// @access   Private
router.get(
  '/cities',
  asynchandler(async (req, res, next) => {
    let query = `SELECT City_Name, City_ID FROM city ORDER BY City_Name`;

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

// @route    GET /api/pms/types
// @desc     Get Sub Category
// @access   Private
router.get(
  '/types',
  asynchandler(async (req, res, next) => {
    let query = `SELECT Supplier_Type_ID, Supplier_Type FROM supplier_type ORDER BY Supplier_Type`;

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

// @route    GET /api/pms/types
// @desc     Get Invoice Details
// @access   Private
router.get(
  '/invoice/:id',
  asynchandler(async (req, res, next) => {
    let query = `SELECT PO_NO, Payment_type, item_name, price, GST_per, ROUND(Total_Amt,2) as Total_Amt, Item_Qty, Supplier_name, Address_line1, Address_line2, item_Code, UOM_Name, DATE_FORMAT(PO_DATE, "%D-%M-%Y") as PO_DATE, GST_Per,GST_Amt,  purchase_order_header.PO_HEADER_ID  FROM purchase_order_header
  LEFT JOIN purchase_order_line
    ON purchase_order_header.PO_Header_ID = purchase_order_line.PO_Header_ID
  LEFT JOIN item
    ON purchase_order_line.Item_ID = item.Item_ID
  LEFT JOIN supplier
    ON purchase_order_header.Supplier_Id = supplier.Supplier_ID
  WHERE purchase_order_header.PO_HEADER_ID = ${req.params.id}
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
