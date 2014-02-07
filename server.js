
var express = require('express'),
    http = require('http'),

    config = require("./config"),
    bcrypt = require("bcrypt"),
    sqlite = require("sqlite3"),
    _ = require("underscore"),

    app = express(),
    server = http.createServer(app).listen( process.env.PORT || config.port);

// Initialize sqlite and create our db if it doesnt exist
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(__dirname+'/db/hawkeyetv.db');


 var io = require('socket.io').listen(server);
 io.set('log level', 1);

 //Socket.io Server
 io.sockets.on('connection', function (socket) {
    
    socket.on("screen", function(data){
        socket.type = "screen";
        ss = socket;
        console.log("Screen ready...");
    });
    socket.on("remote", function(data){
        socket.type = "remote";
        console.log("Remote ready...");
    });

    socket.on("control", function(data){
        console.log("Data: ",data);
        console.log("SS: ",ss.type);
        ss.emit('controlling',{action:"chrome"});
    });



 });

// Create our users table if it doesn't exist
//db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, username TEXT UNIQUE, password TEXT, auth_token TEXT UNIQUE)");


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
app.use(express.csrf());

app.use( app.router );

app.get("/", function(req, res){
    res.render('index', { csrfToken: req.csrfToken() });
});

// Close the db connection on process exit 
// (should already happen, but to be safe)
process.on("exit", function(){
    db.close();
});

console.log("STARTUP:: Express server listening on port::", server.address().port, ", environment:: ", app.settings.env);
