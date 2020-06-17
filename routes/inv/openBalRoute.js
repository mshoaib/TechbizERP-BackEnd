const express = require('express');
const app = express();
const router = express.Router();
const moment = require('moment');
const pool = require('../../config/db');
const os = require('os');
const { joiOpenBalValidate } = require('../../joiSchemas/inv/joiobr');

// @route    GET /api/inv/get-opening-bal
// @desc     Get Opening Balance
// @access   Private

router.get('/get-opening-bal/:Organization_ID', async (req, res) => {
  const { Organization_ID } = req.params;

  pool.query(
    `SELECT    	ioq.Header_ID, ioq.Document_No, ioq.Document_Date, ioq.Opening_Bal, ioq.Current_Bal, ioq.Rate, ioq.From_Year, ioq.To_Year, ioq.Status, ioq.Creation_Date, ioq.Created_By, ioq.Last_Updated_Date, ioq.Last_Updated_By, i.Item_ID, i.Item_Name, d.Department_ID, d.Department_Name, b.Branch_ID, b.Branch_Name, o.Organization_ID, o.Organization_Name 
                from item_onhand_quantity ioq , item i , 
                branch b ,department d, organization o
                WHERE ioq.Item_ID = i.Item_ID
                AND ioq.Branch_ID = b.Branch_ID
                AND ioq.Department_ID = d.Department_ID
                AND ioq.Organization_ID = ${Organization_ID}
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

// @route    POST /api/inv/create-opening-bal
// @desc     Create Opening Balance
// @access   Private

router.post('/create-opening-bal', async (req, res) => {
  let current_datetime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  let current_date = new Date().toJSON().slice(0, 10);
  const {
    Document_No,
    Item_ID,
    Opening_Bal,
    Current_Bal,
    Rate,
    From_Year,
    To_Year,
    Status,
    Organization_ID,
    Branch_ID,
    Department_ID,
    Created_By,
    Last_Updated_By
  } = req.body;

  const { error, value } = joiOpenBalValidate.validate(req.body);
  console.log(`Value from Joi - ${value}`);

  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    pool.query(
      `SELECT COUNT(*) as count from item_onhand_quantity ioq
      WHERE ioq.Item_ID  = ${Item_ID}
      AND ioq.Organization_ID =  ${Organization_ID}
      AND ioq.Branch_ID = ${Branch_ID}
      AND ioq.Department_ID = ${Department_ID}
      AND (ioq.From_Year  = ${From_Year}  AND ioq.To_Year = ${To_Year} )`,

      (err, results, fields) => {
        if (!err) {
          // res.send(results)
          if (results[0].count >= 1) {
            return res.status(403).json({
              sucess: 0,
              message: 'Cannot add item with the same financial combination',
              results,
              fields
            });
          } else {
            pool.query(
              `INSERT INTO item_onhand_quantity (Document_No, Document_Date, Item_ID, Opening_Bal, Current_Bal, Rate, From_Year, To_Year, Status, Organization_ID, Branch_ID, Department_ID, Creation_Date, Created_By,  Last_Updated_By, Last_Updated_Date) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              [
                Document_No,
                current_date,
                Item_ID,
                Opening_Bal,
                Current_Bal,
                Rate,
                From_Year,
                To_Year,
                Status,
                Organization_ID,
                Branch_ID,
                Department_ID,
                current_date,
                Created_By,
                Last_Updated_By,
                current_datetime
              ],

              (err, results, fields) => {
                if (!err) {
                  // res.send(results)
                  return res.status(200).json({
                    sucess: 0,
                    message: 'Record has been insert --',
                    results,
                    fields
                  });
                } else {
                  return res.status(500).json({
                    sucess: 1,
                    message: err.sqlMessage
                  });
                }
              }
            );
          }
        } else {
          return res.status(500).json({
            sucess: 1,
            message: err.sqlMessage
          });
        }
      }
    );
  }
});

// @route    PUT /api/inv/update-opening-bal/id
// @desc     Update Opening Balance
// @access   Private
router.put('/update-opening-bal/:id', (req, res) => {
  const {
    Document_Date,
    Item_ID,
    From_Year,
    To_Year,
    Organization_ID,
    Branch_ID,
    Department_ID
  } = req.body;
  console.log(req.body);

  const docdate = Document_Date.split('T')[0];
  console.log(docdate);
  req.body.Document_Date = docdate;
  const { error, value } = joiOpenBalValidate.validate(req.body);
  console.log('Value from Joi', value);
  if (error) {
    // console.log(error);

    return res.status(403).send(error);
  } else {
    pool.query(
      `SELECT COUNT(*) as count,  Header_ID from item_onhand_quantity ioq
      WHERE ioq.Item_ID  = ${Item_ID}
      AND ioq.Organization_ID =  ${Organization_ID}
      AND ioq.Branch_ID = ${Branch_ID}
      AND ioq.Department_ID = ${Department_ID}
      AND (ioq.From_Year  = ${From_Year}  AND ioq.To_Year = ${To_Year} )`,

      (err, results, fields) => {
        if (!err) {
          // res.send(results)
          console.log(results[0].Header_ID);
          console.log(req.params.id);
          console.log(+results[0].Header_ID === +req.params.id);
          console.log(results[0].count);
          if (
            results[0].count >= 1 &&
            +results[0].Header_ID !== +req.params.id
          ) {
            console.log('its cinugb');
            return res.status(403).json({
              sucess: 0,
              message: 'Cannot add item with the same financial combination',
              results,
              fields
            });
          } else {
            pool.query(
              'UPDATE item_onhand_quantity SET ? Where Header_ID = ?',
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
        } else {
          return res.status(500).json({
            sucess: 1,
            message: err.sqlMessage
          });
        }
      }
    );
  }
});

// @route    DELETE /api/psm/delete-opening-bal/id
// @desc     Delete Opening Balance
// @access   Private

router.delete('/delete-opening-bal/:id', (req, res) => {
  pool.query(
    'DELETE from item_onhand_quantity Where Header_ID = ?',
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
