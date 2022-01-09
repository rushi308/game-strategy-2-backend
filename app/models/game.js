const db = require('../services/db');

class Game {
    constructor() {
    }

    async getGamesList(){
        var sql = `SELECT g.*,count(p.id) as postCount FROM game_strategy.games g
        JOIN posts p ON p.gameId = g.id group by g.id`;
        const games =  await db.query(sql);
        return games;
    }

}

module.exports = {
    Game
}