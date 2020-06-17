const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../../config/db');
const os = require('os');
const {
  joiPurRecHeaderValidate
} = require('../../../joiSchemas/pms/purchaseReceive/joiPurRecHeader');
const {
  joiPurRecLineValidate
} = require('../../../joiSchemas/pms/purchaseReceive/joiPurRecLine');

// @route    GET /api/pms/purchaseRece
// @desc     Get Header
// @access   Private

router.get('/get-header/:Organization_ID', async (req, res) => {
  const { Organization_ID } = req.params;

  pool.query(
    `SELECT prh.PR_Header_ID,prh.PR_NO,
                prh.PR_Date,prh.Supplier_ID,s.Supplier_Name, 
                prh.PO_Header_ID,poh.PO_NO, prh.Receive_Location_ID,d.Department_Name,
                prh.Status,prh.Approved_By_ID,prh.Approved_Date,prh.Remarks,
                prh.Organization_ID,prh.Organization_ID,prh.Branch_ID,prh.Creation_Date,
                prh.Created_By,prh.Last_Updated_Date,prh.Last_Updated_By    
                from purchase_receive_header prh , supplier s , 
                purchase_order_header poh ,department d
                WHERE prh.Supplier_ID = s.Supplier_ID
                AND prh.PO_Header_ID = poh.PO_Header_ID
                AND prh.Receive_Location_ID = d.Department_ID
                AND prh.Organization_ID = ${Organization_ID}`,
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

// @route    GET /api/pms/purchaseRece
// @desc     Get Line
// @access   Private

router.get('/get-line/:PR_Header_ID', async (req, res) => {
  const { PR_Header_ID } = req.params;

  pool.query(
    `SELECT prl.PR_Line_ID,prl.PR_Header_ID,prl.Item_ID,i.Item_Name,
                prl.UOM_Name,u.UOM_Short_Code,prl.Qty, prl.Price,prl.GST_Per,
                prl.GST_Amt,prl.WHT_Per,prl.WHT_Amt,prl.Total_Amt,prl.Creation_Date,
                prl.Created_By,prl.Last_Updated_Date,prl.Last_Updated_By
                from purchase_receive_line prl , item i , uom u
                WHERE prl.Item_ID = i.Item_ID
                AND   prl.UOM_Name = u.UOM_Name
                AND  prl.PR_Header_ID = ${PR_Header_ID}`,
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

// @route    GET /api/pms/purchaseRece
// @desc     Populate Purchase Order Line
// @access   Private

router.get('/populate-polline/:PO_Header_ID', async (req, res) => {
  const { PO_Header_ID } = req.params;

  pool.query(
    `SELECT pol.Item_ID,i.Item_Name,pol.UOM_Name,pol.Price,pol.Item_Qty,
                pol.GST_Per,pol.GST_Amt,pol.Total_Amt
                FROM purchase_order_line pol , item i 
                WHERE pol.Item_ID = i.Item_ID 
                and pol.PO_Header_ID  = ${PO_Header_ID}`,
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

// Create Department

router.post('/create-dept', (req, res) => {
  let current_date = new Date();

  let data = {
    dept_no: req.body.dept_no,
    dept_loc: req.body.dept_loc,
    Creation_Date: current_date
  };
  let sql = 'INSERT INTO dept SET ?';
  let query = pool.query(sql, data, (err, results) => {
    if (err) {
      //res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
      return res.status(400).send(err);
    }
    return res.status(200).send(`Dept : ${results.insertId} Record Inserted`);
  });
});

// router.post("/create-dept", (req, res) => {
//     //const header  = req.body;
//       let {data} = {dept_no: req.body.dept_no, dept_loc: req.body.dept_loc,Creation_Date: req.body.Creation_Date};

//     const { type } = req.params;
//   let  error = "";

// //	let { error, value } = joiPurchaseLineArray.validate(lines);
// 	//let { error1, value1 } = joiPurchaseHeaderInsert.validate(header);
// 	if (error) {
// 		console.log(error,error1)
// 		return res.status(403).send(error);
// 	} else {
// 		let sql = "INSERT INTO dept SET ?";
// 		pool.query(sql, data, (err, result) => {
// 			if (err) {
// 				console.log(err);
// 				return res.status(400).send(err);
// 			}

// 		});
// 	}
// });

router.post('/create-purchaseRece', (req, res) => {
  const { lines, header } = req.body;
  const { type } = req.params;
  let error = '';

  //	let { error, value } = joiPurchaseLineArray.validate(lines);
  //let { error1, value1 } = joiPurchaseHeaderInsert.validate(header);
  if (error) {
    console.log(error, error1);
    return res.status(403).send(error);
  } else {
    let sql = 'INSERT INTO purchase_receive_header SET ?';
    pool.query(sql, header, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }
    });
  }
});

// @route    POST /api/pms/purchaseRece/create-purchaseRece
// @desc     Create Supplier
// @access   Private

// router.post('/create-purchaseRece', async (req, res) => {

//     let current_date = new Date();
//     const [pr_header,pr_line] = req.body;
//     const { error, value } = joiPurRecHeaderValidate.validate(req.body);
//     console.log(`Value from Joi - ${value}`);
//     if (error) {
//         console.log(error);
//         return res.status(403).send(error);
//     }
//     else {
//         pool.query(
//             `insert into purchase_receive_header
//            (PR_NO,     PR_Date,         Supplier_ID,   PO_Header_ID,    Receive_Location_ID,
//             Status,    Approved_By_ID,  Approved_Date, Remarks,         Organization_ID,
//             Branch_ID, Creation_Date,   Created_By,    Last_Updated_By )
//             values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//             [
//             body.PR_NO,
//             current_date,
//             body.Supplier_ID,
//             body.PO_Header_ID,
//             body.Receive_Location_ID,
//             body.Status,
//             body.Approved_By_ID,
//             body.Approved_Date,
//             body.Remarks,
//             body.Organization_ID,
//             body.Branch_ID,
//             current_date,
//             body.Created_By,
//             body.Last_Updated_By
//             ],

//             (err, results, fields) => {
//                 if (!err) {
//                     // res.send(results)
//                     return res.status(200).json({
//                         sucess: 0,
//                         message: "Record has been insert --",
//                         results,
//                         fields
//                     })
//                 }
//                 else {
//                     return res.status(500).json({
//                         sucess: 1,
//                         message: err.sqlMessage
//                     }
//                     );
//                 }
//             })

//     }
// })

// @route    PUT /api/psm/update-supplier/id
// @desc     Update Supplier
// @access   Private
router.put('/update-supplier/:id', (req, res) => {
  const { error, value } = joiSupplierValidate.validate(req.body);
  //console.log('Value from Joi',value);

  if (error) {
    // console.log(error);
    return res.status(403).send(error);
  } else {
    pool.query(
      'UPDATE Supplier SET ? Where Supplier_ID = ?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) throw err;

        // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg: `Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      }
    );
  }
});

// @route    DELETE /api/psm/delete-supplier/id
// @desc     Delete Supplier
// @access   Private

router.delete('/delete-supplier/:id', (req, res) => {
  pool.query(
    'DELETE from Supplier Where Supplier_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `Supplier ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
