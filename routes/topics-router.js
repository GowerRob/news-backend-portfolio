const topicRouter = require('express').Router();
const { getTopics, 
    postTopic,} = require("../db/controllers/controllers");


topicRouter.get('/', getTopics);
topicRouter.post('/',postTopic)

module.exports = topicRouter;