import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// routes
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import UploadRoute from "./routes/UploadRoute.js";
import ChatRoute from "./routes/ChatRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import { Server } from "socket.io";
const io = new Server(8700);
const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use("/images", express.static("images"));

dotenv.config();
const PORT = 5000 || process.env.PORT;

const CONNECTION =
  "mongodb://127.0.0.1:27017/socialmedia" || process.env.MONGODB_CONNECTION;
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Listening at Port ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/posts", PostRoute);
app.use("/upload", UploadRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

// const io = require("socket.io")(8800, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);

    io.emit("get-users", activeUsers);
  });
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
});
