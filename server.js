const express = require("express");
const app = express();
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const fileUpload = require('express-fileupload')
const userRoute = require("./routes/users");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const path = require("path");
const cors = require('cors')
const config=require("config")
const io = require("socket.io")(5500, {
  cors: {
    origin: "http://localhost:3000",
  }
});

mongoose.connect(
  config.get("MONGO_URL"),
  { useNewUrlParser: true, useUnifiedTopology: true },
  () =>console.log("Connected to MongoDB")  
);
app.use(cors())
app.use(fileUpload({useTempFiles: true}))
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));


//upload to local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

//api upload local storage
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(config.get("PORT"), () => {
  console.log("server is running ...");
});

let users = [];
const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  
  
  socket.on("addUser", (userId) => {
    
    addUser(userId, socket.id);
    console.log("connected users",users)
    io.emit("getUsers", users);
  });


  socket.on("sendMessage", ({ senderId, receiverId, text,conversationId }) => {
    
    const user = getUser(receiverId);
    if(user)
    {
      io.to(user.socketId).emit("getMessage", {senderId,text,conversationId});
    }
   
  });


  socket.on("disconnect", () => {
    
    removeUser(socket.id);
    console.log("connected users",users)
    io.emit("getUsers", users);
  });
});