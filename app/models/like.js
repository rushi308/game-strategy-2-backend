const db = require('../services/db');

class Like {
    postId;
    constructor(postId) {
        this.postId = postId;
    }

    async getLikeCount(){
        var sql = `SELECT COUNT(id) as likeCount FROM postLikes 
        WHERE postId = ${this.postId}`;
        const counts =  await db.query(sql);
        return counts[0]?.likeCount;
    }

    async hitLikeOnPost(data,userId){
        var sql = `INSERT INTO postLikes(postId,userId) 
        VALUES (${data.postId,userId})`;
        const result =  await db.query(sql);
        return result;
    }
    
}

module.exports = {
    Like
}