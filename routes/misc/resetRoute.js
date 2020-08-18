var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const { isAuthenticated } = require('../../middleware/isAuthenticated');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const SECRET = 'jwtTOken'; // will be set in env later

/* user Reset Route */
router.put('/reset/:id', (req, res) => {
  console.log('hi');
  const password = req.body.password;
  const newpassword = req.body.newpassword;
  const userID = req.params.id;

  // console.log(username, password);

  if (userID && password) {
    db.query(
      'SELECT * FROM users WHERE User_ID = ?',
      [userID],
      (error, results, fields) => {
        if (error) {
          console.log(error);
          return res.status(400).send(error);
        }
        if (results.length > 0) {
          const {
            User_ID,
            User_hpassword,
            Organization_ID,
            Branch_ID,
            User_Email,
            User_Name,
            Employee_Name,
            Designation
          } = results[0];
          if (
            results.length > 0 &&
            bcrypt.compareSync(password, User_hpassword)
          ) {
            console.log(results[0]);
            let hashedPassword = bcrypt.hashSync(newpassword, 10);
            console.log(hashedPassword); // hashing password
            results[0].User_hpassword = hashedPassword;
            console.log(results[0]);
            console.log(User_ID);
            db.query(
              'UPDATE users SET ? Where User_ID  = ?',
              [results[0], User_ID],
              (err, result) => {
                if (err) throw err;

                // console.log(`Changed ${result.changedRows} row(s)`);
                return res.status(200).json({
                  msg: `Record has been updated ${result.changedRows} row(s)`,
                  updated: true
                });
              }
            );
          } else {
            res.status(400).send('Incorrect Password!');
          }
        } else {
          res.status(400).send('Incorrect Password!');
        }
      }
    );
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

module.exports = router;
