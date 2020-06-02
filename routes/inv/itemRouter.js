const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiItemValidate } = require('../../joiSchemas/inv/joiItem');





// @route    GET /api/inv/get-item
// @desc     Get Item
// @access   Private

 router.get('/get-item', async (req, res) => {
    
 pool.query(`select  Item_ID, Item_Name, Item_Code, Item_Desc, i.UOM_ID,UOM_Name,
             Purchaseable_Item_Flag, Customer_Order_Item_Flag, Inventory_Item_Flag, 
             Sales_Order_Item_Flag, i.Item_Sub_Category_ID,Item_Sub_Category_Name, 
             Min_Qty, Max_Qty, Item_Img, i.Organization_ID, i.Enabled_Flag, i.Creation_Date, 
             i.Created_By, i.Last_Updated_Date, i.Last_Updated_By
             from item i , uom u ,item_sub_category isc
             where i.UOM_ID = u.UOM_ID
             and i.Item_Sub_Category_ID = isc.Item_Sub_Category_ID`,
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


// @route    POST /api/inv/create-item
// @desc     Create Item
// @access   Private 

   router.post('/create-item', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiItemValidate.validate(req.body);
   //console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into item
    (Item_Name,              Item_Code,                Item_Desc,           UOM_ID,
     Purchaseable_Item_Flag, Customer_Order_Item_Flag, Inventory_Item_Flag, Sales_Order_Item_Flag,
     Item_Sub_Category_ID,   Min_Qty,                  Max_Qty,             Item_Img,  
     Organization_ID,        Enabled_Flag,             Creation_Date,       Created_By, 
     Last_Updated_By )
     values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [   body.Item_Name,
        body.Item_Code,
        body.Item_Desc,
        body.UOM_ID,
        body.Purchaseable_Item_Flag,
        body.Customer_Order_Item_Flag,
        body.Inventory_Item_Flag,
        body.Sales_Order_Item_Flag,
        body.Item_Sub_Category_ID,
        body.Min_Qty,
        body.Max_Qty,
        body.Item_Img,
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
   

// @route    PUT /api/inv/update-item/id
// @desc     Update Item
// @access   Private 
    router.put('/update-item/:id', (req,res) => {
    const { error, value } = joiItemValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE item SET ? Where Item_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/inv/delete-item/id
// @desc     Delete Item
// @access   Private

router.delete('/delete-item/:id',(req,res) => {
    pool.query('DELETE from item Where Item_ID = ?',[req.params.id],(err,result) => {
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
