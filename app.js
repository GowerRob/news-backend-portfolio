const express = require('express');
const {getTopics,getArticleById} = require("./db/controllers/controllers");
const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id',getArticleById)

app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})






app.use((err,req,res,next)=>{
    res.status(500).send({msg:"internal server error"});
})

module.exports = app;