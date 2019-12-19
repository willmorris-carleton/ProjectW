//Constants and requires
const S_USER = "win";
const S_PASS = "ston";
const express = require('express');
const session = require('express-session');
let app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


//Once user connects, a session is created
app.use(session({ secret: 'winniep'}));

//Serve up files
app.use(express.static('public'));
app.get('/', getIndex);
app.post('/login', express.json(), auth, getStream);
app.get('/stream', auth, getStream);
app.get('/stream.js', auth, getStreamJS);

server.listen(3000);
console.log("Listening on port 3000")

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

function getStream(req, res) {
    res.type("html")
    res.status(200).sendFile(__dirname + "/private/stream.html");
}


function getStreamJS(req, res) {
    res.type("js");
    res.status(200).sendFile(__dirname + "/private/stream.js");
}

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
    console.log("Someone has connected");
    connected++;
    if (!streaming) {
        streaming = setInterval(streamImg, 1000/fps);
        wCap = new cv.VideoCapture(0);
    }
    socket.on('interact', function(str) {
        console.log("Recieved "+str);
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