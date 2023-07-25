const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 9000;

app.use(express.static(__dirname + '/public'));

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});



const users = {};

io.on('connection', Socket => {
    Socket.on('new-user-joined',name => {
        // console.log(name);
        users[Socket.id] = name;
        Socket.broadcast.emit('user-joined', name);
    });

        Socket.on('send', message => {
            Socket.broadcast.emit('receive', { message: message, name: users[Socket.id] })
        });

        Socket.on('disconnect', message => {
          console.log('A user disconnected.');
          Socket.broadcast.emit('left',users[Socket.id]);
          delete users[Socket.id];
        });

        // Socket.on('disconnect', message=>{
        //   Socket.broadcast.emit('left',users[Socket.id]);
        //   delete users[Socket.id];
        // })
    })

// // Socket.io connection
// io.on('connection', (socket) => {
//   console.log('A user connected.');

//   // Handling new messages
//   socket.on('chat message', (message) => {
//     console.log('Received message:', message);
//     io.emit('chat message', message); // Broadcast the message to all connected clients
//   });

//   // Handling user disconnection

// });

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port localhost:${PORT}`);
});
