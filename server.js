const express = require('express');
const app = express();

const menuRoute = require('./routes/navigationRoute');
const errorHandler = require(`./middleware/error`);

/************   Login  *******************/
const loginRoute = require('./routes/loginRoute');

/************   Inventory  *******************/
const uomRoute = require('./routes/inv/uomRoute');
const icgtRoute = require('./routes/inv/icgtRoute');
const icgRoute = require('./routes/inv/icgRoute');
const icRoute = require('./routes/inv/icRoute');
const iscRoute = require('./routes/inv/iscRoute');
const itemRouter = require('./routes/inv/itemRouter');
const scmrRoute = require('./routes/inv/scmrRoute');
const openBalRoute = require('./routes/inv/openBalRoute');

const lovRoute = require('./routes/inv/lovRoute');

/************   Admin  *******************/
const busgrpRoute = require('./routes/adm/busgrpRoute');
const orgRoute = require('./routes/adm/orgRoute');
const branchRoute = require('./routes/adm/branchRoute');
const deptRoute = require('./routes/adm/deptRoute');

const lovadmRoute = require('./routes/adm/lovadmRoute');

/************   Security  *******************/

const applicationRouter = require('./routes/security/applicationRoute');
const rolesRouter = require('./routes/security/rolesRoute');
const rolesFormsRouter = require('./routes/security/rolesFormsRoute');
const rolesModulesRouter = require('./routes/security/rolesModulesRoute');
const usersRouter = require('./routes/security/usersRoute');
const userRolesRouter = require('./routes/security/userRolesRoute');

var indexRouter = require('./routes/index');

/************   Purchase  *******************/

const psmLovRouter = require('./routes/pms/lovRoute'); //Lov

const itemLovRouter = require('./routes/pms/purchaseOrder/itemRoute'); //PO
const purchaseOrderRouter = require('./routes/pms/purchaseOrder/purchaseOrderRoute'); //PO
const departmentLovRouter = require('./routes/pms/purchaseOrder/departmentRoute'); //PO
const supplierLovRouter = require('./routes/pms/purchaseOrder/supplierLovRoute'); //PO
const supplierRouter = require('./routes/pms/supplierRoute');
const purchasaeReceRouter = require('./routes/pms/purchaseReceive/purchaseReceRoute');
const pmsrRoute = require('./routes/pms/pmsrRoute');

//const cors = require('cors')

const cors = require('cors');

app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);

app.use(cors());

//********************************************************** */
// @ ***************** Initial routes ***********************
//********************************************************** */

app.use('/api/', loginRoute); // Login Authentication

// @ ***************** Security Module *********************

app.use('/api/application', applicationRouter);

app.use('/api/sem/roles-modules', rolesModulesRouter);
app.use('/api/sem/roles-forms', rolesFormsRouter);
app.use('/api/sem/roles', rolesRouter);
app.use('/api/sem/user-roles', userRolesRouter);
app.use('/api/sem/users', usersRouter);

app.use('/api', indexRouter);

// @ ***************** Inventory Module *********************

app.use('/api/inv/', lovRoute); // All lov of Inv Module

app.use('/api/inv/', uomRoute); // Unit of Measurement
app.use('/api/inv/', icgtRoute); // Item Cateogry Group Type
app.use('/api/inv/', icgRoute); // Item Cateogry Group
app.use('/api/inv/', icRoute); // Item Cateogry
app.use('/api/inv/', iscRoute); // Item Sub Cateogry
app.use('/api/inv/', itemRouter); // Item
app.use('/api/inv/', scmrRoute); // Item
app.use('/api/inv/', openBalRoute); // Opening Balance

// @ ***************** Administration Module *********************

app.use('/api/adm/', lovadmRoute); // All lov of Admin Module

app.use('/api/adm/', busgrpRoute); // Business Group
app.use('/api/adm/', orgRoute); // Organization
app.use('/api/adm/', branchRoute); // Branch
app.use('/api/adm/', deptRoute); // Department

// @ ***************** Purchase Module *********************

app.use('/api/pms/', psmLovRouter); //purchase lov

app.use('/api/pms/purchaseOrder/', itemLovRouter); //po

app.use('/api/pms/purchaseOrder/', supplierLovRouter); //po
app.use('/api/pms/purchaseOrder', departmentLovRouter); //po
app.use('/api/pms/purchaseOrder', purchaseOrderRouter); //purchaseOrder Route
app.use('/api/pms/', supplierRouter); //Supplier
app.use('/api/pms/purchaseRece/', purchasaeReceRouter); //Purchase Receiving
app.use('/api/pms/', pmsrRoute); //Pms  Report
app.use(errorHandler);

// Initialize port

const PORT = process.env.PORT || 5000;

// send rquest to web page

app.get('/', (req, res) =>
  res.send(`Automize Business Solution running on :${PORT}`)
);

app.listen(PORT, () => console.log('Server is running'));
