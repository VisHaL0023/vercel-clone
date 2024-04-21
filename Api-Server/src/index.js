const express = require("express");
const { ServerConfig, initKafkaConsumer } = require("./config/index");
const apiRoutes = require("./routes/index");
const cors = require("cors");

const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiRoutes);

initKafkaConsumer();

app.listen(ServerConfig.PORT, () =>
    console.log(`API server Running..${ServerConfig.PORT}`)
);
