const express = require('express');
const app = express();
const router = express.Router();
const pool = require('../../../config/db');
const os = require('os');
const { joiPurRecHeaderValidate } = require('../../../joiSchemas/pms/purchaseReceive/joiPurRecHeader');
const { joiPurRecLineValidate } = require('../../../joiSchemas/pms/purchaseReceive/joiPurRecLine');





// @route    GET /api/pms/purchaseRece
// @desc     Get Header
// @access   Private

router.get('/get-header/:Organization_ID', async (req, res) => {

    const { Organization_ID } = req.params;

    pool.query(`SELECT prh.PR_Header_ID,prh.PR_NO,
                prh.PR_Date,prh.Supplier_ID,s.Supplier_Name, 
                prh.PO_Header_ID,poh.PO_NO, prh.Receive_Location_ID,d.Department_Name,
                prh.Status,prh.Approved_By_ID,prh.Approved_Date,prh.Remarks,
                prh.Organization_ID,prh.Organization_ID,prh.Branch_ID,prh.Creation_Date,
                prh.Created_By,prh.Last_Updated_Date,prh.Last_Updated_By    
                from purchase_receive_header prh , supplier s , 
                purchase_order_header poh ,department d
                WHERE prh.Supplier_ID = s.Supplier_ID
                AND prh.PO_Header_ID = poh.PO_Header_ID
                AND prh.Receive_Location_ID = d.Department_ID
                AND prh.Organization_ID = ${Organization_ID}`,
        (err, rows, fields) => {
            if (!err) {
                if (rows.length == 0) {
                    return res.status(200).json({
                        sucess: 1,
                        message: "Record no found ",
                    })
                }
                else { res.send(rows) }

            }
            else {
                return res.status(500).json({
                    sucess: 0,
                    message: "Database is not connected. ",
                })
            }
        }
    )
}
)


                    
// @route    GET /api/pms/purchaseRece
// @desc     Get Header
// @access   Private

router.get('/get-header/:Organization_ID', async (req, res) => {

    const { Organization_ID } = req.params;

    pool.query(`SELECT prh.PR_Header_ID,prh.PR_NO,
                prh.PR_Date,prh.Supplier_ID,s.Supplier_Name, 
                prh.PO_Header_ID,poh.PO_NO, prh.Receive_Location_ID,d.Department_Name,
                prh.Status,prh.Approved_By_ID,prh.Approved_Date,prh.Remarks,
                prh.Organization_ID,prh.Organization_ID,prh.Branch_ID,prh.Creation_Date,
                prh.Created_By,prh.Last_Updated_Date,prh.Last_Updated_By    
                from purchase_receive_header prh , supplier s , 
                purchase_order_header poh ,department d
                WHERE prh.Supplier_ID = s.Supplier_ID
                AND prh.PO_Header_ID = poh.PO_Header_ID
                AND prh.Receive_Location_ID = d.Department_ID
                AND prh.Organization_ID = ${Organization_ID}`,
        (err, rows, fields) => {
            if (!err) {
                if (rows.length == 0) {
                    return res.status(200).json({
                        sucess: 1,
                        message: "Record no found ",
                    })
                }
                else { res.send(rows) }

            }
            else {
                return res.status(500).json({
                    sucess: 0,
                    message: "Database is not connected. ",
                })
            }
        }
    )
}
)


// @route    GET /api/pms/purchaseRece
// @desc     Get Line
// @access   Private

router.get('/get-line/:PR_Header_ID', async (req, res) => {

    const { PR_Header_ID } = req.params;

    pool.query(`SELECT prl.PR_Line_ID,prl.PR_Header_ID,prl.Item_ID,i.Item_Name,
                prl.UOM_Name,prl.Qty, prl.Price,prl.GST_Per,prl.GST_Amt,
                prl.WHT_Per,prl.WHT_Amt,prl.Total_Amt,prl.Creation_Date,
                prl.Created_By,prl.Last_Updated_Date,prl.Last_Updated_By
                from purchase_receive_line prl , item i
                WHERE prl.Item_ID = i.Item_ID
                AND  prl.PR_Header_ID  = ${PR_Header_ID}`,
        (err, rows, fields) => {
            if (!err) {
                if (rows.length == 0) {
                    return res.status(200).json({
                        sucess: 1,
                        message: "Record no found ",
                    })
                }
                else { res.send(rows) }

            }
            else {
                return res.status(500).json({
                    sucess: 0,
                    message: "Database is not connected. ",
                })
            }
        }
    )
}
)












// @route    POST /api/pms/create-supplier
// @desc     Create Supplier
// @access   Private 

router.post('/create-supplier', async (req, res) => {

    let current_date = new Date();
    const body = req.body;

    const { error, value } = joiSupplierValidate.validate(req.body);
    console.log(`Value from Joi - ${value}`);
    if (error) {
        console.log(error);
        return res.status(403).send(error);
    }
    else {

        pool.query(
            `insert into Supplier
           (Supplier_Name,Supplier_Type,Address_Line1,Address_Line2,City_ID,Country_ID,
            Tel_NO1,Tel_NO2,Email,Website,Contact_Person,Contact_Person_Mobile,Contact_Person_Email,
            NTN_NO,Sales_Tax_NO,Remarks,Organization_ID,Branch_ID,
            Enabled_Flag,Creation_Date,Created_By,Last_Updated_By )
            values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [body.Supplier_Name,
            body.Supplier_Type,
            body.Address_Line1,
            body.Address_Line2,
            body.City_ID,
            body.Country_ID,
            body.Tel_NO1,
            body.Tel_NO2,
            body.Email,
            body.Website,
            body.Contact_Person,
            body.Contact_Person_Mobile,
            body.Contact_Person_Email,
            body.NTN_NO,
            body.Sales_Tax_NO,
            body.Remarks,
            body.Organization_ID,
            body.Branch_ID,
            body.Enabled_Flag,
                current_date,
            body.Created_By,
            body.Last_Updated_By
            ],

            (err, results, fields) => {
                if (!err) {
                    // res.send(results) 
                    return res.status(200).json({
                        sucess: 0,
                        message: "Record has been insert --",
                        results,
                        fields

                    })
                }
                else {
                    return res.status(500).json({
                        sucess: 1,
                        message: err.sqlMessage
                    }
                    );
                }
            })
    }
})


// @route    PUT /api/psm/update-supplier/id
// @desc     Update Supplier
// @access   Private 
router.put('/update-supplier/:id', (req, res) => {
    const { error, value } = joiSupplierValidate.validate(req.body);
    //console.log('Value from Joi',value);
    if (error) {
        // console.log(error);
        return res.status(403).send(error);
    } else {
        pool.query('UPDATE Supplier SET ? Where Supplier_ID = ?', [req.body, req.params.id], (err, result) => {
            if (err) throw err;

            // console.log(`Changed ${result.changedRows} row(s)`);
            return res.status(200).json({
                msg: `Record has been updated ${result.changedRows} row(s)`,
                updated: true
            });
        })
    }
})

// @route    DELETE /api/psm/delete-supplier/id
// @desc     Delete Supplier
// @access   Private

router.delete('/delete-supplier/:id', (req, res) => {
    pool.query('DELETE from Supplier Where Supplier_ID = ?', [req.params.id], (err, result) => {
        if (err) {
            // console.log(err)
            return res.status(400).send(err)
        };

        return res.status(200).json({
            msg: `Supplier ID : ${req.params.id} Deleted`,
            deleted: true
        });
    })
})


module.exports = router;
