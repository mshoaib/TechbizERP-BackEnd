const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiCoaValidate } = require('../../joiSchemas/fin/joiCoa');

const coaMiddleware = require('../../middleware/coaMiddleware');
const { number } = require('@hapi/joi');

// @route    GET /api/fin/get-coa
// @desc     Get COA
// @access   Private

router.get('/get-coa', async (req, res) => {
  pool.query(`SELECT * FROM coa`, (err, rows, fields) => {
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
  });
});

// @route    POST /api/fin/create-coa
// @desc     Create COA
// @access   Private

router.post('/create-coa', async (req, res) => {
  let current_date = new Date();
  const body = req.body;

  console.log(body);
  const { error, value } = joiCoaValidate.validate(req.body);
  console.log(`Value from Joi - ${value}`);
  if (error) {
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      'CALL getCOA_Code_Proc(?)',
      [body.COA_Parent_ID],

      (err, results, fields) => {
        if (!err) {
          console.log('hii');
          console.log(results[0][0].v_Incrment_COA);

          if (!results[0][0].v_Incrment_COA) {
            return res.status(403).json({
              sucess: 1,
              message:
                'You can not add child on this level. Contact your administrator',
              results,
              fields
            });
          }
          const code = results[0][0].v_Incrment_COA;

          pool.query(
            `insert into coa
           ( COA_Code, COA_Name, COA_Level_ID, COA_Parent_ID, COA_PARENT_CODE, COA_TYPE, Enabled_Flag, Organization_ID, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By)
            values(?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
              code,
              body.COA_Name,
              body.COA_Level_ID + 1,
              body.COA_Parent_ID,
              body.COA_PARENT_CODE,
              'Transaction',
              body.Enabled_Flag,
              body.Organization_ID,
              current_date,
              body.Created_By,
              current_date,
              body.Last_Updated_By
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
          //    }
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

// @route    PUT /api/fin/update-coa/id
// @desc     Update COA level
// @access   Private
router.put('/update-coa/:id', (req, res) => {
  const { error, value } = joiCoaValidate.validate(req.body);
  //console.log('Value from Joi',value);
  if (error) {
    // console.log(error);
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      'UPDATE coa SET ? Where COA_ID = ?',
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

module.exports = router;
