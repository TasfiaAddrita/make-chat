const express = require("express");
const app = express();

// socket.io has to use http server
const server = require("http").Server(app);

// express view engine for handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({
  defaultLayout: null
}));
app.set("view engine", "handlebars");
app.use("/public", express.static("public"));

// socket.io
const io = require("socket.io")(server);
let onlineUsers = {};
let channels = {"general": []};

io.on("connection", (socket) => {
  // console.log("New user connected");
  require("./sockets/chat.js")(io, socket, onlineUsers, channels);
})

// ROUTES

app.get("/", (req, res) => {
  res.render("index.handlebars");
})

server.listen("3000", () => {
  console.log("Server listening on port 3000");
})