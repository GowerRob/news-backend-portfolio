const db =require('../connection');
const format= require('pg-format');
const { topicData } = require('../data/test-data');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;')
    .then((response)=>{
        return response.rows;
    })
}

exports.fetchArticleById=(article_id)=>{
    
    return db.query(`
    SELECT articles.author,articles.title,
    articles.article_id, articles.body,
    articles.topic, articles.created_at,
    articles.votes, articles.article_img_url,
    CAST(COUNT(comments.article_id) as INTEGER) as comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id=comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,[article_id])
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

exports.fetchAllArticles = (sort_by='created_at', order='DESC')=>{
    const validSortBy={
        created_at:"articles.created_at",
        title:"articles.title",
        votes:"articles.votes",
        author:"articles.author",
        article_id:"articles.article_id",
        topic:"articles.topic",
        article_img_url:"articles.article_img_url",
        comment_count:"comment_count"
    }
    const validOrders={
        DESC:"DESC",
        ASC:"ASC",
        asc:"ASC",
        desc:"DESC"
    }
    let queryStr=`SELECT  articles.author,articles.title,
    articles.article_id,articles.topic,
    articles.created_at,articles.votes, 
    articles.article_img_url, 
    CAST(COUNT(comments.article_id) as INTEGER) as comment_count 
    FROM articles
    LEFT JOIN comments On articles.article_id=comments.article_id
    GROUP BY articles.article_id
    ORDER BY ${validSortBy[sort_by]} ${validOrders[order]};
    `

    return db.query(queryStr)
    .then((response)=>{
            return response.rows;
    })
}

exports.removeCommentById=(comment_id)=>{
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    ;`,[comment_id])
    .then((results)=>{
        if(results.rowCount===0){
            return Promise.reject({status:404, msg:'No comment with that id'})
          }
    })
}
exports.insertComment=(newComment,article_id)=>{
    const values=[newComment.body,article_id,newComment.username];
    const queryStr=`
    INSERT INTO comments
    (body, article_id, author)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    return db.query(queryStr,values)
    .then((response)=>{
        return response.rows[0]
    })
}



exports.fetchAllUsers=()=>{
return db.query(`SELECT  * FROM users;`)
.then((response)=>{
    return response.rows;
})
}

exports.fetchUserByUsername=(username)=>{
    return db.query(`
    SELECT * 
    FROM users
    WHERE username= $1;
    `,[username])
    .then((response)=>{
        if(response.rowCount===0){
            return Promise.reject({status: 404, msg: 'User does not exist'})
        }else{
          return response.rows[0]  
        }
        
    })
}    

exports.updateCommentByCommentId=(patchData,comment_id)=>{
    const queryStr=`
    UPDATE comments
    SET votes=votes + $1
    WHERE arti
    `


}