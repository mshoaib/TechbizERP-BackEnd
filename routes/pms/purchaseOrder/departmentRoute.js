var express = require("express");
var router = express.Router();
const db = require("../../../config/db");

router.get("/department/:Organization_ID", (req, res) => {
  const { Organization_ID } = req.params;
  db.query(
    "select Department_ID,Department_Name from department where Organization_ID = ?",
    [Organization_ID],

    (error, results, fields) => {
      if (error) {
        console.log(error);
        res.status(400).send(error);
        return;
      } else {
        res.status(200).json(results);
      }
    });
  
});

module.exports = router;