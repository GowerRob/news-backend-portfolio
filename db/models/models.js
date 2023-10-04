const db =require('../connection');
const format= require('pg-format');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;')
    .then((response)=>{
        return response.rows;
    })
}

exports.fetchArticleById=(article_id)=>{
    
    return db.query(`SELECT * from articles
        WHERE article_id = $1;`,[article_id])
        .then((results)=>{
            
            if(results.rows.length===0){
                
                return Promise.reject({status:404, msg:"Article does not exist"})
              }else{
                
                return results.rows[0];
              }
        })
}



exports.fetchCommentsByArticleId=(article_id)=>{
    const queryStr=`SELECT  comment_id,votes,
        created_at, author, 
        body,article_id
    FROM comments
    WHERE article_id =$1
    ORDER BY created_at DESC;`

    return db.query(queryStr,[article_id])
    .then((results)=>{

            return results.rows;
          

    })
}

exports.fetchAllArticles=(topic)=>{
    
    const values=[]
    let queryStr=`SELECT  articles.author,articles.title,
    articles.article_id,articles.topic,
    articles.created_at,articles.votes, 
    articles.article_img_url, COUNT(comments.comment_id) as comment_count
    FROM articles
    LEFT JOIN comments On articles.article_id=comments.article_id `;

    if(topic!=undefined){
        queryStr+=`WHERE articles.topic = $1 `
        values.push(topic)
    }
    queryStr+=`GROUP BY articles.article_id
    ORDER BY created_at DESC;`
    
    return db.query(queryStr,values).
    then((response)=>{
            return response.rows;
    })
}