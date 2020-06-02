const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiOrgValidate } = require('../../joiSchemas/adm/joiorg');





// @route    GET /api/adm/get-org
// @desc     Get Organizaion
// @access   Private

 router.get('/get-org', async (req, res) => {
    
 pool.query(`SELECT 
            Organization_ID, Organization_Name, Organization_Short_Name, Organization_Desc, org.Organization_Type_ID, 
            ot.Organization_Type,org.Business_Group_ID,Business_Group_Name, Organization_AddressLine1, Organization_AddressLine2, org.City_ID,c.City_Name, Organization_TelNo1, Organization_TelNo2, Organization_Email, Organization_Website, Organization_NTN_NO, Organization_GST_NO, Organization_Book_ID, Organization_Account_ID, org.Enabled_Flag, org.Creation_Date, org.Created_By, org.Last_Updated_Date, org.Last_Updated_By
            FROM organization org , organization_type ot , businessgroup bg ,city c
            where org.Organization_Type_ID = ot.Organization_Type_ID
            and org.Business_Group_ID = bg.Business_Group_ID
            and org.city_id =c.city_id`,
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


// @route    POST /api/adm/create-org
// @desc     Create Business Group
// @access   Private 

   router.post('/create-org', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiOrgValidate.validate(req.body);
   //console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into organization
    (Organization_Name,           Organization_Short_Name,      Organization_Desc, 
     Organization_Type_ID,        Business_Group_ID,            Organization_AddressLine1,   
     Organization_AddressLine2,   City_ID,                      Organization_TelNo1,         
     Organization_TelNo2,         Organization_Email,           Organization_Website,        
     Organization_NTN_NO,         Organization_GST_NO,          Organization_Book_ID,        
     Organization_Account_ID,     Enabled_Flag,                 Creation_Date,           
     Created_By,                  Last_Updated_By
        )
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [   body.Organization_Name,
        body.Organization_Short_Name,
        body.Organization_Desc,
        body.Organization_Type_ID,
        body.Business_Group_ID,
        body.Organization_AddressLine1,
        body.Organization_AddressLine2,
        body.City_ID,
        body.Organization_TelNo1,
        body.Organization_TelNo2,
        body.Organization_Email,
        body.Organization_Website,
        body.Organization_NTN_NO,
        body.Organization_GST_NO,
        body.Organization_Book_ID,
        body.Organization_Account_ID,        
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
   

// @route    PUT /api/adm/update-org/id
// @desc     Update Organization
// @access   Private 
    router.put('/update-org/:id', (req,res) => {
    const { error, value } = joiOrgValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE organization  SET ? Where Organization_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/adm/delete-org/id
// @desc     Delete Organization
// @access   Private

router.delete('/delete-org/:id',(req,res) => {
    pool.query('DELETE from organization Where Organization_ID = ?',[req.params.id],(err,result) => {
      if (err){
       // console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Organization ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
