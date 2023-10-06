const apiRouter = require('express').Router();
const userRouter = require('./user-router');
const articleRouter = require('./article-router');
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
    deleteArticleById} = require("../db/controllers/controllers");


apiRouter.use('/users',userRouter)    
apiRouter.get('/topics', getTopics);
apiRouter.get('/articles', getTopics);
apiRouter.get('/', getApi);

apiRouter.delete('/comments/:comment_id', deleteCommentById)

apiRouter.patch('/comments/:comment_id', patchCommentByCommentId)
apiRouter.post('/topics',postTopic)


module.exports = apiRouter;