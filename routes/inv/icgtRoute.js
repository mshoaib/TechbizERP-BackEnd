const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiIcgtValidate } = require('../../joiSchemas/inv/joiIcgt');

// @route    GET /api/inv/get-icgt
// @desc     Get Item Category Group Type
// @access   Private

router.get('/get-icgt', async (req, res) => {
  pool.query('select * from item_category_group_type', (err, rows, fields) => {
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

// @route    POST /api/inv/create-icgt
// @desc     Create Item Category Group Type
// @access   Private

router.post('/create-icgt', async (req, res) => {
  let current_date = new Date();
  const body = req.body;

  const { error, value } = joiIcgtValidate.validate(req.body);
  //console.log(`Value from Joi - ${value}`);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    pool.query(
      `insert into item_category_group_type
    (Item_Cat_Grp_Type_Name,Item_Cat_Grp_Type_Desc,Organization_ID,
     Enabled_Flag,Creation_Date,Created_By,Last_Updated_By )
     values(?,?,?,?,?,?,?)`,
      [
        body.Item_Cat_Grp_Type_Name,
        body.Item_Cat_Grp_Type_Desc,
        body.Organization_ID,
        body.Enabled_Flag,
        current_date,
        body.Created_By,
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

// @route    PUT /api/inv/update-icgt/id
// @desc     Update Item Category Group Type
// @access   Private
router.put('/update-icgt/:id', (req, res) => {
  const { error, value } = joiIcgtValidate.validate(req.body);
  console.log('Value from Joi', value);
  if (error) {
    // console.log(error);
    return res.status(403).send(error);
  } else {
    pool.query(
      'UPDATE item_category_group_type SET ? Where Item_Cat_Grp_Type_ID = ?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) throw err;

        console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg: `Changed ${result.changedRows} row(s)`,
          updated: true
        });
      }
    );
  }
});

// @route    DELETE /api/inv/delete-icgt/id
// @desc     Delete Item Category Group Type
// @access   Private

router.delete('/delete-icgt/:id', (req, res) => {
  pool.query(
    'DELETE from item_category_group_type Where Item_Cat_Grp_Type_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `Item Category Group Type ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
