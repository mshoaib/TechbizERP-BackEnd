var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const {
  joiUsersInsert,
  joiUsersUpdate
} = require('../../joiSchemas/security/joiUsers');

// User : GET ALL route
router.get('/get/:Organization_ID', (req, res) => {
  // const page = parseInt(req.query.page)
  // const limit = parseInt(req.query.limit)
  // const searchTerm = req.query.search;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const { Organization_ID } = req.params
  // let searchQuery =
  // `SELECT User_ID, User_Name, User_Status, User_Email, User_Mobile, Employee_ID, Host_ID_Restric,
  // Last_Login_Date, Last_Host_ID, Account_Locked_Flag, HostID_at_Time_Locked, Time_Date_Locked,
  // Branch_ID, Enabled_Flag from users WHERE User_Name LIKE '%${searchTerm}%' OR
  // User_Status LIKE '%${searchTerm}%' OR User_Email LIKE '%${searchTerm}%' OR
  // User_Mobile LIKE '%${searchTerm}%' OR Employee_ID LIKE '%${searchTerm}%' OR
  // Host_ID_Restric LIKE '%${searchTerm}%' OR Account_Locked_Flag LIKE '%${searchTerm}%' OR
  // User_ID LIKE '%${searchTerm}%' OR HostID_at_Time_Locked LIKE '%${searchTerm}%'
  // AND Organization_ID = ${Organization_ID}
  // ORDER BY User_ID ASC limit ${limit} OFFSET ${startIndex}`;
  // let searchCountQuery =
  // `SELECT count(*) as totalCount from users WHERE User_Name LIKE '%${searchTerm}%' OR
  // User_Status LIKE '%${searchTerm}%' OR User_Email LIKE '%${searchTerm}%' OR
  // User_Mobile LIKE '%${searchTerm}%' OR Employee_ID LIKE '%${searchTerm}%' OR
  // Host_ID_Restric LIKE '%${searchTerm}%' OR Account_Locked_Flag LIKE '%${searchTerm}%' OR
  // User_ID LIKE '%${searchTerm}%' OR HostID_at_Time_Locked LIKE '%${searchTerm}%'
  // AND Organization_ID = ${Organization_ID}
  // ORDER BY User_ID ASC limit ${limit} OFFSET ${startIndex}`;
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
    ` SELECT User_ID, User_Name, User_Status, User_Email, User_Mobile, Employee_ID, Host_ID_Restric,
  Last_Login_Date, Last_Host_ID, Account_Locked_Flag, HostID_at_Time_Locked, Time_Date_Locked,
  Branch_ID, Enabled_Flag from users 
  where Organization_ID = ${Organization_ID}
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

// User : POST route
router.post('/post', (req, res) => {
  const { error, value } = joiUsersInsert.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    let hashedPassword = bcrypt.hashSync(value.User_hpassword, 10);
    console.log(hashedPassword); // hashing password
    value.User_hpassword = hashedPassword;
    db.query('INSERT INTO users SET ?', value, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      // console.log('Last Inserted Record : ',result.insertId)
      return res
        .status(200)
        .send(`User_ID : ${result.insertId} Record Inserted`);
    });
  }
});

// User : UPDATE route
router.put('/update/:id', (req, res) => {
  const { error, value } = joiUsersUpdate.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query(
      'UPDATE users SET ? Where User_ID = ?',
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
    'DELETE from users Where User_ID = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      }

      return res.status(200).json({
        msg: `User_ID : ${req.params.id} Deleted`,
        deleted: true
      });
    }
  );
});

// GET Only Usernames
router.get('/get/names/:Organization_ID', (req, res) => {
  const { Organization_ID } = req.params;

  const sql = 'select User_ID, User_Name from users where Organization_ID = ?';
  db.query(sql, [Organization_ID], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(400).send(err);
    } else {
      return res.status(200).json(results);
    }
  });
});

module.exports = router;
