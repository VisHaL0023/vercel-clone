const ServerConfig = require("./ServerConfig");
const { initKafkaConsumer } = require("./Kafka-Config");
const { clickHouseClient } = require("./ClickHouseConfig");

module.exports = { ServerConfig, initKafkaConsumer, clickHouseClient };
