const db =require('../connection');

exports.fetchArticleByIds = (article_id) =>{
        return db.
        query("SELECT * FROM comments WHERE comment_id = $1", [article_id])
        .then((result)=>{
            if (result.rowCount === 0){
                return Promise.reject({status: 404, msg:"No article with that id"});
            } else {
                return result.rows[0];
            }
        })

};