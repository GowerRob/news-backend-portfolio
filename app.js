const express = require('express');
const {getTopics,getApi,getArticleById,getCommentsByArticleId} = require("./db/controllers/controllers");
const {handlePSQLErrors,handleCustomErrors, handle500Errors} = require("./db/controllers/errorHandling.controllers")

const app = express();


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments',getCommentsByArticleId)



app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})


//Error Handing
app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;