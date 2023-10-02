const db =require('../connection');

exports.fetchTopics=()=>{
    return db.query('SELECT * from topics;')
    .then((response)=>{
        return response.rows;
    }).catch((err)=>{
        next(err)
    });

}