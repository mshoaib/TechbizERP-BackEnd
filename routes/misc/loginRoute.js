const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');
const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET||'shoaib';


// @route    GET /api/misc/login
// @desc     Login Authentication
// @access   Private

router.post('/misc/login', async (req, res) => {

    const body = req.body;
    console.log(body);
    pool.query(`SELECT * FROM users where User_Name  = ? and User_hpassword = ?`,
               [body.username,
               body.password],
    (err,rows , fields) =>{
        console.log(err);
        if(!err)
        {
            console.log(rows.length);
           
          if(rows.length==0)
          {
            const payload = {
                data: {
                    sucess:2,
                    message:"Invalid username or password. Please try again",
                    
                }    
            }

              return res.status(202).json({
                 payload      
            })
          }
          else
          { 


         // create Payload
        const payload = {
            data: {
                sucess:1,
                message:"You are sucessfully login",
                rows
            }
        };

        const token =  jwt.sign(payload,JWT_SECRET, {
            expiresIn: "365d"
        });    

           
      //  return payload
           
            // return res.status(202).json({
            //     sucess:1,
            //     message:"User found",
            //     rows
            //   }) 

             return res.status(202).json({
                payload,
                token   
            }) 
           
                   
            
        }
           
        }
        else{
           return res.status(500).json({
               sucess:0,
               message:"Database is not connected. ",
           })
            
        }
    }
    )})
       
     module.exports=router;
