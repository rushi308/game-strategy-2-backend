const db = require('../services/db');

class Like {
    id;
    constructor(id) {
        this.id = id;
    }

    async getLikeCount(){
        var sql = `SELECT COUNT(id) as likeCount FROM postLikes 
        WHERE postId = ${this.id}`;
        const counts =  await db.query(sql);
        return counts[0]?.likeCount;
    }
    
}

module.exports = {
    Like
}