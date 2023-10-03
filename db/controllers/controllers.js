const { fetchTopics ,
        fetchArticleById,
        fetchCommentsByArticleId} = require("../models/models");
const {readFile}=require('fs/promises');
exports.getTopics = (req,res,next)=>{
    fetchTopics().then((topics)=>{
        res.status(200).send({topics:topics});
    }).catch((err)=>{
        next(err)
    });
}

exports.getApi = (req,res)=>{
        readFile(`endpoints.json`,"utf-8")
        .then((file)=>{
        const apiData=JSON.parse(file);
        res.status(200).send(apiData)
    })
}

exports.getArticleById = (req, res,next)=>{
    const {article_id}=req.params
    fetchArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article:article});
    }).catch((err)=>{
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next)=>{
    console.log("In control")
    const {article_id}=req.params;
    fetchCommentsByArticleId(article_id)
    .then((comments)=>{
        res.status(200).send({comments:comments});
    }).catch((err)=>{
        next(err)
    })
}


