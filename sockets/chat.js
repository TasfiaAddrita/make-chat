module.exports = (io, socket) => {
  // listen for "new user" socket emits
  socket.on("new user", (username) => {
    console.log(`${username} has joined the chat!`);
    // send username to all clients currently connected
    io.emit("new user", username);
  });

  socket.on("new message", (data) => {
    let sender = data.sender;
    let message = data.message;
    console.log(`${sender} sent this message ${message}`);
    io.emit("new message", sender, message);
  })

}

// NOTES
// io.emit sends data to all clients on the connection.
// socket.emit sends data to the client that sent the original data to the server.