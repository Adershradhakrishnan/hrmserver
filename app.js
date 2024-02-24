
require("dotenv").config();
const express = require('express')
const app = express()
const dotenv =require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authroutes')
app.use(express.json());
app.use(authRoutes);



// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

console.log("__dirname: ",__dirname);
app.use('/',express.static(__dirname + "/hrm_client"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})