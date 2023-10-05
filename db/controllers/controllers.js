const { fetchTopics ,
        fetchArticleById,
        fetchCommentsByArticleId,
        fetchAllArticles,
        updateArticleById} = require("../models/models");


const {readFile}=require('fs/promises');
const { articleData } = require("../data/test-data");

exports.getTopics = (req,res,next)=>{
    fetchTopics().then((topics)=>{
        res.status(200).send({topics});
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
        res.status(200).send({article});
    }).catch((err)=>{
        next(err)
    })
}

exports.getCommentsByArticleId = (req, res, next)=>{
    const {article_id}=req.params;

    const promises=[fetchCommentsByArticleId(article_id),fetchArticleById(article_id)]
    Promise.all(promises)
    .then(([comments])=>{
        res.status(200).send({comments});
    }).catch((err)=>{
        next(err)
    })
}
exports.getAllArticles = (req,res,next)=>{
    fetchAllArticles()
    .then((articles)=>{
        res.status(200).send({articles});
    }).catch((err)=>{
        next(err)
    })
}


exports.patchArticleById =(req,res,next)=>{
    
    const patchData=req.body;
    const {article_id}=req.params;
    updateArticleById(patchData.inc_votes,article_id)
    .then((article)=>{
        res.status(201).send({article});
    }).catch((err)=>{
        next(err)
    })
}




