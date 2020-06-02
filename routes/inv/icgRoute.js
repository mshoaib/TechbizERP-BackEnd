const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiIcgValidate } = require('../../joiSchemas/inv/joiIcg');





// @route    GET /api/inv/get-icg
// @desc     Get Item Category Group
// @access   Private

 router.get('/get-icg', async (req, res) => {
    
 pool.query(`select Item_Cat_Group_ID, Item_Cat_Group_Name, Item_Cat_Group_Desc, 
 icg.Item_Cat_Grp_Type_ID, icg.Organization_ID, icg.Enabled_Flag, icg.Creation_Date, 
 icg.Created_By, icg.Last_Updated_Date, icg.Last_Updated_By,icgt.Item_Cat_Grp_Type_Name
  from item_category_group icg , item_category_group_type icgt
   where icg.Item_Cat_Grp_Type_ID = icgt.Item_Cat_Grp_Type_ID`,
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


// @route    POST /api/inv/create-icg
// @desc     Create UOM (Unit of Measurement)
// @access   Private 

   router.post('/create-icg', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiIcgValidate.validate(req.body);
   console.log(`Value from Joi - ${value}`);
   if(error){
     console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into item_category_group
    (Item_Cat_Group_Name,Item_Cat_Group_Desc,Item_Cat_Grp_Type_ID,Organization_ID,
     Enabled_Flag,Creation_Date,Created_By,Last_Updated_By )
     values(?,?,?,?,?,?,?,?)`,
    [   body.Item_Cat_Group_Name,
        body.Item_Cat_Group_Desc,
        body.Item_Cat_Grp_Type_ID,
        body.Organization_ID,
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
   

// @route    PUT /api/inv/update-icg/id
// @desc     Update Item Category Group Type
// @access   Private 
    router.put('/update-icg/:id', (req,res) => {
    const { error, value } = joiIcgValidate.validate(req.body);
    console.log('Value from Joi',value);
    if(error){
      console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE item_category_group SET ? Where Item_Cat_Group_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
        console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Changed ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/inv/delete-icg/id
// @desc     Delete Item Category Group
// @access   Private

router.delete('/delete-icg/:id',(req,res) => {
    pool.query('DELETE from item_category_group Where Item_Cat_Group_ID = ?',[req.params.id],(err,result) => {
      if (err){
        console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Item Category Group ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  


// @route    GET /api/inv/get-icgt
// @desc     Get Item Category Group Type
// @access   Private

 router.get('/get-icgt', async (req, res) => {
    
 pool.query("select * from item_category_group_type",
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
