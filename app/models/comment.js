const db = require('../services/db');

class Comment {
    postId;
    constructor(postId) {
        this.postId = postId;
    }

    async getCommentCount(){
        var sql = `SELECT COUNT(id) as commentCount FROM postComments
        WHERE postId = ${this.postId}`;
        const counts =  await db.query(sql);
        return counts[0] ? counts[0].commentCount : 0;
    }

    async getComments(){
        var sql = `SELECT pc.*,CONCAT(u.firstName,' ',u.lastName) as user FROM postComments pc
        JOIN posts p ON p.id = pc.postId
        JOIN users u ON u.id = pc.userId
        WHERE pc.postId = ${this.postId}`;
        const comments =  await db.query(sql);
        return comments.length > 0  ? comments : [];
    }

    async commentOnPost(data,userId){
        var sql = `INSERT INTO postComments(postId,userId,comment) 
        VALUES (${data.postId},${userId},'${data.comment}')`;
        const result =  await db.query(sql);
        return result;
    }
    
}

module.exports = {
    Comment
}