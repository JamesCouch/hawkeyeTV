
var express = require('express'),
    http = require('http'),
    bcrypt = require("bcrypt"),

    // Setup the audio stream decoder, system audio speaker,
    // and the passthrough stream for the audio passed from spotify
    Lame = require('lame'),
    lame = new Lame.Decoder(),
    Speaker = require('speaker'),
    spkr = new Speaker(),
    Stream = require('stream'),
    stream = new Stream(),

    // Initialize the spotify search engine and the spotify-web
    // interface that will pull track info and streams
    spotify = require('spotify-web'),
    search_spotify = require('spotify'),

    // Load the config file with app settings
    config = require("./config"),

     // Initialize sqlite and create our db if it doesnt exist
    sqlite = require("sqlite3"),
    sqlite3 = require("sqlite3").verbose(),
    db = new sqlite3.Database(__dirname+'/db/hawkeyetv.db'),

    // Other libs
    _ = require("underscore"),
    omx = require('omxcontrol'),
    exec = require('child_process').exec,
    Twit = require('twit'),

    app = express(),
    server = http.createServer(app).listen( process.env.PORT || config.port );

var io = require('socket.io').listen(server);
var views = ['chrome','youtube','settings', 'music', 'facebook', 'twitter', 'news', 'home'];
var ss;
var uri;
var playback = false;

var passport = require('passport')
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new TwitterStrategy({
        consumerKey: config.tw_consumerKey,
        consumerSecret: config.tw_consumerSecret,
        callbackURL: "twitter/callback"
    },
    function(token, tokenSecret, profile, done) {

        db.run("UPDATE profiles SET tw_token = ?, tw_secret =? WHERE id = ?", [ token, tokenSecret, "1" ], function(err){
            if(err) {
                console.log("Failed to load TW oauth token in the database");
            }
        });
        done(null);
    }
));

passport.use(new FacebookStrategy({
    clientID: config.fb_clientID,
    clientSecret: config.fb_clientSecret,
    callbackURL: "/auth/facebook/callback"
},
    function(accessToken, refreshToken, profile, done) {
        console.log("Facebook Token: ", accessToken);
        db.run("UPDATE profiles SET fb_token = ?, fb_refresh =? WHERE id = ?", [ accessToken, refreshToken, "1" ], function(err){
            if(err) {
                console.log("Failed to load FB oauth token in the database");
            }
        });
        done(null);
    }
));

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

    socket.on("play-youtube", function(data) {
        var url = "http://www.youtube.com/watch?v=" + data.id;

        exec('youtube ' + url,
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    });

    socket.on("on-click-twitter", function(data) {

        // we need to check if they have a token and token secret
        //if they do have those,  we create an object out of it. We should do this on server start
        //When the user clicks on the twitter button, and there is no object, we redirect them to login
        //if there is an object, we send them data.

        db.get("SELECT * FROM profiles WHERE id = ?", [ "1" ], function(err, user){
            if(user.tw_token === null){
                 ss.emit('twitter-login');
            }
            else{
                var T = new Twit({
                    consumer_key:         config.tw_consumerKey,
                    consumer_secret:      config.tw_consumerSecret,
                    access_token:         user.tw_token,
                    access_token_secret:  user.tw_secret
                });
                T.get('statuses/home_timeline', function (err, reply) {
                    if (err) {
                        console.log(err);
                    } else {
                        ss.emit('sent-twitter-feed', reply);
                    }
                });
             }
        });
    });

 });

// Create our profiles table if it doesn't exist
db.run("CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY, zipcode TEXT, news TEXT, theme TEXT, tw_token TEXT, tw_secret TEXT, fb_token TEXT, fb_refresh TEXT )");

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
//
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
            db.run("INSERT INTO profiles (zipcode, news, theme) VALUES (?,?,?)",
                [ "52242", "disabled", "default"], function(err){
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
        db.run("UPDATE profiles SET zipcode = ?, news = ?, theme = ? WHERE id = ?",
            [ req.body.zipcode, req.body.news, req.body.theme, req.body.id ], function(err){
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

app.post("/api/auth/search", function(req, res){
    search_spotify.search({ type: 'track', query: req.body.query }, function(err, data) {
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            res.json({ first: data.tracks[0], second: data.tracks[1], third: data.tracks[2],
            fourth: data.tracks[3], fifth: data.tracks[4] });
        }
    });
});

app.post("/api/auth/play", function(req, res){
    spotify.login(config.spotify_name, config.spotify_pass, function (err, spotify) {
      if (err) throw err;
      // first get a "Track" instance from the track URI
      spotify.get(req.body.uri, function (err, track) {
        if (err) throw err;
        playback = true;
        stream = track.play();
        spkr = new Speaker();
        stream
          .pipe(lame)
          .pipe(spkr);
      });
    });
});

app.post("/api/auth/pause", function(req, res){
  console.log("Pause");
    stream.unpipe(lame.unpipe(spkr.end()));
    stream.pause();
});

app.post("/api/auth/resume", function(req, res){
  console.log("Resume");
    spkr = new Speaker();
    stream
      .pipe(lame)
      .pipe(spkr);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                     failureRedirect: '/' }));


// Close the db connection on process exit
// (should already happen, but to be safe)
process.on("exit", function(){
    db.close();
});

console.log("STARTUP:: Express server listening on port::", server.address().port, ", environment:: ", app.settings.env);
