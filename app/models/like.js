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
    
}

module.exports = {
    Like
}