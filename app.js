const express = require('express');
const {handlePSQLErrors,handleCustomErrors, handle500Errors} = require("./db/controllers/errorHandling.controllers")

const apiRouter=require('./routes/api-router')

const cors = require('cors')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api',apiRouter)

app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})

//Error Handing
app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;