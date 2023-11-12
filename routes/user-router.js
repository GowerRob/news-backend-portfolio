const userRouter = require('express').Router();

const { 
    getUsers,
    getUserByUsername,
    postUser
} = require("../db/controllers/controllers");


userRouter.get('/:username',getUserByUsername)
userRouter.post('/',postUser)
userRouter.get('/',getUsers)


module.exports = userRouter;