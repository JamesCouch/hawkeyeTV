
var express = require('express'),
    http = require('http'),

    config = require("./config"),
    bcrypt = require("bcrypt"),
    sqlite = require("sqlite3"),
    _ = require("underscore"),
    exec = require('child_process').exec,


    app = express(),
    server = http.createServer(app).listen( process.env.PORT || config.port);

    var passport = require('passport')
        , TwitterStrategy = require('passport-twitter').Strategy;

        passport.use(new TwitterStrategy({
            consumerKey: 'hLYcPQ1m09bo29iTDDBeQ',
            consumerSecret: 'vwyZeWxp8FKxzsWyIQsgWscHL9gO5Z9t5uDiAflCXk',
            callbackURL: "twitter/callback"
        },
        function(token, tokenSecret, profile, done) {
            console.log("token: ",token);
            console.log("tokenSecret: ",tokenSecret);
            done(null);
        }
    ));

// Initialize sqlite and create our db if it doesnt exist
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(__dirname+'/db/hawkeyetv.db');

 var io = require('socket.io').listen(server);
 var views = ['chrome','youtube','settings'];
 var ss;

 //Socket.io Server
 io.set('log level', 1);
 io.sockets.on('connection', function (socket) {
    
    socket.on("screen", function(data) {
        socket.type = "screen";
        ss = socket;
        console.log("Screen ready...");
    });

    socket.on("remote", function(data) {
        socket.type = "remote";
        console.log("Remote ready...");
    });

    socket.on("control", function(data) {
        if (views.indexOf(data.action) > -1) {
            console.log("Render: ", data.action );
            ss.emit('controlling', data.action);
        }
    });

    socket.on("refresh", function(data) {
        ss.emit('refresh-control', data);
    });

    socket.on("modal-control", function(data) {
        console.log("modal action: ",data.action);
        console.log("modal data: ",data.data);
        ss.emit('search-bar-control', data);
    });

    socket.on("swipe", function(data) {
        console.log("direction: ",data.direction);
        console.log("distance: ",data.distance);
        ss.emit('swipe-control', data);
    });

    socket.on("play-youtube", function(data) {
        console.log("Video ID: ",data.id);
        ss.emit('youtube-control', data);
    });

    socket.on("toggle-youtube", function(data) {
        ss.emit('youtube-toggle-control', data);
    });


 });

// Create our profiles table if it doesn't exist
db.run("CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY, zipcode TEXT, facebook TEXT, twitter TEXT, news TEXT, theme TEXT)");

// Allow node to be run with proxy passing
app.enable('trust proxy');

// Logging config
app.configure('local', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.configure('production', function(){
    app.use(express.errorHandler());
});


// Compression (gzip)
app.use( express.compress() );
app.use( express.methodOverride() );
app.use( express.bodyParser() );            // Needed to parse POST data sent as JSON payload


// Cookie config
app.use( express.cookieParser( config.cookieSecret ) );           // populates req.signedCookies
app.use( express.cookieSession( config.sessionSecret ) );         // populates req.session, needed for CSRF

// We need serverside view templating to initially set the CSRF token in the <head> metadata
// Otherwise, the html could just be served statically from the public directory
app.set('view engine', 'html');
app.set('views', __dirname + '/views' );
app.engine('html', require('hbs').__express);


app.use(express.static(__dirname+'/public'));

app.use( app.router );

app.get("/", function(req, res){
    res.render('index');
});

db.serialize(function(){
    db.get("SELECT * FROM profiles WHERE id = ?", [ "1" ], function(err, profile){
        if(profile){
            console.log("DB has first record");  
        } else {  
            db.run("INSERT INTO profiles (zipcode, facebook, twitter, news, theme) VALUES (?,?,?,?,?)", 
                [ "52242", "Disabled", "Disabled", "Disabled", "Default"], function(err){ 
                if(err){
                    console.log(err);
                }
            });
        }
    });
});

app.post("/api/auth/open", function(req, res){
    db.get("SELECT * FROM profiles WHERE id = ?", [ req.body.id ], function(err, profile){
    if(profile){
        res.json({ profile: profile });   
    } else {  
        res.json({ error: "Default profile" });   
    }
    });
});

app.post("/api/auth/update", function(req, res){
    db.serialize(function(){
        db.run("UPDATE profiles SET zipcode = ?, facebook = ?, twitter = ?, news = ?, theme = ? WHERE id = ?", 
            [ req.body.zipcode, req.body.facebook, req.body.twitter, req.body.news, req.body.theme, req.body.id ], function(err){
            if(err) {
                console.log("Updating the user failed");
            } else {
                db.get("SELECT * FROM profiles WHERE id = ?", [ req.body.id ], function(err, profile){
                    if(profile){
                        res.json({ profile: profile });   
                    } else {  
                        res.json({ error: "Default profile" });   
                    }
                });
            }
        });
    });
});

app.get('/auth/twitter', passport.authenticate('twitter'));


app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));



// Close the db connection on process exit 
// (should already happen, but to be safe)
process.on("exit", function(){
    db.close();
});

console.log("STARTUP:: Express server listening on port::", server.address().port, ", environment:: ", app.settings.env);
