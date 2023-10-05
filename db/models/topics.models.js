const db =require('../connection');

exports.fetchTopicsBySlug = (topic) =>{

        return db.
        query("SELECT * FROM topics WHERE slug = $1", [topic])
        .then((result)=>{
            if (result.rowCount === 0){
                return Promise.reject({status: 404, msg:"No topic with that id"});
            } else {
                return result.rows[0];
            }
        })

};