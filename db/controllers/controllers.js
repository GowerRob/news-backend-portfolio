const { fetchTopics ,
        fetchArticleById,
        fetchCommentsByArticleId,
        fetchAllArticles,
        updateArticleById,
        removeCommentById,
        fetchAllUsers,
        insertComment,
        insertArticle,
        fetchUserByUsername,
        updateCommentByCommentId} = require("../models/models");

const {fetchArticleByIds} = require("../models/article.models")
const {fetchTopicsBySlug}= require("../models/topics.models.js")

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
    const {limit,p}=req.query;
    console.log("Here in cont")
    console.log(limit, p)
    const promises=[fetchCommentsByArticleId(article_id, limit, p),fetchArticleById(article_id)]
    Promise.all(promises)
    .then(([comments])=>{
        res.status(200).send({comments});
    }).catch((err)=>{
        next(err)
    })
}
exports.getAllArticles = (req,res,next)=>{

   const {sort_by, order,topic,limit,p}=req.query
   const promises=[fetchAllArticles(sort_by, order,topic,limit,p)]
   if(topic){
    promises.push(fetchTopicsBySlug(topic))
   }
    Promise.all(promises)
    .then(([articles])=>{
        res.status(200).send({articles});
    })
    .catch((err)=>{
        console.log(err)
        next(err)
    })
}

exports.deleteCommentById = (req, res,next)=>{
    const {comment_id}=req.params;
    removeCommentById(comment_id)
    .then(()=>{
        res.status(204).send();
    })
    .catch((err)=>{
        next(err);
      });
}
exports.getUsers = (req,res,next)=>{
    fetchAllUsers()
    .then((users)=>{
        res.status(200).send({users:users});
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postCommentByArticleId = (req,res,next)=>{
    const newComment=req.body;
    const {article_id}=req.params;
    const promises=[insertComment(newComment,article_id),fetchArticleById(article_id)];
    Promise.all(promises)
    .then(([comment,articleData])=>{
        res.status(201).send({comment:comment});
    })
    .catch((err)=>{
            next(err);
        });

}

exports.postArticle = (req,res,next) => {
    const newArticle=req.body;
    insertArticle(newArticle)
    .then((article)=>{
        res.status(201).send({article});
    }) .catch((err)=>{
        next(err);
    });
}

exports.getUserByUsername = (req, res,next)=>{
    const {username}=req.params;
    fetchUserByUsername(username)
    .then((user)=>{
        res.status(200).send({user:user});
    })
    .catch((err)=>{
        next(err);
    });


}

exports.patchCommentByCommentId = (req,res,next) => {
    const {comment_id}=req.params;
    const patchData=req.body;
    updateCommentByCommentId(patchData,comment_id)
    .then((comment)=>{
        res.status(201).send({comment})
    })
    .catch((err)=>{
        next(err);
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




