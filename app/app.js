
// Import express.js
const express = require("express");
const { Post } = require("./models/post");
const { Game } = require("./models/game");
const { User } = require("./models/user");
const { Like } = require("./models/like");
const { Comment } = require("./models/comment");
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path')
// Create express app
var app = express();
app.use(session({
    secret: 'gamestrategyroehampton',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 30 * 24 * 60 * 60 * 1000 }
}));
app.use(bodyParser.urlencoded({ extended: false }))

// Add static files location
app.use(express.static("static"));
app.locals.moment = require('moment');

// Get the functions in the db.js file to use
const db = require('./services/db');

app.use('/views', express.static(path.resolve(__dirname, './views')))
app.set('view engine', 'pug');
app.set('views', './app/views');
// Create a route for root - /
app.get("/", async function (req, res) {
    if (req.session.uid) {
        var post = new Post();
        const posts = await post.getPosts();
        var user = new User();
        const userDetail = await user.getUserDetail(req.session.uid.id);
        res.render("index", { posts, userDetail });
    } else {
        res.render("requireLogin");
    }
});

app.get("/game", async function (req, res) {
    if (req.session.uid) {
        var game = new Game();
        const games = await game.getGamesList();
        var user = new User();
        const userDetail = await user.getUserDetail(req.session.uid.id);
        res.render("game.pug", { games, userDetail });
    } else {
        res.render("requireLogin.pug");
    }
});
app.get("/home", function (req, res) {
    if (req.session.uid) {
        res.render("index.pug");
    } else {
        res.render("requireLogin");
    }
});
app.get("/createPost", async function (req, res) {
    if (req.session.uid) {
        var game = new Game();
        const games = await game.getGamesList();
        var user = new User();
        const userDetail = await user.getUserDetail(req.session.uid.id);
        res.render("createPost.pug", { games, userDetail });
    } else {
        res.render("requireLogin");
    }
});
app.get("/updatePost/:id", async function (req, res) {
    if (req.session.uid) {
        var game = new Game();
        const games = await game.getGamesList();
        var user = new User();
        const userDetail = await user.getUserDetail(req.session.uid.id);
        var post = new Post();
        let postDetail = {}
        if(req.params.id !== 'bootstrap.min.css.map') {
            postDetail = await post.getPostDetail(req.params.id);
        }
        res.render("editPost.pug", { games, userDetail, postDetail });
    } else {
        res.render("requireLogin");
    }
});
app.post("/insertPost", async function (req, res) {
    if (req.session.uid) {
        params = req.body;
        var post = new Post();
        params.userId = req.session.uid.id;
        const postInsert = await post.insertPost(params);
        if (postInsert) {
            res.redirect('/');
        }
    } else {
        res.render("requireLogin");
    }
});

app.post("/editPost", async function (req, res) {
    if (req.session.uid) {
        params = req.body;
        var post = new Post();
        const postUpdated = await post.updatePost(params);
        if (postUpdated) {
            res.redirect('/');
        }
    } else {
        res.render("requireLogin");
    }
});

app.get("/profile", async function (req, res) {
    if (req.session.uid) {
        var userId = req.session.uid.id;
        const user = new User();
        const userDetail = await user.getUserDetail(userId);
        res.render("profile.pug", { userDetail });
    } else {
        res.render("requireLogin");
    }
});

app.post("/changeProfile", async function (req, res) {
    if (req.session.uid) {
        params = req.body;
        var user = new User();
        const profileInsert = await user.changeProfile(params, req.session.uid.id);
        if (profileInsert) {
            res.redirect('/');
        }
    } else {
        res.render("requireLogin");
    }
});

app.get("/login", function (req, res) {
    res.render("login.pug");
});

app.get("/register", function (req, res) {
    res.render("register.pug");
});
app.get("/forgotpwd", function (req, res) {
    res.render("forgotpwd.pug");
});

app.post('/signup', async function (req, res) {
    params = req.body;
    var user = new User();
    await user.addUser(params);
    res.render("register-success.pug");
});

app.post('/login', async function (req, res) {
    params = req.body;
    var user = new User();
    const data = await user.login(params);
    if (data.isAuthorized) {
        req.session.uid = data.user;
        req.session.loggedIn = true;
        res.redirect('/');
    } else {
        res.send('Email or password is incorrect');
    }
});

app.post("/like", async function (req, res) {
    if (req.session.uid) {
        params = req.body;
        var like = new Like();
        const liked = await like.hitLikeOnPost(params, req.session.uid.id);
        res.redirect('/');
    } else {
        res.send('Please login to view this page!');
    }
});

app.post("/comment", async function (req, res) {
    if (req.session.uid) {
        params = req.body;
        var comment = new Comment();
        await comment.commentOnPost(params, req.session.uid.id);
        res.redirect('/');
    } else {
        res.render("requireLogin");
    }
});

app.get("/gameByPost/:gameId", async function (req, res) {
    if (req.session.uid) {
        const gameId = req.params.gameId;
        var post = new Post();
        const posts = await post.getPostByGame(gameId);
        var user = new User();
        const userDetail = await user.getUserDetail(req.session.uid.id);
        res.render("gamePosts", { posts, userDetail });
    } else {
        res.render("requireLogin");
    }
});

// Logout
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000`);
});