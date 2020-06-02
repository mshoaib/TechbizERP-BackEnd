const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiBusgrpValidate } = require('../../joiSchemas/adm/joibusgrp');





// @route    GET /api/adm/get-busgrp
// @desc     Get Business Group
// @access   Private

 router.get('/get-busgrp', async (req, res) => {
    
 pool.query(`select 
            Business_Group_ID, Business_Group_Name, Business_Group_Desc, Business_Group_AddressLine1, Business_Group_AddressLine2, bg.City_ID,
            c.City_Name,Business_Group_TelNo1, Business_Group_TelNo2, Business_Group_Email, Business_Group_Website, Business_Group_NTN_NO, Business_Group_GST_NO, Business_Group_Book_ID, Business_Group_Account_ID, bg.Enabled_Flag, bg.Creation_Date, bg.Created_By, bg.Last_Updated_Date, bg.Last_Updated_By
            FROM businessgroup bg , city c
            where bg.city_id = c.city_id`,
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


// @route    POST /api/adm/create-busgrp
// @desc     Create Business Group
// @access   Private 

   router.post('/create-busgrp', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiBusgrpValidate.validate(req.body);
   //console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into businessgroup
    (Business_Group_Name,            Business_Group_Desc,       Business_Group_AddressLine1, 
     Business_Group_AddressLine2,    City_ID,                   Business_Group_TelNo1, 
     Business_Group_TelNo2,          Business_Group_Email,      Business_Group_Website,   
     Business_Group_NTN_NO,          Business_Group_GST_NO,     Business_Group_Book_ID,    
     Business_Group_Account_ID,      Enabled_Flag,              Creation_Date,
     Created_By,                     Last_Updated_By )
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [   body.Business_Group_Name,
        body.Business_Group_Desc,
        body.Business_Group_AddressLine1,
        body.Business_Group_AddressLine2,
        body.City_ID,
        body.Business_Group_TelNo1,
        body.Business_Group_TelNo2,
        body.Business_Group_Email,
        body.Business_Group_Website,
        body.Business_Group_NTN_NO,
        body.Business_Group_GST_NO,
        body.Business_Group_Book_ID,
        body.Business_Group_Account_ID,
        body.Enabled_Flag,
        current_date,
        body.Created_By,
        body.Last_Updated_By
    ],

        (err,results,fields) =>{
            if(!err)
            {
             // res.send(results) 
              return res.status(200).json({
                  sucess:0,
                  message:"Record has been insert --",
                  results,
                  fields
                  
              }) 
            }
            else{
                return res.status(500).json({
                    sucess:1,
                    message:err.sqlMessage
                 } 
            );} 
        } )}
    })
   

// @route    PUT /api/adm/update-busgrp/id
// @desc     Update Business Group
// @access   Private 
    router.put('/update-busgrp/:id', (req,res) => {
    const { error, value } = joiBusgrpValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE businessgroup SET ? Where Business_Group_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/adm/delete-busgrp/id
// @desc     Delete Business Group 
// @access   Private

router.delete('/delete-busgrp/:id',(req,res) => {
    pool.query('DELETE from businessgroup Where Business_Group_ID = ?',[req.params.id],(err,result) => {
      if (err){
       // console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Business Group ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
