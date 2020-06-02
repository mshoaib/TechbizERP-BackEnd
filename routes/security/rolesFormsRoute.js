var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const { isAuthenticated } = require('../../middleware/isAuthenticated.js');
const { joiRolesFormsInsert, joiRolesFormsUpdate } = require('../../joiSchemas/security/joiRoles_forms');
 
// roles_forms : GET ALL route
//router.get('/get/:Organization_ID',isAuthenticated,(req,res) => {
  router.get('/get/:Organization_ID',(req,res) => {
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const searchTerm = req.query.search;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const { Organization_ID } = req.params
 
  let searchQuery = 
  `SELECT Role_Form_ID,r.Role_ID,r.Role_Name,f.Form_ID,f.Form_Name,m.Module_ID,m.Module_Name, rf.Enabled_Flag
  from roles_forms AS rf INNER JOIN roles AS r ON rf.Role_ID = r.Role_ID
  INNER JOIN modules AS m ON rf.Module_ID = m.Module_ID
  INNER JOIN forms AS f ON rf.Form_ID = f.Form_ID
  WHERE r.Role_Name LIKE '%${searchTerm}%' OR f.Form_Name LIKE '%${searchTerm}%'
  AND rf.Organization_ID = ${Organization_ID}
  ORDER BY Role_Form_ID ASC limit ${limit} OFFSET ${startIndex}`;

	let searchCountQuery = 
  `SELECT count(*) as totalCount
  from roles_forms AS rf INNER JOIN roles AS r ON rf.Role_ID = r.Role_ID
  INNER JOIN forms AS f ON rf.Form_ID = f.Form_ID
  INNER JOIN modules AS m ON rf.Module_ID = m.Module_ID
  WHERE r.Role_Name LIKE '%${searchTerm}%' OR f.Form_Name LIKE '%${searchTerm}%'
 	AND rf.Organization_ID = ${Organization_ID}`;

	const results = {};	

  db.query(searchCountQuery,(err,rows) => {
		if (err) {
      console.log(err);
      return res.status(400).send(err);
    };
		// console.log(rows[0].totalCount);
		const numberOfRows = rows[0].totalCount;	

		results["totalPages"] = Math.ceil(numberOfRows/limit);

		if (endIndex < numberOfRows) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    db.query(searchQuery,(err,rows) => {
    	if (err) {
        console.log(err);
        return res.status(400).send(err);
      };
    	// console.log('rows',rows)

    	results['results'] = rows;
    	res.status(200).send(results);
    })
	})
})

// roles_forms : POST route
//router.post('/post',isAuthenticated,(req,res) => {
  router.post('/post',(req,res) => {

  const { error, value } = joiRolesFormsInsert.validate(req.body);
  if(error){
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query('INSERT INTO roles_forms SET ?',req.body,(err,result) => {
      if (err) {
				console.log(err);
				return res.status(400).send(err);
			};
      
      // console.log('Last Inserted Record : ',result.insertId)
      return res.status(200).send(`Role_form_ID : ${result.insertId} Record Inserted`)
    })
  }
})

// roles_forms : UPDATE route
//router.put('/update/:id',isAuthenticated, (req,res) => {
  router.put('/update/:id', (req,res) => {

  const { error, value } = joiRolesFormsUpdate.validate(req.body);
  if(error){
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query('UPDATE roles_forms SET ? Where Role_form_ID = ?',[req.body,req.params.id],(err,result) => {
      if (err) {
				console.log(err);
				return res.status(400).send(err);
			};

      // console.log(`Changed ${result.changedRows} row(s)`);
      return res.status(200).json({
        msg:`Changed ${result.changedRows} row(s)`,
        updated: true
      });
    })
  }
})

// roles_forms : DELETE route
router.delete('/delete/:id',isAuthenticated,(req,res) => {
  db.query('DELETE from roles_forms Where Role_form_ID = ?',[req.params.id],(err,result) => {
    if (err){
      console.log(err)
      return res.status(400).send(err)
    };

    return res.status(200).json({
      msg:`Role_form_ID : ${req.params.id} Deleted`,
      deleted: true
    });
  })
})

module.exports = router;
