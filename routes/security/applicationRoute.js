var express = require('express');
var router = express.Router();
const db = require('../../config/db');
const { joiApplicationInsert, joiApplicationUpdate } = require('../../joiSchemas/security/joiApplication');
 
// application : GET ALL route
router.get('/get',(req,res) => {
	const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const searchTerm = req.query.search;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const { Organization_ID } = req.params

	let searchQuery = 
	`SELECT Application_ID, Application_Name, Application_Desc, Application_Short_Name,
	Enabled_Flag from application WHERE Application_Name LIKE '%${searchTerm}%' OR
  Application_Short_Name LIKE '%${searchTerm}%' OR Application_Desc LIKE '%${searchTerm}%'
  ORDER BY Application_ID ASC limit ${limit} OFFSET ${startIndex}`;
   
  let searchCountQuery = 
  `SELECT count(*) as totalCount from application WHERE Application_Name LIKE '%${searchTerm}%' OR
  Application_Short_Name LIKE '%${searchTerm}%' OR Application_Desc LIKE '%${searchTerm}%'`;

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

// application : POST route
router.post("/post", (req, res) => {
	const { error, value } = joiApplicationInsert.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(403).send(error);
	} else {
		db.query("INSERT INTO application SET ?", req.body, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err);
			};

			// console.log('Last Inserted Record : ',result.insertId)
			return res
				.status(200)
				.send(`Appication_ID : ${result.insertId} Record Inserted`);
		});
	}
});

// application : UPDATE route
router.put("/update/:id", (req, res) => {
	const { error, value } = joiApplicationUpdate.validate(req.body);
	if (error) {
		console.log(error);
		return res.status(403).send(error);
	} else {
		db.query(
			"UPDATE application SET ? Where Application_ID = ?",
			[req.body, req.params.id],
			(err, result) => {
				if (err) {
					console.log(err);
					return res.status(400).send(err);
				};

				// console.log(`Changed ${result.changedRows} row(s)`);
				return res.status(200).json({
					msg: `Changed ${result.changedRows} row(s)`,
					updated: true
				});
			}
		);
	}
});

router.delete('/delete/:id',(req,res) => {
  db.query('DELETE from application Where Application_ID = ?',[req.params.id],(err,result) => {
    if (err){
      console.log(err)
      return res.status(400).send(err)
    };

    return res.status(200).json({
      msg:`Application_ID : ${req.params.id} Deleted`,
      deleted: true
    });
  })
})

module.exports = router;
