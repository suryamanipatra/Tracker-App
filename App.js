const express = require('express');
const app = express();
const path = require("path");
const http = require('http');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket) {
    console.log("New user connected");

    socket.on('send-location', function(location) {
        console.log('Location received:', location);
        // Emit the location to all connected clients (including the sender)
        io.emit('received-location', { ...location, id: socket.id });
    });
    socket.on("disconnect",function(){
        io.emit("user-disconnected",socket.id)
    })
});

app.get("/", function(req, res) {
    res.render("index");
});

server.listen(3000, function() {
    console.log('Server is running on http://localhost:3000');
});
