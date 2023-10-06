const express = require('express');
const {handlePSQLErrors,handleCustomErrors, handle500Errors} = require("./db/controllers/errorHandling.controllers")
const { getTopics,
        getApi,
        getArticleById,
        getCommentsByArticleId,
        getAllArticles,
        patchArticleById,
        deleteCommentById,
        getUsers,
        postCommentByArticleId,
        postArticle,
        getUserByUsername,
        patchCommentByCommentId,
        postTopic,
        deleteArticleById} = require("./db/controllers/controllers");

const app = express();
app.use(express.json());


app.get('/api/topics', getTopics);
app.get('/api', getApi);
app.get('/api/articles/:article_id',getArticleById)
app.get('/api/articles/:article_id/comments',getCommentsByArticleId)
app.get('/api/articles',getAllArticles)
app.post('/api/articles/:article_id/comments', postCommentByArticleId)

app.patch('/api/articles/:article_id',patchArticleById)
app.delete('/api/comments/:comment_id', deleteCommentById)

app.get('/api/users',getUsers)

app.post('/api/articles', postArticle)
app.get('/api/users/:username',getUserByUsername)

app.patch('/api/comments/:comment_id', patchCommentByCommentId)

app.post('/api/topics',postTopic)

app.delete('/api/articles/:article_id',deleteArticleById)


app.all('/*',(req,res,next)=>{
    res.status(404).send({msg:"bad request"})
})

//Error Handing
app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;