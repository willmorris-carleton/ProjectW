//Setup socket
let socket = io.connect('https://localhost:8080');
console.log("Socket Created!")

//Send string through socket to notify which sound to play
function interact(str) {
    socket.emit('interact', str);
}

//To recieve stream of images from server socket
socket.on('image', (image) => {
    //Display image to client through HTML
    imageElem = document.getElementById('waitingImg');
    imageElem.src = `data:image/jpeg;base64,${image}`;
});
