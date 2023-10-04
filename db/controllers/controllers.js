const { fetchTopics ,
        fetchArticleById,
        fetchCommentsByArticleId,
        fetchAllArticles,
        removeCommentById,
        fetchAllUsers,
        insertComment,
        fetchUserByUsername} = require("../models/models");

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
    const {sort_by, order}=req.query
    fetchAllArticles(sort_by, order)
    .then((articles)=>{
        res.status(200).send({articles:articles});
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