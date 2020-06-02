const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiIcValidate } = require('../../joiSchemas/inv/joiIc');





// @route    GET /api/inv/get-ic
// @desc     Get Item Category
// @access   Private

 router.get('/get-ic', async (req, res) => {
    
 pool.query(`SELECT 
 Item_Category_ID, Item_Category_Name, Item_Category_Desc, icg.Item_Cat_Group_ID,icg.Item_Cat_Group_Name,
 ic.Organization_ID, ic.Enabled_Flag, ic.Creation_Date, ic.Created_By, ic.Last_Updated_Date, ic.Last_Updated_By
  FROM item_category ic , item_category_group icg
 where ic.Item_Cat_Group_ID = icg.Item_Cat_Group_ID`,
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


// @route    POST /api/inv/create-ic
// @desc     Create Item Category
// @access   Private 

   router.post('/create-ic', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiIcValidate.validate(req.body);
   console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into item_category
    (Item_Category_Name,Item_Category_Desc,Item_Cat_Group_ID,Organization_ID,
     Enabled_Flag,Creation_Date,Created_By,Last_Updated_By )
     values(?,?,?,?,?,?,?,?)`,
    [   body.Item_Category_Name,
        body.Item_Category_Desc,
        body.Item_Cat_Group_ID,
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
   

// @route    PUT /api/inv/update-ic/id
// @desc     Update Item Category
// @access   Private 
    router.put('/update-ic/:id', (req,res) => {
    const { error, value } = joiIcValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE item_category SET ? Where Item_Category_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/inv/delete-ic/id
// @desc     Delete Item Category
// @access   Private

router.delete('/delete-ic/:id',(req,res) => {
    pool.query('DELETE from item_category Where Item_Category_ID = ?',[req.params.id],(err,result) => {
      if (err){
       // console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Item Category ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
