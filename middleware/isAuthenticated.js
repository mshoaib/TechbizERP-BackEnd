const JWT = require('jsonwebtoken');
const SECRET = 'jwtTOken'; // will be set in env later
const db = require('../config/db.js')

const isAuthenticated = (req, res, next) => {
	const token = req.cookies.access_token;
	if(token){

		JWT.verify(token,SECRET,(err,decoded) => {
			if(err){
				res.status(401).send('Unauthorized');
			} else {
				const { email, id } = decoded;
				if(email){
					db.query('SELECT count(*) as totalCount FROM users WHERE User_Name = ? AND User_ID = ?',[username,id],(err,results) => {
						if(err){
							console.log(err)
							res.status(401).send('User not Authorized!');
						}
						if(results[0].totalCount > 0){
							console.log('successfully')
							next();
						} else {
							res.status(401).send('Unauthorized.');
						}
					})
				} else {
					res.status(401).send('Unauthorized.');
				}
			}
		})
	}
};

module.exports = {
	isAuthenticated
}

