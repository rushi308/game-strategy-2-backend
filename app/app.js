
// Import express.js
const express = require("express");
const { Post } = require("./models/post");
const { Game } = require("./models/game");
const { User } = require("./models/user");
const path = require('path')
// Create express app
var app = express();
app.use(session({
    secret: 'gamestrategyroehampton',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
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
        res.render("index", { posts });
    } else {
        res.send('Please login to view this page!');
    }
    res.end();
});

app.get("/game", async function (req, res) {
    if (req.session.uid) {
        var game = new Game();
        const games = await game.getGamesList();
        res.render("game.pug", { games });
    } else {
        res.send('Please login to view this page!');
    }
});
app.get("/home", function (req, res) {
    if (req.session.uid) {
        res.render("index.pug");
    } else {
        res.send('Please login to view this page!');
    }
});
app.get("/profile", function (req, res) {
    if (req.session.uid) {
        res.render("profile.pug");
    } else {
        res.send('Please login to view this page!');
    }
});
app.get("/createPost", function(req, res) {
    res.render("createPost.pug");
});

// Register
app.get('/register', function (req, res) {
    res.render('register');
});

// Login
app.get('/login', function (req, res) {
    res.render('login');
});

app.get("/forgotpwd", function(req, res) {
    res.render("forgotpwd.pug");
});

app.post('/auth_reg', function (req, res) {
    params = req.body;
    var user = new User(params.email);
    var uname = params.uname
    var email = params.email
    var fname = params.fname
    var lname = params.lname
    var mno = params.mno
    var password = params.password
    try {
        user.getIdFromEmail().then( uId => {
            if(uId) {
                 // If a valid, existing user is found, set the password and redirect to the users single-student page
                user.setUserPassword(params.password).then ( result => {
                    res.redirect('/login');
                });
            }
            else {
                // If no existing user is found, add a new one
                user.addUser(params.email).then( Promise => {
                    res.send('Perhaps a page where a new user sets a programme would be good here');
                });
            }
        })
     } catch (err) {
         console.error(`Error while adding password `, err.message);
     }
});

app.post('/authenticate', function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        user.getIdFromEmail().then(uId => {
            if (uId) {
                user.authenticate(params.password).then(match => {
                    if (match) {
                        res.redirect('/home');
                    }
                    else {
                        // TODO improve the user journey here
                        res.send('invalid password');
                    }
                });
            }
            else {
                res.send('invalid email');
            }
        })
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Create a route for testing the db
app.get("/db_test", function (req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from games';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function (req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function (req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Start server on port 3000
app.listen(3000, function () {
    console.log(`Server running at http://127.0.0.1:3000`);
});