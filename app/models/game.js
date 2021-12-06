const db = require('../services/db');

class Game {
    constructor() {
    }

    async getGamesList(){
        var sql = `SELECT * FROM games`;
        const games =  await db.query(sql);
        return games;
    }
    
}

module.exports = {
    Game
}