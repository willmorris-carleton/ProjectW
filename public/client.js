function login() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;
    console.log(`User: ${user} Pass: ${pass}`);

    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("That is the correct username and password!")
        }
        else if (this.readyState == 4 && this.status != 200){
            console.log("Error, probably wrong info given")
        }
    }
    req.open("POST", '/login');
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({user: user, pass: pass}));
}