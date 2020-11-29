$(document).ready( () => {
  // connect to socket.io server
  const socket = io.connect();

  // keep track of current user
  let currentUser;

  $("#create-user-btn").click((e) => {
    e.preventDefault();
    currentUser = $("#username-input").val();
    if (currentUser.length > 0) {
      // emit new user to server
      socket.emit("new user", currentUser);
      $(".username-form").remove();

      // have main page visible
      $(".main-container").css("display", "flex");
    }
  });

  $("#send-chat-btn").click((e) => {
    e.preventDefault();
    let message = $("#chat-input").val();
    socket.emit("new message", {sender: currentUser, message: message});
    $("#chat-input").val("");
  })

  // socket listeners
  socket.on("new user", (username) => {
    console.log(`${username} has joined the chat!`);
    // add new user to online users div
    $(".users-online").append(`<div class="user-online">${username}</div>`);
  });

  socket.on("new message", (sender, message) => {
    // add new message to message container div
    $(".message-container").append(
      `
        <div class="message">
          <div class="message-user">${sender}</div>
          <div class="message-text">${message}</div>
        </div>
      `
    );
  });

});