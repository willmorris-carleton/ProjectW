let socket = io.connect('http://localhost:3000');
console.log("Socket Created!")

function interact(str) {
    socket.emit('interact', str);
}