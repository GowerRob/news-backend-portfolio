const express = require('express');
const {handlePSQLErrors,handleCustomErrors, handle500Errors} = require("./db/controllers/errorHandling.controllers")
const { getTopics,
        getApi,
        getArticleById,
        getCommentsByArticleId,
        getAllArticles,
        deleteCommentById} = require("./db/controllers/controllers");

const app = express();


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments',getCommentsByArticleId)
app.get('/api/articles',getAllArticles)

app.delete('/api/comments/:comment_id', deleteCommentById)


app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})


//Error Handing
app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;