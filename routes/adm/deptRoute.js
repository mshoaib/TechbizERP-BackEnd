const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const os = require('os');
const { joiDeptValidate } = require('../../joiSchemas/adm/joidept');





// @route    GET /api/adm/get-dept
// @desc     Get Department
// @access   Private

 router.get('/get-dept', async (req, res) => {
    
 pool.query(`SELECT 
            Department_ID,Department_Name, Department_Desc, Department_Code, Department_Type, 
            dept.Organization_ID,dept.Branch_ID,Branch_Name, dept.Enabled_Flag, dept.Creation_Date,
            dept.Created_By, dept.Last_Updated_Date, dept.Last_Updated_By
            from department dept , branch br
            where dept.branch_id = br.branch_id`,
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


// @route    POST /api/adm/create-deptno
// @desc     Create Department
// @access   Private 

   router.post('/create-deptno', async (req, res) => {
    
    let current_date = new Date();
   const body = req.body;
   
   const { error, value } = joiDeptValidate.validate(req.body);
   //console.log(`Value from Joi - ${value}`);
   if(error){
    // console.log(error);
     return res.status(403).send(error);
   } 
   else{
   
   pool.query(
    `insert into department
    (   Department_Name,        Department_Desc,        Department_Code, 
        Department_Type,        Organization_ID,        Branch_ID,
        Enabled_Flag,           Creation_Date,          Created_By,  
        Last_Updated_By
        )
     values(?,?,?,?,?,?,?,?,?,?)`,
    [   body.Department_Name,
        body.Department_Desc,
        body.Department_Code,
        body.Department_Type,
        body.Organization_ID,
        body.Branch_ID,
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
   

// @route    PUT /api/adm/update-dept/id
// @desc     Update Department
// @access   Private 
    router.put('/update-dept/:id', (req,res) => {
    const { error, value } = joiDeptValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if(error){
     // console.log(error);
      return res.status(403).send(error);
    } else {
      pool.query('UPDATE department  SET ? Where Department_ID = ?',[req.body,req.params.id],(err,result) => {
        if (err) throw err;
  
       // console.log(`Changed ${result.changedRows} row(s)`);
        return res.status(200).json({
          msg:`Record has been updated ${result.changedRows} row(s)`,
          updated: true
        });
      })
    }
  })
  
// @route    DELETE /api/adm/delete-dept/id
// @desc     Delete Department
// @access   Private

router.delete('/delete-dept/:id',(req,res) => {
    pool.query('DELETE from department Where Department_ID = ?',[req.params.id],(err,result) => {
      if (err){
       // console.log(err)
        return res.status(400).send(err)
      };
  
      return res.status(200).json({
        msg:`Department ID : ${req.params.id} Deleted`,
        deleted: true
      });
    })
  })
  

  module.exports=router;
