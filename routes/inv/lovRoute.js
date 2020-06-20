const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../config/db');

// @route    GET /api/inv/lov/get-icgt-lov
// @desc     Get Item Category Group Type
// @access   Private

router.get('/lov/get-icgt-lov', async (req, res) => {
  pool.query(
    `SELECT Item_Cat_Grp_Type_Name ,Item_Cat_Grp_Type_ID 
                FROM item_category_group_Type 
                order by Item_Cat_Grp_Type_Name`,
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

// @route    GET /api/inv/lov/get-icg-lov
// @desc     Get Item Category Group Lov
// @access   Private

router.get('/lov/get-icg-lov', async (req, res) => {
  pool.query(
    `SELECT Item_Cat_Group_Name,Item_Cat_Group_ID
                FROM  item_category_group
                order by Item_Cat_Group_Name`,
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

// @route    GET /api/inv/lov/get-ic-lov
// @desc     Get Item Category  Lov
// @access   Private

router.get('/lov/get-ic-lov', async (req, res) => {
  pool.query(
    `SELECT Item_Category_Name,Item_Category_ID
               FROM item_category
                order by Item_Category_Name`,
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

// @route    GET /api/inv/lov/get-isc-lov
// @desc     Get Item Category  Lov
// @access   Private

router.get('/lov/get-isc-lov', async (req, res) => {
  pool.query(
    `SELECT Item_Sub_Category_Name,Item_Sub_Category_ID 
                FROM item_sub_category
                order by Item_Sub_Category_Name`,
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

// @route    GET /api/inv/lov/get-uom-lov
// @desc     Get Item Category  Lov
// @access   Private

router.get('/lov/get-uom-lov', async (req, res) => {
  pool.query(
    `SELECT UOM_Short_Code ,UOM_ID UOM from uom
                order by UOM_Short_Code `,
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

// @route    GET /api/inv/lov//branch/:Organization_ID
// @desc     Get Branch lov
// @access   Private
router.get('/branch/:Organization_ID', (req, res) => {
  const { Organization_ID } = req.params;
  pool.query(
    `select Branch_ID,Branch_Name from branch where Organization_ID = ? and Enabled_Flag= 'y' `,
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

// @route    GET /api/inv/lov//item/:Organization_ID
// @desc     Get Item  Lov
// @access   Private
router.get('/item/:Organization_ID', (req, res) => {
  const { Organization_ID } = req.params;
  pool.query(
    `select Item_ID,Item_Name from item where Organization_ID = ? and Enabled_Flag= 'y'`,
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

// @route    GET /api/inv/lov/department/:Organization_ID
// @desc     Get Item  Lov
// @access   Private
router.get('/department/:Organization_ID', (req, res) => {
  const { Organization_ID } = req.params;
  pool.query(
    `select Department_ID,Department_Name from department where Organization_ID = ? and Enabled_Flag= 'y'`,
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

module.exports = router;
