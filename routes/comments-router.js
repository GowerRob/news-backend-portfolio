const commentsRouter = require('express').Router();
const {
    deleteCommentById,
    patchCommentByCommentId,} = require("../db/controllers/controllers");


commentsRouter.delete('/:comment_id', deleteCommentById)
commentsRouter.patch('/:comment_id', patchCommentByCommentId)

module.exports = commentsRouter;