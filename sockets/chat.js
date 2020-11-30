module.exports = (io, socket, onlineUsers, channels) => {
  // listen for "new user" socket emits
  socket.on("new user", (username) => {
    // save username as key to access user's socket id
    onlineUsers[username] = socket.id;

    // save username to socket as well
    socket["username"] = username;

    console.log(`${username} has joined the chat!`);

    // send username to all clients currently connected
    io.emit("new user", username);
  });

  socket.on("new message", (data) => {
    let sender = data.sender;
    let message = data.message;
    channels[data.channel].push({
      sender: sender,
      message: message
    });
    // console.log(`${sender} sent this message ${message}`);
    // io.emit("new message", sender, message);
    io.to(data.channel).emit("new message", data);
  });

  socket.on("get online users", () => {
    // send over onlineUsers
    socket.emit("get online users", onlineUsers);
  });

  // socket.on("disconnect", () => {
  //   console.log(`${socket.username} has left the chat`);
  //   delete onlineUsers[socket.username];
  //   io.emit("user has left", onlineUsers);
  // });

  socket.on("logout", () => {
    delete onlineUsers[socket.username];
    io.emit("user has left", onlineUsers);
    socket.emit("redirect");
  });

  socket.on("new channel", (newChannel) => {
    console.log(newChannel)
    channels[newChannel] = [];
    socket.join(newChannel);
    io.emit("new channel", newChannel);
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

  socket.on("user changed channel", (newChannel) => {
    socket.join(newChannel);
    socket.emit("user changed channel", {
      channel: newChannel,
      messages: channels[newChannel]
    });
  });

}

// NOTES
// io.emit sends data to all clients on the connection.
// socket.emit sends data to the client that sent the original data to the server.