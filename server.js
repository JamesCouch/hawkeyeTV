
var express = require('express'),
    http = require('http'),
    Lame = require('lame'),
    Speaker = require('speaker'),
    Stream = require('stream'),
    stream = new Stream(),
    spotify = require('spotify-web'),
    search_spotify = require('spotify'),
    config = require("./config"),
    bcrypt = require("bcrypt"),
    sqlite = require("sqlite3"),
    _ = require("underscore"),
    exec = require('child_process').exec,


    app = express(),
    server = http.createServer(app).listen( process.env.PORT || config.port);

    // Initialize sqlite and create our db if it doesnt exist
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(__dirname+'/db/hawkeyetv.db');
var Twit = require('twit');

// search_spotify.search({ type: 'track', query: 'selfie' }, function(err, data) {
//     if ( err ) {
//         console.log('Error occurred: ' + err);
//         return;
//     }
//     uri = data.tracks[0].href;
//     console.log(data.tracks[0].href);
// });


//     spotify.login( config.spotify_name, config.spotify_pass, function (err, spotify) {
//       if (err) throw err;
//       // first get a "Track" instance from the track URI
//       spotify.get(uri, function (err, track) {
//         if (err) throw err;
//         console.log('Playing: %s - %s', track.artist[0].name, track.name);

//         // play() returns a readable stream of MP3 audio data
//         stream = track.play();
//         stream.on('readable', function() {
//             console.log('GOT STREAM');
//         });
//         stream
//           .pipe(new Lame.Decoder())
//           .pipe(new Speaker())
//           .on('finish', function () {
//             spotify.disconnect();
//           });
//       });
//     });

var io = require('socket.io').listen(server);
var views = ['chrome','youtube','settings', 'music', 'facebook', 'twitter', 'news', 'home'];
var ss;

var passport = require('passport')
    , TwitterStrategy = require('passport-twitter').Strategy
    , FacebookStrategy = require('passport-facebook').Strategy;

    passport.use(new TwitterStrategy({
        consumerKey: 'hLYcPQ1m09bo29iTDDBeQ',
        consumerSecret: 'vwyZeWxp8FKxzsWyIQsgWscHL9gO5Z9t5uDiAflCXk',
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
    clientID: '586126158139160',
    clientSecret: '3dbf359ef5d004110e857fe507df148d',
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

    socket.on("on-click-twitter", function(data) {

        console.log("clicked!");


        // we need to check if they have a token and token secret
        //if they do have those,  we create an object out of it. We should do this on server start
        //When the user clicks on the twitter button, and there is no object, we redirect them to login
        //if there is an object, we send them data. 


        db.get("SELECT * FROM profiles WHERE id = ?", [ "1" ], function(err, user){

            console.log("tw-token");
            console.log(user.tw_token);

            var token = user.tw_token;
            var secret = user.tw_secret;

            if(token === null){
                 ss.emit('twitter-login');

            }
            else{

                var T = new Twit({
                    consumer_key:         'hLYcPQ1m09bo29iTDDBeQ'
                  , consumer_secret:      'vwyZeWxp8FKxzsWyIQsgWscHL9gO5Z9t5uDiAflCXk'
                  , access_token:         token
                  , access_token_secret:  secret
                })

                T.get('statuses/home_timeline', { screen_name: 'jam_cooch' },  function (err, reply) {
                       console.log("reply is: ", err);
                       // ss.emit('sent-twitter-feed', reply);
                });

                ss.emit('render-twitter');


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

app.post("/api/auth/search", function(){

});

app.post("/api/auth/play", function(){
    spotify.login("3lauqsap", "Spotify.pdagosti!", function (err, spotify) {
      if (err) throw err;
      // first get a "Track" instance from the track URI
      spotify.get(uri, function (err, track) {
        if (err) throw err;
        console.log('Playing: %s - %s', track.artist[0].name, track.name);

        // play() returns a readable stream of MP3 audio data
        track.play()
          .pipe(new lame.Decoder())
          .pipe(new Speaker())
          .on('finish', function () {
            spotify.disconnect();
          });
      });
    });
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
