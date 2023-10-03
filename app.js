const express = require('express');
const { getTopics,
        getApi,
        getArticleById,
        getAllArticles,
        postCommentByArticleId} = require("./db/controllers/controllers");

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles',getAllArticles)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})


//Error Handing
app.use((err,req,res,next)=>{
    //An invalid request
    if(err.code==="22P02"){
      res.status(400).send({msg:'Bad request'})
    }
    if(err.code==="23503"){
        res.status(404).send({msg:'Bad request'})
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