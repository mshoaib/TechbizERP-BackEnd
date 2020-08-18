const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiCoaLeveValidate } = require('../../joiSchemas/fin/joiCoaLeve');

// @route    GET /api/fin/get-coaleve
// @desc     Get COA Levels
// @access   Private

router.get('/get-coaleve', async (req, res) => {
  pool.query(`SELECT * FROM coa_leve`, (err, rows, fields) => {
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

// @route    POST /api/fin/create-coaleve
// @desc     Create COA Level
// @access   Private

router.post('/create-coaleve', async (req, res) => {
  let current_date = new Date();
  const body = req.body;

  const { error, value } = joiCoaLeveValidate.validate(req.body);
  console.log(`Value from Joi - ${value}`);
  if (error) {
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      `insert into coa_leve
           (COA_Desc, COA_Length, COA_Div_Seg, Remarks, Enabled_Flag, Organization_ID, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By)
            values(?,?,?,?,?,?,?,?,?,?)`,
      [
        body.COA_Desc,
        body.COA_Length,
        body.COA_Div_Seg,
        body.Remarks,
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
  }
});

// @route    PUT /api/fin/update-coaleve/id
// @desc     Update COA level
// @access   Private
router.put('/update-coaleve/:id', (req, res) => {
  const { error, value } = joiCoaLeveValidate.validate(req.body);
  //console.log('Value from Joi',value);
  if (error) {
    // console.log(error);
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      'UPDATE coa_leve SET ? Where COA_Level_ID = ?',
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

// @route    DELETE /api/fin/delete-coaleve/id
// @desc     Delete CAO level
// @access   Private

router.delete('/delete-coaleve/:id', (req, res) => {
  pool.query(
    'DELETE from coa_leve Where COA_Level_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `COA LEVEL ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
