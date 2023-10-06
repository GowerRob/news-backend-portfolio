const db =require('../connection');
const format= require('pg-format');
const { topicData } = require('../data/test-data');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;',)
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
                
                return Promise.reject({status:404, msg:"Article does not exist"});
              }else{
                return results.rows[0];
              }
        })
}

exports.fetchCommentsByArticleId=(article_id,limit=10,p=1)=>{
    const queryStr=`SELECT  comment_id,votes,
        created_at, author, 
        body,article_id
    FROM comments
    WHERE article_id =$1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;`

    return db.query(queryStr,[article_id,limit,((p-1)*limit)])
    .then((results)=>{
            return results.rows;
          

    })
}

exports.fetchAllArticles = (sort_by='created_at', order='DESC', topic,limit=10,p=1)=>{
    const values=[limit,((p-1)*limit)];
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

    let queryStr=`SELECT articles.author,articles.title,
    articles.article_id,articles.topic,
    articles.created_at,articles.votes, 
    articles.article_img_url, 
    CAST(COUNT(comments.article_id) as INTEGER) as comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id=comments.article_id
    `

    if(topic!=undefined){
        queryStr+=` WHERE articles.topic = $3`
        values.push(topic)
    }

    queryStr+= ` GROUP BY articles.article_id ORDER BY ${validSortBy[sort_by]} ${validOrders[order]}
    LIMIT $1 OFFSET $2;
    `
    return db.query(queryStr, values)
    .then((response)=>{
               return response.rows; 
    })
}

exports.updateArticleById=(patchData,article_id)=>{
    const queryStr=`
    UPDATE articles
    SET votes=votes + $1
    WHERE article_id = $2 
    RETURNING *;
    `
    const values=[patchData,article_id];
    return db.query(queryStr,values)
    .then((response)=>{
        if (response.rowCount === 0){
            
            return Promise.reject({status: 404, msg: 'Article does not exist'})
        }   
        else {
            return response.rows[0] 
        }
    });
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
    WHERE comment_id = $2
    RETURNING *
    ;`
    const queryValues=[patchData.inc_votes, Number(comment_id)];
    return db.query(queryStr,queryValues)
    .then((response)=>{
        if(response.rowCount===0){
            return Promise.reject({status: 404, msg: 'Comment does not exist'})
        }else{
          return response.rows[0]  
        }
    })

}

exports.insertArticle=(newArticle)=>{
    const queryStr=`INSERT  INTO articles 
    (title,topic,author,body,article_img_url)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    ;`


    const values=[newArticle.title,
        newArticle.topic,
        newArticle.author,
        newArticle.body,
        newArticle.article_img_url||"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        ]

    return db.query(queryStr,values)
    .then((response)=>{
        return response.rows[0];
});
}

exports.insertTopic=(newTopic)=>{
    const queryStr=`INSERT  INTO topics
    (slug,description)
    VALUES ($1,$2)
    RETURNING *
    ;`;

    const values=[newTopic.slug,newTopic.description]
    return db.query(queryStr,values)
    .then((response)=>{
        return response.rows[0];
    });



}