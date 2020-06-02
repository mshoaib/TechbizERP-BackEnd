const express = require('express');
const app = express();
const router  = express.Router();
const pool = require('../../config/db');



// @route    GET /api/pms/lov/get-supplierType-lov
// @desc     Get Item Category Group Type
// @access   Private

router.get('/lov/get-supplierType-lov', async (req, res) => {
    
    pool.query(`SELECT st.Supplier_Type FROM supplier_type st 
                ORDER BY st.Supplier_Type`,
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


// @route    GET /api/pms/lov/get-city-lov
// @desc     Get City 
// @access   Private

router.get('/lov/get-city-lov', async (req, res) => {
    
  pool.query(`SELECT c.City_Name,c.City_ID  FROM city c 
              WHERE c.Enabled_Flag ='Y'
              ORDER by c.City_Name`,
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

// @route    GET /api/pms/lov/get-country-lov
// @desc     Get Country
// @access   Private

router.get('/lov/get-country-lov', async (req, res) => {
    
  pool.query(`SELECT C.Country_Name,C.Country_ID 
              FROM COUNTRY C
               WHERE C.Enabled_Flag ='Y'
               ORDER BY C.Country_Name`,
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


// @route    GET /api/pms/lov/get-po_no-lov
// @desc     Get Purchase Order No
// @access   Private

router.get('/lov/get-po_no-lov/:Organization_ID', async (req, res) => {

  const { Organization_ID } = req.params;
    
  pool.query(`SELECT p.PO_NO,p.PO_Header_ID ,p.Supplier_ID
              FROM purchase_order_header p
              where p.status = 'Y'
              and p.Organization_ID = ${Organization_ID}`,
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
