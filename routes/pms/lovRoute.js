const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../config/db');

// @route    GET /api/pms/lov/get-supplierType-lov
// @desc     Get Item Category Group Type
// @access   Private

router.get('/lov/get-supplierType-lov', async (req, res) => {
  pool.query(
    `SELECT st.Supplier_Type FROM supplier_type st 
                ORDER BY st.Supplier_Type`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length == 0) {
          return res.status(200).json({
            sucess: 1,
            message: 'Record no found '
          });
        } else {
          res.send(rows);
        }
      } else {
        return res.status(500).json({
          sucess: 0,
          message: 'Database is not connected. '
        });
      }
    }
  );
});

// @route    GET /api/pms/lov/get-city-lov
// @desc     Get City
// @access   Private

router.get('/lov/get-city-lov', async (req, res) => {
  pool.query(
    `SELECT c.City_Name,c.City_ID  FROM city c 
              WHERE c.Enabled_Flag ='Y'
              ORDER by c.City_Name`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length == 0) {
          return res.status(200).json({
            sucess: 1,
            message: 'Record no found '
          });
        } else {
          res.send(rows);
        }
      } else {
        return res.status(500).json({
          sucess: 0,
          message: 'Database is not connected. '
        });
      }
    }
  );
});

// @route    GET /api/pms/lov/get-country-lov
// @desc     Get Country
// @access   Private

router.get('/lov/get-country-lov', async (req, res) => {
  pool.query(
    `SELECT C.Country_Name,C.Country_ID 
              FROM COUNTRY C
               WHERE C.Enabled_Flag ='Y'
               ORDER BY C.Country_Name`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length == 0) {
          return res.status(200).json({
            sucess: 1,
            message: 'Record no found '
          });
        } else {
          res.send(rows);
        }
      } else {
        return res.status(500).json({
          sucess: 0,
          message: 'Database is not connected. '
        });
      }
    }
  );
});

// @route    GET /api/pms/lov/get-po_no-lov
// @desc     Get Purchase Order No
// @access   Private

router.get('/lov/get-po_no-lov/:Organization_ID', async (req, res) => {
  const { Organization_ID } = req.params;

  pool.query(
    `SELECT p.PO_NO,p.PO_Header_ID ,p.Supplier_ID
              FROM purchase_order_header p
              where p.status = 'Y'
              and p.Organization_ID = ${Organization_ID}`,
    (err, rows, fields) => {
      if (!err) {
        if (rows.length == 0) {
          return res.status(200).json({
            sucess: 1,
            message: 'Record no found '
          });
        } else {
          res.send(rows);
        }
      } else {
        return res.status(500).json({
          sucess: 0,
          message: 'Database is not connected. '
        });
      }
    }
  );
});

router.get('/lov/get-uom/:Organization_ID', async (req, res) => {
  console.log('hi');
  const { Organization_ID } = req.params;

  pool.query(
    `
    SELECT UOM_Short_Code, Item_ID, Item_Name 
              FROM uom u ,item i
              where u.UOM_ID = i.UOM_ID
              and u.Organization_ID = ${Organization_ID}
    `,
    (err, rows, fields) => {
      console.log(rows);
      if (!err) {
        if (rows.length == 0) {
          return res.status(200).json({
            sucess: 1,
            message: 'Record no found '
          });
        } else {
          res.send(rows);
        }
      } else {
        return res.status(500).json({
          sucess: 0,
          message: 'Database is not connected. '
        });
      }
    }
  );
});

// @route    GET /api/pms/lov/get-items-lov
// @desc     Get item No
// @access   Private
router.get('/lov/get-items-lov/:HeaderID', async (req, res) => {
  const { HeaderID } = req.params;

  pool.query(
    `
 SELECT i.Item_Name as items, (p.Qty*p.Price) as AMT_Without_GST,  p.Last_Updated_By, p.Invoice_Line_ID,p.Invoice_Header_ID,p.Item_ID,p.UOM_Name, p.Qty,p.Price, p.GST_Per,p.GST_Amt,p.Total_Amt 
 FROM purchase_invoice_line p, item i 
 WHERE p.Invoice_Header_ID= ${HeaderID}
  AND p.Item_ID = i.Item_ID
              
    `,
    (err, rows, fields) => {
      console.log(rows);
      if (!err) {
        if (rows.length == 0) {
          return res.status(200).json({
            sucess: 1,
            message: 'Record no found '
          });
        } else {
          res.send(rows);
        }
      } else {
        return res.status(500).json({
          sucess: 0,
          message: 'Database is not connected. '
        });
      }
    }
  );
});

// // @route    GET /api/pms/lov/get-items-sum-lov
// // @desc     Get item sum
// // @access   Private
// router.get('/lov/get-items-sum-lov/:HeaderID', async (req, res) => {
//   const { HeaderID } = req.params;

//   pool.query(
//     `
//   select SUM(p.Total_Amt) AS sum
//   FROM purchase_invoice_line p
//   WHERE p.Invoice_Header_ID= ${HeaderID}

//     `,
//     (err, rows, fields) => {
//       console.log(rows);
//       if (!err) {
//         if (rows.length == 0) {
//           return res.status(200).json({
//             sucess: 1,
//             message: 'Record no found '
//           });
//         } else {
//           res.send(rows);
//         }
//       } else {
//         return res.status(500).json({
//           sucess: 0,
//           message: 'Database is not connected. '
//         });
//       }
//     }
//   );
// });

router.get(
  '/lov/get-pur-invno/:Organization_ID/:Branch_ID',
  async (req, res) => {
    const { Organization_ID, Branch_ID } = req.params;

    pool.query(
      `
  call getPurInv_DocNO(${Organization_ID},${Branch_ID})
    `,
      (err, rows, fields) => {
        console.log(rows);
        if (!err) {
          if (rows.length == 0) {
            return res.status(200).json({
              sucess: 1,
              message: 'Record no found '
            });
          } else {
            res.send(rows);
          }
        } else {
          return res.status(500).json({
            sucess: 0,
            message: 'Database is not connected. '
          });
        }
      }
    );
  }
);

module.exports = router;
