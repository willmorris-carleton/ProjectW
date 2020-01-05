let socket = io.connect('https://174.116.36.175:8080');
console.log("Socket Created!")

function interact(str) {
    socket.emit('interact', str);
}

socket.on('image', (image) => {
    imageElem = document.getElementById('waitingImg');
    imageElem.src = `data:image/jpeg;base64,${image}`;
});

//TODO: Pass in username and password with each send