$(document).ready( () => {
  // connect to socket.io server
  const socket = io.connect();

  $("#create-user-btn").click( (e) => {
    e.preventDefault();
    let username = $("#username-input").val();
    if (username.length > 0) {
      // emit new user to server
      socket.emit("new user", username);
      $(".username-form").remove();
    }
  });

  // socket listeners
  socket.on("new user", (username) => {
    console.log(`${username} has joined the chat!`);
  });
  
});