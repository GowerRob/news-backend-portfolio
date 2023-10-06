const articleRouter = require('express').Router();

const { 
    getArticleById,
    getCommentsByArticleId,
    getAllArticles,
    patchArticleById,
    postCommentByArticleId,
    postArticle,
    deleteArticleById} = require("../db/controllers/controllers");

articleRouter.get('/:article_id',getArticleById)
articleRouter.get('/:article_id/comments',getCommentsByArticleId)
articleRouter.get('/',getAllArticles)
articleRouter.post('/:article_id/comments', postCommentByArticleId)
articleRouter.patch('/:article_id',patchArticleById)
articleRouter.post('/', postArticle)
articleRouter.delete('/:article_id',deleteArticleById)

module.exports = articleRouter;