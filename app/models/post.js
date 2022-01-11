const db = require('../services/db');
const { Like } = require('./like');
const { Comment } = require('./comment');
class Post {

    constructor() {
    }

    async getPosts() {
        var sql = `SELECT p.*,CONCAT(u.firstName , ' ' , u.lastName) as ownerName,g.name as gameName FROM posts p
        JOIN users u ON u.id = p.userId
        JOIN games g ON g.id = p.gameId ORDER BY p.id DESC`;
        const posts = await db.query(sql);
        for (const p of posts) {
            var like = new Like(p.id);
            var comment = new Comment(p.id);
            p.likeCount = await like.getLikeCount();
            p.commentCount = await comment.getCommentCount();
            p.comments = await comment.getComments();
        }
        return posts;
    }

    async insertPost(data) {
        var sql = `INSERT INTO posts (userId, gameId, title, description) 
        VALUES ('${data.userId}', '${data.gameId}', '${data.title}', '${data.description}')`;
        const result = await db.query(sql);
        this.id = result.insertId;
        return true;
    }

    async getPostByGame(gameId) {
        var sql = `SELECT p.*,CONCAT(u.firstName , ' ' , u.lastName) as ownerName,g.name as gameName FROM posts p
        JOIN users u ON u.id = p.userId
        JOIN games g ON g.id = p.gameId
        WHERE p.gameId = ${gameId} ORDER BY p.id DESC`;
        const posts = await db.query(sql);
        for (const p of posts) {
            var like = new Like(p.id);
            var comment = new Comment(p.id);
            p.likeCount = await like.getLikeCount();
            p.commentCount = await comment.getCommentCount();
            p.comments = await comment.getComments();
        }
        return posts;
    }

}

module.exports = {
    Post
}