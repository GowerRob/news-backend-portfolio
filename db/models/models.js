const db =require('../connection');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;')
    .then((response)=>{
        return response.rows;
    })
}

exports.fetchArticleById=(id)=>{
    return db.query(`SELECT * from articles
        WHERE article_id = $1;`,[id])
        .then((results)=>{
            if(results.rows.length===0){
                return Promise.reject({status:404, msg:"Article does not exist"})
              }else{
                return results.rows[0];
              }

        })

}