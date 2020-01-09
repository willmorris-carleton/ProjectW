//Constants and requires
const S_USER = "win"; //INSERT YOURN USERNAME HERE
const S_PASS = "ston"; //INSERT YOUR PASSWORD HERE
const domain = 'https://localhost'; // INSERT YOUR DOMAIN HERE
const express = require('express');
const session = require('express-session');
const fs = require('fs'); 
const player = require('play-sound')()

//Setup server
let app = express();
var server = require('https').createServer({key: fs.readFileSync('private/server.key'),cert: fs.readFileSync('private/server.cert')}, app);
var io = require('socket.io')(server);


//Once user connects, a session is created
app.use(session({ secret: 'winniep'}));

//Serve up files based off of request
app.use(express.static('public'));
app.get('/', getIndex);
app.get('//', getIndex);
app.post('/login', express.json(), auth, getStream);
app.get('/stream', auth, getStream);
app.get('/stream.js', auth, getStreamJS);

//Listen on port 8080
server.listen(8080);
console.log("Listening on " + domain + ":8080");

//Middle function to determine if user is authorized to watch stream
function auth(req,res,next) {
    //If sessions says user is already logged in, allow access
    if (req.session.loggedin && req.session.user == S_USER && req.session.pass == S_PASS) {
        next();
        return;
    }
    else if (req.session.loggedin && (req.session.user != S_USER || req.session.pass != S_PASS)) {
        res.status(401).send("Session no longer valid, please log in again at home page");
        return;
    }
    //Otherwise this may be new log in
    if (!req.body) {
        res.status(401).send("Not logged in...");
        return;
    }
    //Get info from request
    let infoGiven = req.body;
    console.log(infoGiven);
    if (infoGiven.user == S_USER && infoGiven.pass == S_PASS) {
        //Update session to credentials
        req.session.loggedin = true;
        req.session.user = infoGiven.user;
        req.session.pass = infoGiven.pass;
        //Send all clear for client to know they can access stuff
        res.status(200).send();
        return;
    }
    //Credentials given were not true or not there
    else {
        res.status(401).send();
        return;
    }
}

//To return stream
function getStream(req, res) {
    res.type("html")
    res.status(200).sendFile(__dirname + "/private/stream.html");
}

//To return stream js
function getStreamJS(req, res) {
    res.type("js");
    res.status(200).sendFile(__dirname + "/private/stream.js");
}

//When getting index page determine if logged in or not
function getIndex(req,res) {
    if (req.session.loggedin) {
        res.type("html");
        res.status(200).sendFile(__dirname + "/private/loggedin.html");
        return;
    }
    else {
        res.type("html");
        res.status(200).sendFile(__dirname + "/index.html");
        return;
    }

}

//To stream photos from server webcam
const cv = require('opencv4nodejs');
const fps = 15;
let wCap = null;
let connected = 0;
let streaming = null;
function streamImg() {
    const frame = wCap.read();
	const image = cv.imencode('.jpg', frame).toString('base64');
	io.emit('image', image);
}

//When a socket connects
io.on('connection', socket =>{
    logConnection();
    connected++;
    if (!streaming) {
        streaming = setInterval(streamImg, 1000/fps);
        wCap = new cv.VideoCapture(0);
    }
    socket.on('interact', function(str) {
        playSound(str);
    });
    socket.on('disconnect', function() {
        console.log("Someone disconnected");
        connected--;
        //If no one is watching anymore then stop streaming
        if (connected == 0) {
            //Clear interval loop which is streaming photos
            clearInterval(streaming);
            streaming = null;
            console.log("Stopped Streaming as no one is watching.")
            //Turn off webcam
            wCap.release();
            OPENCV_VIDEOIO_PRIORITY_MSMF = 0;
            delete wCap;
        }
    })
});

//To play sounds from server computer
function playSound(sound) {
    console.log("Recieved "+sound);
    switch(sound) {
        case "Hello!":
            player.play('private/hello.mp3', function(err){ // You can change the audio to whatever you want here!
                if (err) throw err
            });
            break;
        case "I love you!":
            player.play('private/loveyou.wav', function(err){ // You can change the audio to whatever you want here!
                if (err) throw err
            });
            break;
        case "Treat!":
            player.play('private/loveyou.wav', function(err){ // You can change the audio to whatever you want here!
                if (err) throw err
            });
            break;
    }
}

//To log all people who have viewed the stream to a text file (will appear under private folder)
function logConnection() {
    let date = new Date();
    let log = `Someone connected at ${date.toLocaleTimeString()} on ${date.toLocaleDateString()}`;
    console.log(log);
    fs.appendFile('private/connectionlog.txt', log+'\n', function(err) {
        if (err) throw err;
    });
}
