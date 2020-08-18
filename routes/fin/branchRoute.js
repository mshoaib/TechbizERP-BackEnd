const router = require('express').Router();
const pool = require('../../config/db');

const { joiBranchValidate } = require('../../joiSchemas/fin/joiBranch');

// @route    GET /api/fin/get-branch
// @desc     Get Branchs
// @access   Private

router.get('/get-branch', async (req, res) => {
  pool.query(
    `SELECT bb.Branch_ID, bb.Branch_Name,bb.Bank_ID, bb.Branch_Code, bb.Address_Line1, bb.Address_Line2, bb.City_ID, bb.Tel_NO1, bb.Tel_NO2, bb.Email, bb.Remarks, bb.Enabled_Flag, bb.Organization_ID, bb.Creation_Date, bb.Created_By, bb.Last_Updated_Date, bb.Last_Updated_By , c.City_Name, b.Bank_Name
    FROM bank_branch  bb , city  c , bank b
    WHERE bb.City_ID = c.City_ID
    AND bb.Bank_ID = b.Bank_ID`,
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

// @route    POST /api/fin/create-bank
// @desc     Create bank
// @access   Private

router.post('/create-branch', async (req, res) => {
  let current_date = new Date();
  const body = req.body;

  const { error, value } = joiBranchValidate.validate(req.body);
  console.log(`Value from Joi - ${value}`);
  if (error) {
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      `SELECT  COUNT(Branch_Name) as count FROM bank_branch WHERE Branch_Name = "${body.Branch_Name}"`,

      (err, results, fields) => {
        if (!err) {
          // res.send(results)
          if (results[0].count >= 1) {
            return res.status(403).json({
              sucess: 0,
              message:
                'This Branch Name already exists. Please try different Branch Name',
              results,
              fields
            });
          } else {
            console.log('hiiiiii');
            pool.query(
              `INSERT INTO bank_branch (Branch_Name,Bank_ID, Branch_Code, Address_Line1, Address_Line2, City_ID, Tel_NO1, Tel_NO2, Email, Remarks, Enabled_Flag, Organization_ID, Creation_Date, Created_By, Last_Updated_Date, Last_Updated_By) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
              [
                body.Branch_Name,
                body.Bank_ID,
                body.Branch_Code,
                body.Address_Line1,
                body.Address_Line2,
                body.City_ID,
                body.Tel_NO1,
                body.Tel_NO2,
                body.Email,
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

// @route    PUT /api/fin/update-branch/id
// @desc     Update Branch
// @access   Private
router.put('/update-branch/:id', (req, res) => {
  const { error, value } = joiBranchValidate.validate(req.body);
  //console.log('Value from Joi',value);
  if (error) {
    // console.log(error);
    return res.status(403).json({
      sucess: 1,
      message: error.details[0].message
    });
  } else {
    pool.query(
      `SELECT  COUNT(Branch_Name)  as count, Branch_ID FROM bank_branch WHERE Branch_Name = "${req.body.Branch_Name}"`,

      (err, results, fields) => {
        if (!err) {
          // res.send(results)

          if (
            results[0].count >= 1 &&
            +results[0].Branch_ID !== +req.params.id
          ) {
            return res.status(403).json({
              sucess: 0,
              message:
                'This Branch Name already exists. Please try different Branch Name',
              results,
              fields
            });
          } else {
            pool.query(
              'UPDATE bank_branch SET ? Where Branch_ID = ?',
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

// @route    DELETE /api/psm/delete-branch/id
// @desc     Delete Barnch
// @access   Private

router.delete('/delete-branch/:id', (req, res) => {
  pool.query(
    'DELETE from bank_branch Where Branch_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        // console.log(err)
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `Branch ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
