const express = require("express");
const { RedisConfig, ServerConfig } = require("./config/index");
const apiRoutes = require("./routes/index");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRoutes);

const io = new Server({ cors: "*" });

io.on("connection", (socket) => {
    socket.on("subscribe", (channel) => {
        socket.join(channel);
        socket.emit("message", `Joined ${channel}`);
    });
});

io.listen(ServerConfig.SCOKET_PORT, () =>
    console.log(`Socket server ${ServerConfig.SCOKET_PORT}..`)
);

RedisConfig.initRedisSubscribe();

app.listen(ServerConfig.PORT, () =>
    console.log(`API server Running..${ServerConfig.PORT}`)
);
