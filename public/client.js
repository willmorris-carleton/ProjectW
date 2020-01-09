const domain = 'localhost'; //CHANGE DOMAIN HERE
//When user tries to log in from html page
function login() {
    //Get username and password entered
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;
    console.log(`User: ${user} Pass: ${pass}`);

    //Create the request
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        //If the login was successful access the stream. NOTE: Just changing url to /stream will not work without being logged in
        if (this.readyState == 4 && this.status == 200) {
            window.location.replace("https://"+domain+":8080/stream");
        }
        //If error or wrong password
        else if (this.readyState == 4 && this.status != 200){
            console.log("Error, probably wrong info given")
        }
    }
    //Open and Send the request
    req.open("POST", '/login');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({user: user, pass: pass}));
}
