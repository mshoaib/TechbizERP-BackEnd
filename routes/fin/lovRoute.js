const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../config/db');

// @route    GET /api/fin/lov/bank/:Organization_ID
// @desc     Get Bank  lov
// @access   Private
router.get('/bank/:Organization_ID', (req, res) => {
  const { Organization_ID } = req.params;
  pool.query(
    `select Bank_ID,Bank_Name from bank where Organization_ID = ? and Enabled_Flag= 'y' `,
    [Organization_ID],

    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
        return;
      } else {
        res.status(200).json(results);
      }
    }
  );
});

// @route    GET /api/fin/lov/parentname/:Parent_Code
// @desc     Get PArent Name  lov
// @access   Private
router.get('/parentname/:Parent_Code', (req, res) => {
  const { Parent_Code } = req.params;
  pool.query(
    `SELECT COA_ID, COA_Name FROM coa WHERE COA_Code= "${Parent_Code}" AND Enabled_Flag = "y" 
`,

    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
        return;
      } else {
        res.status(200).json(results);
      }
    }
  );
});
module.exports = router;
