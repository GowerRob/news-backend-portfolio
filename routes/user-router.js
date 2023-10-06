const userRouter = require('express').Router();

const { 
    getUsers,
    getUserByUsername
} = require("../db/controllers/controllers");


userRouter.get('/:username',getUserByUsername)
userRouter.get('/',getUsers)

module.exports = userRouter;