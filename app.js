const express = require('express');
const {getTopics,getApi,getArticleById} = require("./db/controllers/controllers");
const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id',getArticleById)

app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})


//Error Handing
app.use((err,req,res,next)=>{
    //An invalid request
    if(err.code==="22P02"){
      res.status(400).send({msg:'Bad request'})
    }
    next(err);
  });

app.use((err,req,res,next)=>{
    if(err.status){
        res.status(err.status).send({msg: err.msg});
    }
    next(err)
})


app.use((err,req,res,next)=>{
    res.status(500).send({msg:"internal server error"});
})

module.exports = app;