const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../config/db');
const os = require('os');

// @route    GET /api/get-form-menu
// @desc     Get forms menu of specific domain
// @access   Private

router.get('/get-form-menu', async (req, res) => {
    
    pool.query("select * from forms where module_id = 3",
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
