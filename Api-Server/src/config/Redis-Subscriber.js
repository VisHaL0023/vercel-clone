const Redis = require("ioredis");
const ServerConfig = require("./ServerConfig");

const subscriber = new Redis(ServerConfig.REDIS_KEY);

async function initRedisSubscribe() {
    console.log("Subscribed to logs....");
    subscriber.psubscribe("logs:*");
    subscriber.on("pmessage", (pattern, channel, message) => {
        io.to(channel).emit("message", message);
    });
}

module.exports = { initRedisSubscribe };
