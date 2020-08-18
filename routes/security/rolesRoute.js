var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const {
  joiRolesInsert,
  joiRolesUpdate
} = require('../../joiSchemas/security/joiRoles');

// Roles : GET ALL route
router.get('/get/:Organization_ID', (req, res) => {
  // const page = parseInt(req.query.page)
  // const limit = parseInt(req.query.limit)
  // const searchTerm = req.query.search;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const { Organization_ID } = req.params
  // let searchQuery =
  // `SELECT Role_ID, Role_Name, Role_Desc, Organization_ID, Enabled_Flag from roles
  // WHERE Role_Name LIKE '%${searchTerm}%' OR Role_Desc LIKE '%${searchTerm}%'
  // AND Organization_ID = ${Organization_ID}
  // ORDER BY Role_ID ASC limit ${limit} OFFSET ${startIndex}`;
  // let searchCountQuery =
  // `SELECT count(*) as totalCount from roles
  // WHERE Role_Name LIKE '%${searchTerm}%' OR Role_Desc LIKE '%${searchTerm}%'
  // AND Organization_ID = ${Organization_ID}`;
  // const results = {};
  // db.query(searchCountQuery,(err,rows) => {
  // 	if (err) {
  //     console.log(err);
  //     return res.status(400).send(err);
  //   };
  // 	// console.log(rows[0].totalCount);
  // 	const numberOfRows = rows[0].totalCount;
  // 	results["totalPages"] = Math.ceil(numberOfRows/limit);
  // 	if (endIndex < numberOfRows) {
  //     results.next = {
  //       page: page + 1,
  //       limit: limit
  //     }
  //   }
  //   if (startIndex > 0) {
  //     results.previous = {
  //       page: page - 1,
  //       limit: limit
  //     }
  //   }
  //   db.query(searchQuery,(err,rows) => {
  //   	if (err) {
  //       console.log(err);
  //       return res.status(400).send(err);
  //     };
  //   	// console.log('rows',rows)
  //   	results['results'] = rows;
  //   	res.status(200).send(results);
  //   })
  // })
  const { Organization_ID } = req.params;
  db.query(
    `SELECT * FROM roles WHERE organization_ID =${Organization_ID}`,
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

// Roles : POST route
router.post('/post', (req, res) => {
  console.log(req.body);
  const { error, value } = joiRolesInsert.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query('INSERT INTO roles SET ?', req.body, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      // console.log('Last Inserted Record : ',result.insertId)
      return res
        .status(200)
        .send(`Role_ID : ${result.insertId} Record Inserted`);
    });
  }
});

// Roles : UPDATE route
router.put('/update/:id', (req, res) => {
  const { error, value } = joiRolesUpdate.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query(
      'UPDATE roles SET ? Where Role_ID = ?',
      [req.body, req.params.id],
      (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).send(err);
        }

        // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg: `Changed ${result.changedRows} row(s)`,
          updated: true
        });
      }
    );
  }
});

router.delete('/delete/:id', (req, res) => {
  db.query(
    'DELETE from roles Where Role_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `Role_ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
