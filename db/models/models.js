const db =require('../connection');
const format= require('pg-format');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;')
    .then((response)=>{
        return response.rows;
    })
}

exports.fetchArticleById=(id)=>{
    return db.query(`SELECT * from articles
        WHERE article_id = $1;`,[id])
        .then((response)=>{
            if(response.rows.length===0){
                return Promise.reject({status:404, msg:"Article does not exist"})
              }else{
                return response.rows[0];
              }
        })
}

exports.fetchAllArticles=()=>{
    console.log("Mod in")
    const queryStr=`SELECT  articles.author,articles.title,
    articles.article_id,articles.topic,
    articles.created_at,articles.votes, 
    articles.article_img_url, COUNT(comments.comment_id)
    FROM articles
    JOIN comments On articles.article_id=comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `
    return db.query(queryStr).
    then((response)=>{
        console.log(response.rows)
        return response.rows
    })
}