const apiRouter = require('express').Router();
const userRouter = require('./user-router');
const articleRouter = require('./article-router');
const topicRouter = require('./topics-router');
const commentsRouter = require('./comments-router');
const {getApi} = require("../db/controllers/controllers");


apiRouter.use('/users',userRouter)  
apiRouter.use('/articles',articleRouter)  
apiRouter.use('/topics',topicRouter)  
apiRouter.use('/comments',commentsRouter)
apiRouter.get('/', getApi);

module.exports = apiRouter;