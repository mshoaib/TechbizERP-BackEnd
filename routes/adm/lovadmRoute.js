const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');



// @route    GET /api/adm/lov/get-city-lov
// @desc     Get City
// @access   Private

router.get('/lov/get-city-lov', async (req, res) => {
    
    pool.query(`SELECT city_name,city_id 
                FROM city
                order by city_name`,
    (err,rows , fields) =>{
        if(!err)
        {
          if(rows.length==0)
          {
              return res.status(200).json({
                  sucess:1,
                  message:"Record no found ",
                })
          }
          else
          {  res.send(rows) }
           
        }
        else{
           return res.status(500).json({
               sucess:0,
               message:"Database is not connected. ",
           })
            } }
       )}
     )


     module.exports=router;
