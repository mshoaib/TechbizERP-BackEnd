var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const {
  joiUserRolesInsert,
  joiUserRolesUpdate
} = require('../../joiSchemas/security/joiUser_roles');

// User_Roles : GET ALL route
router.get('/get/:Organization_ID', (req, res) => {
  // const page = parseInt(req.query.page)
  // const limit = parseInt(req.query.limit)
  // const searchTerm = req.query.search;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const { Organization_ID } = req.params
  // let searchQuery =
  // `SELECT User_Role_ID,r.Role_ID,r.Role_Name,u.User_ID,u.User_Name, ru.Enabled_Flag
  // from user_roles AS ru INNER JOIN roles AS r ON ru.Role_ID = r.Role_ID
  // INNER JOIN users AS u ON ru.User_ID = u.User_ID
  // WHERE r.Role_Name LIKE '%${searchTerm}%' OR u.User_Name LIKE '%${searchTerm}%'
  // AND ru.Organization_ID = ${Organization_ID}
  // ORDER BY User_Role_ID ASC limit ${limit} OFFSET ${startIndex}`;
  // let searchCountQuery =
  // `SELECT count(*) as totalCount
  // from user_roles AS ru INNER JOIN roles AS r ON ru.Role_ID = r.Role_ID
  // INNER JOIN users AS u ON ru.User_ID = u.User_ID
  // WHERE r.Role_Name LIKE '%${searchTerm}%' OR u.User_Name LIKE '%${searchTerm}%'
  // AND ru.Organization_ID = ${Organization_ID}`;
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
    ` SELECT User_Role_ID,r.Role_ID,r.Role_Name,u.User_ID,u.User_Name, ru.Enabled_Flag
  from user_roles AS ru INNER JOIN roles AS r ON ru.Role_ID = r.Role_ID
  INNER JOIN users AS u ON ru.User_ID = u.User_ID
  AND ru.Organization_ID = ${Organization_ID}
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

// User_Roles : POST route
router.post('/post', (req, res) => {
  const { error, value } = joiUserRolesInsert.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query('INSERT INTO user_roles SET ?', req.body, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      // console.log('Last Inserted Record : ',result.insertId)
      return res
        .status(200)
        .send(`User_Role_ID : ${result.insertId} Record Inserted`);
    });
  }
});

// User_Roles : UPDATE route
router.put('/update/:id', (req, res) => {
  const { error, value } = joiUserRolesUpdate.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query(
      'UPDATE user_roles SET ? Where User_Role_ID = ?',
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

// User_Roles : DELETE route
router.delete('/delete/:id', (req, res) => {
  db.query(
    'DELETE from user_roles Where User_Role_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `User_Role_ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

module.exports = router;
