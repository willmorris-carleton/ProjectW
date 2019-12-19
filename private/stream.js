let socket = io.connect('http://localhost:3000');
console.log("Socket Created!")

function interact(str) {
    socket.emit('interact', str);
}

socket.on('image', (image) => {
    imageElem = document.getElementById('waitingImg');
    imageElem.src = `data:image/jpeg;base64,${image}`;
});

//TODO: Pass in username and password with each send