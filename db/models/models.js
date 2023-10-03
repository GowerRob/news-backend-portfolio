const db =require('../connection');

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
    console.log("In model")
    const queryStr=`SELECT  comment_id,votes,
        created_at, author, 
        body,article_id
    FROM comments
    WHERE article_id =$1
    ORDER BY created_at DESC;`

    return db.query(queryStr,[article_id])
    .then((results)=>{
        console.log(results.rows)
        if(results.rows.length===0){
            console.log("Out model 1")
            return Promise.reject({status:404, msg:"No comments for this article"})
          }else{
            console.log("Out model 2")
            return results.rows;
          }

    })

}