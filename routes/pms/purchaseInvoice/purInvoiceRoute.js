const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../../config/db');
const os = require('os');
const {
  joiPurInvoiceHeader
} = require('../../../joiSchemas/pms/purchaseInvoice/joiPurInvoiceHeader');
const {
  joiPurInvoiceLine
} = require('../../../joiSchemas/pms/purchaseInvoice/joiPurInvoiceLine');

// @route    GET /api/pms/get-pur-invoice
// @desc     Get Purchase Invoice
// @access   Private

router.get('/get-pur-invoice', async (req, res) => {
  pool.query(
    `SELECT  pih.Invoice_NO, pih.PO_Date, pih.Invoice_Currency_Code, pih.Remarks, pih.Invoice_Header_ID, pih.Invoice_Date, s.Supplier_Name, pih.Sup_Inv_Rece_Date, pih.Goods_Rece_Ddate, pih.Inv_Pay_Dues_Days, d.Department_Name, d.Department_ID, s.Supplier_ID, pih.PO_NO, pih.Invoice_Amount, pih.Approved_Amount, pih.Status,  pih.Organization_ID,pih.Branch_ID,pih.Creation_Date,pih.Created_By,
                 s.Last_Updated_Date,s.Last_Updated_By
                 FROM supplier s , purchase_invoice_header pih ,  department d
                 WHERE s.Supplier_ID = pih.Supplier_ID 
              
                 AND pih.Deliver_To_ID = d.Department_ID   
               `,
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

// @route    POST /api/pms/create-pur-invoice
// @desc     Create Purchase Invoice
// @access   Private

router.post('/create-pur-invoice', async (req, res) => {
  let current_date = new Date();
  const body = req.body.header;
  if (body.Invoice_Date) {
    body.Invoice_Date = body.Invoice_Date.split('-').reverse().join('-');
  }
  if (body.Sup_Inv_Rece_Date) {
    body.Sup_Inv_Rece_Date = body.Sup_Inv_Rece_Date.split('-')
      .reverse()
      .join('-');
  }
  if (body.Goods_Rece_Ddate) {
    body.Goods_Rece_Ddate = body.Goods_Rece_Ddate.split('-')
      .reverse()
      .join('-');
  }
  if (body.PO_Date) {
    body.PO_Date = body.PO_Date.split('-').reverse().join('-');
  }

  console.log(req.body.header);
  const line = req.body.line.added;
  allResults = [];

  const headervalidation = joiPurInvoiceHeader.validate(req.body.header);
  const linevalidation = joiPurInvoiceLine.validate(line);
  if (headervalidation.error || linevalidation.error) {
    console.log(linevalidation.error);
    console.log(headervalidation.error);
    console.log(linevalidation.value);

    return res.status(403).send(linevalidation.error);
  } else {
    pool.query(
      `insert into purchase_invoice_header
           (Invoice_NO, Invoice_Date, Supplier_ID, PO_Header_ID, PO_NO, PO_Date, Deliver_To_ID, Set_of_Book_ID, Invoice_Currency_Code, Invoice_Amount, Approved_Amount, Invoice_Type, Invoice_Status, Status, Remarks, Organization_ID, Branch_ID, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By, Financial_Year,Sup_Inv_Rece_Date, Goods_Rece_Ddate, Inv_Pay_Dues_Days)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        body.Invoice_NO,
        body.Invoice_Date,
        body.Supplier_ID,
        body.PO_Header_ID || 1,
        body.PO_NO,
        body.PO_Date || null,
        body.Deliver_To_ID || null,
        body.Set_of_Book_ID || 1,
        body.Invoice_Currency_Code,
        body.Invoice_Amount,
        body.Approved_Amount,
        body.Invoice_Type || 'Manual',
        body.Invoice_Status || 'Incomplete',
        body.Status,
        body.Remarks,
        body.Organization_ID,
        body.Branch_ID,
        current_date,
        body.Created_By,
        current_date,
        body.Last_Updated_By,
        '2020-2021',
        body.Sup_Inv_Rece_Date || null,
        body.Goods_Rece_Ddate || null,
        +body.Inv_Pay_Dues_Days
      ],
      (err, results, fields) => {
        if (err) {
          console.log(err);
        }
        if (!err) {
          // res.send(results)
          if (line.length === 0) {
            return res.json({
              message: 'Rows has been inserted',
              success: 1,
              HeaderId: results.insertId
            });
          }
          line.map(line => {
            pool.query(
              `insert into purchase_invoice_line
           (Item_ID, Invoice_Header_ID, UOM_Name, Qty, Price, GST_Per, GST_Amt, WHT_Per, WHT_Amt, Total_Amt, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

              [
                line.Item_ID,
                results.insertId,
                line.UOM_Name,
                line.Qty,
                line.Price,
                line.GST_Per,
                line.GST_Amt,
                line.WHT_Per || 0,
                line.WHT_Amt || 0,
                line.Total_Amt,
                current_date,
                line.Created_By,
                current_date,
                line.Last_Updated_By
              ],
              (err, results, fields) => {
                if (!err) {
                  allResults.push(results);
                }
              }
            );
          });
          return res.json({
            message: 'Rows has been inserted',
            success: 1,
            HeaderId: results.insertId
          });
        }
      }
    );
  }

  // console.log(`Value from Joi - ${headervalidation.value}`);
});

// @route    PUT /api/psm/update-pur-invoice/id
// @desc     Update Purchase Invoice
// @access   Private
router.put('/update-pur-invoice/:id', (req, res) => {
  let current_date = new Date();
  const body = req.body.header;
  console.log('first');
  console.log(req.body.header);
  if (body.Invoice_Date) {
    body.Invoice_Date = body.Invoice_Date.split('-').reverse().join('-');
  }
  if (body.Sup_Inv_Rece_Date) {
    body.Sup_Inv_Rece_Date = body.Sup_Inv_Rece_Date.split('-')
      .reverse()
      .join('-');
  }
  if (body.Goods_Rece_Ddate) {
    body.Goods_Rece_Ddate = body.Goods_Rece_Ddate.split('-')
      .reverse()
      .join('-');
  }
  if (body.PO_Date) {
    body.PO_Date = body.PO_Date.split('-').reverse().join('-');
  }

  const line = req.body.line.added;
  // if (req.body.Goods_Rece_Ddate === 'Invalid date') {
  //   req.body.Goods_Rece_Ddate = req.body.Goods_Rece_Ddate || null;
  // }
  // if (req.body.Sup_Inv_Rece_Date === 'Invalid date') {
  //   req.body.Sup_Inv_Rece_Date = req.body.Sup_Inv_Rece_Date || null;
  // }
  // if (req.body.PO_Date === 'Invalid date') {
  //   req.body.PO_Date = req.body.PO_Date || null;
  // }
  console.log('second');

  console.log(req.body.header);
  allResults = [];

  const headervalidation = joiPurInvoiceHeader.validate(req.body.header);
  const linevalidation = joiPurInvoiceLine.validate(line);
  if (headervalidation.error || linevalidation.error) {
    console.log(linevalidation.error);
    console.log(headervalidation.error);
    console.log(linevalidation.value);

    return res.status(403).send(linevalidation.error);
  } else {
    pool.query(
      `UPDATE purchase_invoice_header SET ? Where Invoice_Header_ID = ?`,
      [req.body.header, req.params.id],
      (err, results, fields) => {
        if (err) {
          console.log(err);
        }
        if (!err) {
          // res.send(results)
          if (line.length === 0) {
            return res.json({
              message: 'Rows has been updated',
              success: 1,
              HeaderId: results.insertId
            });
          }

          line.map(line => {
            pool.query(
              `insert into purchase_invoice_line
           (Item_ID, Invoice_Header_ID, UOM_Name, Qty, Price, GST_Per, GST_Amt, WHT_Per, WHT_Amt, Total_Amt, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By)
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

              [
                line.Item_ID,
                req.params.id,
                line.UOM_Name,
                line.Qty,
                line.Price,
                line.GST_Per,
                line.GST_Amt,
                line.WHT_Per || 0,
                line.WHT_Amt || 0,
                line.Total_Amt,
                current_date,
                line.Created_By,
                current_date,
                line.Last_Updated_By
              ],
              (err, results, fields) => {
                if (err) {
                  console.log(err);
                }
              }
            );
          });
          return res.json({
            message: 'Rows has been inserted',
            success: 1,
            HeaderId: results.insertId
          });
        }
      }
    );
  }
});

// @route    DELETE /api/psm/delete-pur-invoice/id
// @desc     Delete Purchase Invoice
// @access   Private

router.delete('/delete-pur-invoice/:id', (req, res) => {
  pool.query(
    `SELECT count(1) as count from purchase_invoice_line l
WHERE l.Invoice_Header_ID = ?`,
    [req.params.id],
    (err, result) => {
      if (result[0].count > 0) {
        return res.status(203).json({
          msg: `Invoice Header ID : ${req.params.id} cannot be deleted. Please delete the line first`,
          deleted: false
        });
      } else {
        pool.query(
          'DELETE from purchase_invoice_header Where Invoice_Header_ID = ?',
          [req.params.id],
          (err, result) => {
            if (err) {
              // console.log(err)
              return res.status(400).send(err);
            }
            return res.status(200).json({
              msg: `Invoice Header ID : ${req.params.id} Deleted`,
              deleted: true
            });
          }
        );
      }
    }
  );
});

// @route    DELETE /api/psm/delete-item-line/id
// @desc     Delete item
// @access   Private

router.delete('/delete-item-line/:id', (req, res) => {
  console.log('coming hereeeeeeeeeee');
  pool.query(
    'DELETE from purchase_invoice_line Where Invoice_Line_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `Item ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
