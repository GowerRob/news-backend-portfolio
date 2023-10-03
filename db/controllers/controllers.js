const { fetchTopics ,
        fetchArticleById,
        fetchCommentsByArticleId,
        fetchAllArticles} = require("../models/models");

const {fetchArticleByIds} = require("../models/article.models")

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
    const {article_id}=req.params;

    const promises=[fetchCommentsByArticleId(article_id),fetchArticleByIds(article_id)]
    Promise.all(promises)
    .then(([comments,articleDetails])=>{
        res.status(200).send({comments:comments});
    }).catch((err)=>{
        next(err)
    })
}
exports.getAllArticles = (req,res,next)=>{
    fetchAllArticles()
    .then((articles)=>{
        res.status(200).send({articles:articles});
    }).catch((err)=>{
        next(err)
    })
}


