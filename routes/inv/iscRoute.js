const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiIscValidate } = require('../../joiSchemas/inv/joiIsc');





// @route    GET /api/inv/get-isc
// @desc     Get Item Sub Category
// @access   Private

 router.get('/get-isc', async (req, res) => {
    
 pool.query(`SELECT 
 Item_Sub_Category_ID, Item_Sub_Category_Name, Item_Sub_Category_Desc, isc.Item_Category_ID, ic.Item_Category_Name,isc.Organization_ID, isc.Enabled_Flag, isc.Creation_Date, isc.Created_By, isc.Last_Updated_Date, isc.Last_Updated_By
 FROM item_sub_category isc , item_category ic
 where isc.Item_Category_ID = ic.Item_Category_ID `,
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


// @route    POST /api/inv/create-isc
// @desc     Create Item Sub Category
// @access   Private 

   router.post('/create-isc', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiIscValidate.validate(req.body);
   console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into item_sub_category
    (Item_Sub_Category_Name,Item_Sub_Category_Desc,Item_Category_ID,Organization_ID,
     Enabled_Flag,Creation_Date,Created_By,Last_Updated_By )
     values(?,?,?,?,?,?,?,?)`,
    [   body.Item_Sub_Category_Name,
        body.Item_Sub_Category_Desc,
        body.Item_Category_ID,
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
   

// @route    PUT /api/inv/update-isc/id
// @desc     Update Item Sub Category
// @access   Private 
    router.put('/update-isc/:id', (req,res) => {
    const { error, value } = joiIscValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE item_sub_category SET ? Where Item_Sub_Category_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/inv/delete-isc/id
// @desc     Delete Item Sub Category
// @access   Private

router.delete('/delete-isc/:id',(req,res) => {
    pool.query('DELETE from item_sub_category Where Item_Sub_Category_ID = ?',[req.params.id],(err,result) => {
      if (err){
       // console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Item Sub Category ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
