const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiUOMInsert } = require('../../joiSchemas/inv/joiUom');





// @route    GET /api/inv/get-uom
// @desc     Get UOM (Unit of Measurement)
// @access   Private

 router.get('/get-uom', async (req, res) => {
    
 pool.query("select * from uom",
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


// @route    POST /api/inv/get-uom
// @desc     Create UOM (Unit of Measurement)
// @access   Private 

   router.post('/create-uom', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiUOMInsert.validate(req.body);
   //console.log(`Value from Joi - ${value}`);
   if(error){
     console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into uom(UOM_Name,UM_Desc,UOM_Short_Code,Organization_ID,
                     Enabled_Flag,Creation_Date,Created_By,Last_Updated_By )
     values(?,?,?,?,?,?,?,?)`,
    [   body.UOM_Name,
        body.UM_Desc,
        body.UOM_Short_Code,
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
   

// @route    PUT /api/inv/update-uom/id
// @desc     Update UOM (Unit of Measurement)
// @access   Private 
    router.put('/update-uom/:id', (req,res) => {
    const { error, value } = joiUOMInsert.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
      console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE uom SET ? Where uom_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
        console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Changed ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route  DELETE /api/inv/uom-uom/id
// @desc     Delete UOM
// @access   Private

router.delete('/delete-uom/:id',(req,res) => {
    pool.query('DELETE from uom Where uom_ID = ?',[req.params.id],(err,result) => {
      if (err){
      //  console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`UOM ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
