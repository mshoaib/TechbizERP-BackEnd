const router = require('express').Router();
const pool = require('../../config/db');

const { joiBankValidate } = require('../../joiSchemas/fin/joiBank');

// @route    GET /api/fin/get-bank
// @desc     Get Banks
// @access   Private

router.get('/get-bank', async (req, res) => {
  pool.query(`SELECT * FROM bank`, (err, rows, fields) => {
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

// @route    POST /api/fin/create-bank
// @desc     Create bank
// @access   Private

router.post('/create-bank', async (req, res) => {
  let current_date = new Date();
  const body = req.body;

  const { error, value } = joiBankValidate.validate(req.body);
  console.log(`Value from Joi - ${value}`);
  if (error) {
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      `SELECT  COUNT(Bank_Name) as count FROM bank WHERE Bank_Name = "${body.Bank_Name}"`,

      (err, results, fields) => {
        if (!err) {
          // res.send(results)
          if (results[0].count >= 1) {
            return res.status(403).json({
              sucess: 0,
              message:
                'This Bank Name already exists. Please try different Bank Name',
              results,
              fields
            });
          } else {
            pool.query(
              `INSERT INTO bank (Bank_Name, Bank_Short_Code, IBN_NO, email, website, Remarks, Enabled_Flag, Organization_ID, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
              [
                body.Bank_Name,
                body.Bank_Short_Code,
                body.IBN_NO,
                body.email,
                body.website,
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

// @route    PUT /api/fin/update-bank/id
// @desc     Update Bank
// @access   Private
router.put('/update-bank/:id', (req, res) => {
  const { error, value } = joiBankValidate.validate(req.body);
  //console.log('Value from Joi',value);
  if (error) {
    // console.log(error);
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      `SELECT  COUNT(Bank_Name) as count, Bank_ID FROM bank WHERE Bank_Name = "${req.body.Bank_Name}"`,

      (err, results, fields) => {
        if (!err) {
          // res.send(results)

          if (results[0].count >= 1 && +results[0].Bank_ID !== +req.params.id) {
            return res.status(403).json({
              sucess: 0,
              message:
                'This Bank Name already exists. Please try different Bank Name',
              results,
              fields
            });
          } else {
            pool.query(
              'UPDATE bank SET ? Where Bank_ID = ?',
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

// @route    DELETE /api/fin/delete-bank/id
// @desc     Delete Bank
// @access   Private

router.delete('/delete-bank/:id', (req, res) => {
  pool.query(
    'DELETE from Bank Where Bank_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `Bank ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
