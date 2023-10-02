const express = require('express');
const {getTopics} = require("./db/controllers/controllers");
const app = express();

app.get('/api/topics', getTopics);



app.use((err,req,res,next)=>{
    res.status(500).send({msg:"internal server error"});
})

module.exports = app;