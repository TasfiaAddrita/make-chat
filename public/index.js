$(document).ready( () => {
  // connect to socket.io server
  const socket = io.connect();

  // keep track of current user
  let currentUser;

  // get online users
  socket.emit("get online users");

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
    let channel = $(".channel-current").text();
    let message = $("#chat-input").val();
    socket.emit("new message", {
      sender: currentUser, 
      message: message,
      channel: channel
    });
    $("#chat-input").val("");
  });

  $("#logout-btn").click((e) => {
    e.preventDefault();
    socket.emit("logout");
  });

  $("#new-channel-btn").click(() => {
    let newChannel = $("#new-channel-input").val();

    if (newChannel.length > 0) {
      socket.emit("new channel", newChannel);
      $("#new-channel-input").val("");
    }
  })

  // SOCKET LISTENERS

  socket.on("new user", (username) => {
    console.log(`${username} has joined the chat!`);
    // add new user to online users div
    $(".users-online").append(`<div class="user-online">${username}</div>`);
  });

  socket.on("new message", (data) => {
    // add new message to message container div
    let currentChannel = $(".channel-current").text();
    if (currentChannel == data.channel) {
      $(".message-container").append(
        `
        <div class="message">
          <div class="message-user">${data.sender}</div>
          <div class="message-text">${data.message}</div>
        </div>
      `
      );
    }
  });

  socket.on("get online users", (onlineUsers) => {
    for (username in onlineUsers) {
      $(".users-online").append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on("user has left", (onlineUsers) => {
    $(".users-online").empty();
    for (username in onlineUsers) {
      $(".users-online").append(`<div class="user-online">${username}</div>`);
    }
  });

  socket.on("redirect", () => {
    window.location.href = "/";
  });

  socket.on("new channel", (newChannel) => {
    $(".channels").append(`<div class="channel">${newChannel}</div>`);
  });

  socket.on("user changed channel", (data) => {
    $(".channel-current").addClass("channel");
    $(".channel-current").removeClass("channel-current");
    $(`.channel:contains('${data.channel}')`).addClass("channel-current");
    $(".channel-current").removeClass("channel");
    $(".message").remove();
    data.messages.forEach((message) => {
      $(".message-container").append(
        `
          <div class="message">
            <p class="message-user">${message.sender}: </p>
            <p class="message-text">${message.message}</p>
          </div>
        `
      );
    });
  });

});