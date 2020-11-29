module.exports = (io, socket) => {
  // listen for "new user" socket emits
  socket.on("new user", (username) => {
    console.log(`${username} has joined the chat!`);

    // send username to all clients currently connected
    io.emit("new user", username);
  });

}

// NOTES
// io.emit sends data to all clients on the connection.
// socket.emit sends data to the client that sent the original data to the server.