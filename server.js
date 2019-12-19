//Constants and requires
const S_USER = "win";
const S_PASS = "ston";
const express = require('express');
const session = require('express-session');
let app = express();

//Once user connects, a session is created
app.use(session({ secret: 'winniep'}));

//Serve up files
app.use(express.static('public'));
app.get('/', getIndex);
app.post('/login', express.json(), auth, getStream);
app.get('/stream', auth, getStream);
app.get('/stream.js', auth, getStreamJS);

app.listen(3000);
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