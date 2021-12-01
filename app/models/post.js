const db = require('../services/db');
const { Like } = require('./like');
class Post {

    constructor() {
    }
    
    async getPosts() {
        var sql = `SELECT p.*,CONCAT(u.firstName , ' ' , u.lastName) as ownerName,g.name as gameName FROM posts p
        JOIN users u ON u.id = p.userId
        JOIN games g ON g.id = p.gameId`;
        const posts =  await db.query(sql);
        for (const p of posts) {
            var like = new Like(p.id);
            p.likeCount= await like.getLikeCount();
        }
        return posts;
    }
    
    async getLikeCounts(postId)  {

    }
    
    async getStudentModules() {
    }
}

module.exports = {
    Post
}