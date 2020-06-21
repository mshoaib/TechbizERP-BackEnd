const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiBranchValidate } = require('../../joiSchemas/adm/joibranch');





// @route    GET /api/adm/get-branch
// @desc     Get Branch
// @access   Private

 router.get('/get-branch', async (req, res) => {
    
 pool.query(`SELECT Branch_ID, Branch_Name, Branch_Short_Name, br.Organization_ID, 
             Organization_Name,Branch_Address_Line1, Branch_Address_Line2, br.City_ID,
             City_Name,Branch_Tel_NO1, Branch_Tel_NO2, Branch_Book_ID, Branch_Account_ID,
             br.Enabled_Flag, br.Creation_Date, br.Created_By, br.Last_Updated_Date, 
             br.Last_Updated_By
             from branch br, organization org , city c
             where br.Organization_ID = org.Organization_ID 
             and br.city_id = c.city_id`,
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


// @route    POST /api/adm/create-branch
// @desc     Create Branch
// @access   Private 

   router.post('/create-branch', async (req, res) => {
     
   let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiBranchValidate.validate(req.body);
   //console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into branch
    (   Branch_Name,           Branch_Short_Name,       Organization_ID, 
        Branch_Address_Line1,  Branch_Address_Line2,    City_ID,
        Branch_Tel_NO1,        Branch_Tel_NO2,          Branch_Book_ID,
        Branch_Account_ID,     Enabled_Flag,            Creation_Date,           
        Created_By,            Last_Updated_By
        )
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [   body.Branch_Name,
        body.Branch_Short_Name,
        body.Organization_ID,
        body.Branch_Address_Line1,
        body.Branch_Address_Line2,
        body.City_ID,
        body.Branch_Tel_NO1,
        body.Branch_Tel_NO2,
        body.Branch_Book_ID,
        body.Branch_Account_ID,
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
   

// @route    PUT /api/adm/update-branch/id
// @desc     Update Branch
// @access   Private 
    router.put('/update-branch/:id', (req,res) => {
    const { error, value } = joiBranchValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE branch  SET ? Where Branch_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/adm/delete-branch/id
// @desc     Delete Branch
// @access   Private

router.delete('/delete-branch/:id',(req,res) => {
    pool.query('DELETE from branch Where Branch_ID = ?',[req.params.id],(err,result) => {
      if (err){
       // console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Branch ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
