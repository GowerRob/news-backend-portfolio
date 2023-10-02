const express = require('express');
const {getTopics} = require("./db/controllers/controllers");
const app = express();

app.get('/api/topics', getTopics);


app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})




app.use((err,req,res,next)=>{
    res.status(500).send({msg:"internal server error"});
})

module.exports = app;