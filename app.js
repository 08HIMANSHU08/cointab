
const path = require('path');

const express = require('express');

var cors = require('cors');

require('dotenv').config();

const sequelize=require('./util/database');

const adminRoutes = require('./routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/user',adminRoutes)

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`${req.url}`))
})
sequelize.sync()
.then(()=>{
    console.log("Port Active")
    app.listen(process.env.PORT||3000)
})
.catch(err=>{console.log(err)});
