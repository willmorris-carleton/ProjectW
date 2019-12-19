const express = require('express');
let app = express();

app.use(express.static('public'));

app.post('/login', express.json(), auth);

app.listen(3000);
console.log("Listening on port 3000")

function auth(req,res,next) {
    let infoGiven = req.body;
    console.log(infoGiven);
    if (infoGiven.user == "win" && infoGiven.pass == "ston") {
        res.status(200).send();
    }
    else {
        res.status(401).send();
    }
}