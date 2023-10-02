const { fetchTopics ,fetchArticleById} = require("../models/models");

exports.getTopics = (req,res,next)=>{
    fetchTopics().then((topics)=>{
        res.status(200).send({topics:topics});
    }).catch((err)=>{
        next(err)
    });

}

exports.getArticleById = (req, res,next)=>{
    const {article_id}=req.params
    fetchArticleById(article_id)
    .then((article)=>{
        console.log('in controlel',article)
        res.status(200).send({article:article});
    }).catch((err)=>{
        next(err)
    })

}