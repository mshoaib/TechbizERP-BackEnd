var express = require("express");
var router = express.Router();
const db = require("../../../config/db");
const { joiPurchaseLineArray, joiPurchaseLineUpdate } = require("../../../joiSchemas/pms/purchaseOrder/joiPurchaseLine");
const { joiPurchaseHeaderInsert, joiPurchaseHeaderUpdate } = require("../../../joiSchemas/pms/purchaseOrder/joiPurchaseHeader");

router.get('/get/header/:Organization_ID',(req,res) => {
	const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)
  const searchTerm = req.query.search;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const { Organization_ID } = req.params

	let searchQuery = 
  `SELECT PO_Header_ID, PO_NO, PO_Date,Payment_Type, Ref_No, po.Remarks, Status,
  po.Enabled_Flag, s.Supplier_Name, d.Department_Name from purchase_order_header AS po
  INNER JOIN supplier AS s ON po.Supplier_ID = s.Supplier_ID
	INNER JOIN department AS d ON po.Ship_To_ID = d.Department_ID
  WHERE PO_NO LIKE '%${searchTerm}%' OR PO_Date LIKE '%${searchTerm}%'
  OR s.Supplier_Name LIKE '%${searchTerm}%' OR d.Department_Name LIKE '%${searchTerm}%'
  OR Ref_No LIKE '%${searchTerm}%' OR Payment_Type LIKE '%${searchTerm}%'
  AND po.Organization_ID = ${Organization_ID}
  ORDER BY po.Organization_ID ASC limit ${limit} OFFSET ${startIndex}`;

	let searchCountQuery = 
  `SELECT count(*) as totalCount from purchase_order_header AS po
  INNER JOIN supplier AS s ON po.Supplier_ID = s.Supplier_ID
	INNER JOIN department AS d ON po.Ship_To_ID = d.Department_ID
  WHERE PO_NO LIKE '%${searchTerm}%' OR PO_Date LIKE '%${searchTerm}%'
  OR s.Supplier_Name LIKE '%${searchTerm}%' OR d.Department_Name LIKE '%${searchTerm}%'
  OR Ref_No LIKE '%${searchTerm}%' OR Payment_Type LIKE '%${searchTerm}%'
  AND po.Organization_ID = ${Organization_ID}`;

  const results = {};	

  db.query(searchCountQuery,(err,rows) => {
		if (err) {
      console.log(err);
      return res.status(400).send(err);
    };
		const numberOfRows = rows[0].totalCount;	

		results["totalPages"] = Math.ceil(numberOfRows/limit);

		if (endIndex < numberOfRows) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }
    
    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    db.query(searchQuery,(err,rows) => {
    	if (err) {
        console.log(err);
        return res.status(400).send(err);
      };
    	// console.log('rows',rows)

    	results['results'] = rows;
    	res.status(200).send(results);
    })
	})
})

router.get('/get/line/:PO_Header_ID',(req,res) => {
	const { PO_Header_ID } = req.params;

	let sql =
	`SELECT pl.PO_Line_ID, PO_Header_ID, pl.Item_ID, i.Item_Name, pl.UOM_Name, Item_Qty,
	Price, GST_Per,GST_Amt, Total_Amt, u.UOM_ID from purchase_order_line as pl INNER JOIN item as i
	ON pl.Item_ID = i.Item_ID INNER JOIN uom as u ON pl.UOM_Name = u.UOM_Name WHERE PO_Header_ID = ?`;
	db.query(sql,[PO_Header_ID],(err,results) => {
		if(err){
			console.log(err)
			return res.status(400).send(err);
		}

		return res.status(200).send(results);
	})
})

router.post("/add/:type", (req, res) => {
	const { lines, header } = req.body;
	const { type } = req.params;

	let { error, value } = joiPurchaseLineArray.validate(lines);
	let { error1, value1 } = joiPurchaseHeaderInsert.validate(header);
	if (error || error1) {
		console.log(error,error1)
		return res.status(403).send(error);
	} else {
		if(type === 'post'){
			header["Enabled_Flag"] = 1;
		} else {
			header["Enabled_Flag"] = 'Y';
		}
		let sql = "INSERT INTO purchase_order_header SET ?";
		db.query(sql, header, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err);
			}

			let newData = []; 
			const headerID = result.insertId;
			const date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
			const dateTime = new Date();

			value.forEach((line, index) => {
				line["PO_Header_ID"] = headerID;
				newData.push(Object.values(line));
			});

			sql = 
				`INSERT INTO purchase_order_line (Item_ID, UOM_Name, Item_Qty, Price, GST_Per, GST_Amt,
			  Total_Amt,Created_By, Creation_Date,Last_Updated_Date,
 				Last_Updated_By, PO_Header_ID) VALUES ?`;
			db.query(sql, [newData], (err, result) => {
				if (err) {
					console.log(err);
					db.query("DELETE from purchase_order_header where PO_Header_ID = ?", [
						headerID,
					]);
					return res.status(400).send(err);
				}

				return res
					.status(200)
					.send(`${result.affectedRows} Records Added SuccessFully.`);
			});
		});
	}
});

router.put('/update/:PO_Header_ID/:type',(req,res) => {
	const { lines, header } = req.body;
	const { PO_Header_ID, type } = req.params;

	let { error, value } = joiPurchaseHeaderUpdate.validate(header);
	if (error) {
		console.log(error);
		return res.status(403).send(error);
	} else {
		if(type === 'post'){
			value["Enabled_Flag"] = 1;
		} else {
			value["Enabled_Flag"] = 'Y';
		}
		let sql = "UPDATE purchase_order_header SET ? WHERE PO_Header_ID = ?";
		db.query(sql, [value,PO_Header_ID], (err, result) => {
			if (err) {
				console.log(err);
				return res.status(400).send(err);
			}

			const newEntries = lines.filter(line => !line.hasOwnProperty('PO_Line_ID'));
			const UpdatedEntries = lines.filter(line => line.hasOwnProperty('PO_Line_ID'))
			let newData = []; 
			let sql = '';
			let UpdateQuery = '';
			let newEntryQuery = '';

			if( UpdatedEntries.length > 0){
				UpdatedEntries.map(item => { //removing unwanted fields
					delete item.Item_Name;
					delete item.UOM_ID;
				})
				UpdatedEntries.forEach( (item) => {
				  UpdateQuery += db.format("UPDATE purchase_order_line SET ? WHERE PO_Line_ID = ?; ", [item,item.PO_Line_ID]);
				});
				sql = sql + UpdateQuery;
			}

			if(newEntries.length > 0 ){
				newEntries.forEach((line, index) => {
					delete line.Item_Name;
					delete line.UOM_ID
					line["PO_Header_ID"] = PO_Header_ID;
					newData.push(Object.values(line));
				});		
				newEntryQuery = db.format("INSERT INTO purchase_order_line (Item_ID, UOM_Name, Item_Qty, Price, GST_Per, GST_Amt, Total_Amt,Created_By, Creation_Date,Last_Updated_Date, Last_Updated_By, PO_Header_ID) VALUES ? ;",[newData])
				sql = sql + newEntryQuery;
			}

			db.query(sql, (err, result) => {
				if (err) {
					console.log(err);
					return res.status(400).send(err);
				}
				return res
					.status(200)
					.send(`${result.affectedRows} Records Added SuccessFully.`);
			});
		});
	}
})


router.delete('/delete/:PO_Header_ID',(req,res) => {
	const { PO_Header_ID } = req.params;

	let sql = 
	`DELETE from purchase_order_line Where PO_Header_ID = ?;
	DELETE from purchase_order_header WHERE PO_Header_ID = ?`
	db.query(sql,[PO_Header_ID,PO_Header_ID],(err,result) => {
    if (err){
      console.log(err)
      return res.status(400).send(err)
    };

    return res.status(200).json({
      msg:`PO : ${req.params.id} Deleted`,
      deleted: true
    });
  })
})

router.delete('/delete/line/:PO_Line_ID',(req,res) => {
	const { PO_Line_ID } = req.params;

	let sql = 
	`DELETE from purchase_order_line Where PO_Line_ID = ?`;
	db.query(sql,[PO_Line_ID],(err,result) => {
    if (err){
      console.log(err)
      return res.status(400).send(err)
    };

    return res.status(200).json({
      msg:`PO : ${req.params.id} Deleted`,
      deleted: true
    });
  })
})

module.exports = router;