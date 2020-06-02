var express = require('express');
var router = express.Router();
const db = require('../config/db');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Route to get Names of Roles,Modules,Forms */
router.get('/get/RMF/:Organization_ID', function(req, res, next) {
	const { Organization_ID } = req.params;
  db.query('CALL getRolesModulesForms(?)',[Organization_ID],(err,results) => {
  	if(err){
  		console.log(err)
  		return res.send(400).send(err)
  	}
  	// console.log(results)
  	res.status(200).json({
  		forms:results[0],
  		modules:results[1],
  		roles:results[2]
  	})
  })
});


module.exports = router;
