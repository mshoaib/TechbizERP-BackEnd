var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const { joiRolesModulesInsert, joiRolesModulesUpdate } = require('../../joiSchemas/security/joiRoles_modules');

// roles_modules : GET ALL route
router.get('/get/:Organization_ID',(req,res) => {
 	const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const searchTerm = req.query.search;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const { Organization_ID } = req.params
 
  let searchQuery = 
  `SELECT Role_Module_ID,r.Role_ID,r.Role_Name,m.Module_ID,m.Module_Name, rm.Enabled_Flag
  from roles_modules AS rm INNER JOIN roles AS r ON rm.Role_ID = r.Role_ID
  INNER JOIN modules AS m ON rm.Module_ID = m.Module_ID
  WHERE r.Role_Name LIKE '%${searchTerm}%' OR m.Module_Name LIKE '%${searchTerm}%'
  AND rm.Organization_ID = ${Organization_ID}
  ORDER BY Role_Module_ID ASC limit ${limit} OFFSET ${startIndex}`;

	let searchCountQuery = 
  `SELECT count(*) as totalCount
  from roles_modules AS rm INNER JOIN roles AS r ON rm.Role_ID = r.Role_ID
  INNER JOIN modules AS m ON rm.Module_ID = m.Module_ID
  WHERE r.Role_Name LIKE '%${searchTerm}%' OR m.Module_Name LIKE '%${searchTerm}%'
 	AND rm.Organization_ID = ${Organization_ID}`;
 	
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

// roles_modules : POST route
router.post('/post',(req,res) => {
  const { error, value } = joiRolesModulesInsert.validate(req.body);
  if(error){
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query('INSERT INTO roles_modules SET ?',req.body,(err,result) => {
      if (err) {
        console.log(err);
        return res.status(400).send(err);
      };
      
      // console.log('Last Inserted Record : ',result.insertId)
      return res.status(200).send(`Role_Module_ID : ${result.insertId} Record Inserted`)
    })
  }
})



// roles_modules : UPDATE route
router.put('/update/:id', (req,res) => {
  const { error, value } = joiRolesModulesUpdate.validate(req.body);
  if(error){
    console.log(error);
    return res.status(403).send(error);
  } else {
    db.query('UPDATE roles_modules SET ? Where Role_Module_ID = ?',[req.body,req.params.id],(err,result) => {
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

// roles_modules : DELETE route
router.delete('/delete/:id',(req,res) => {
  db.query('DELETE from roles_modules Where Role_Module_ID = ?',[req.params.id],(err,result) => {
    if (err){
      console.log(err)
      return res.status(400).send(err)
    };

    return res.status(200).json({
      msg:`Role_Module_ID : ${req.params.id} Deleted`,
      deleted: true
    });
  })
})

module.exports = router;
