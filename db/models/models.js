const db =require('../connection');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;')
    .then((response)=>{
        return response.rows;
    })
}

exports.fetchArticleById=()=>{
    return db.query(`SELECT * from articles
        WHERE article_id=4;`)
        .then((response)=>{
            console.log("In model",response.rows);
            return response.rows[0];
        })

}