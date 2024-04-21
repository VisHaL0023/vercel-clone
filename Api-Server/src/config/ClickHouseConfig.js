const { createClient } = require("@clickhouse/client");
const {
    CLICKHOUSE_HOST,
    CLICKHOUSE_PASSWORD,
    CLICKHOUSE_USERNAME,
} = require("./ServerConfig");

const clickHouseClient = createClient({
    host: CLICKHOUSE_HOST,
    database: "default",
    username: CLICKHOUSE_USERNAME,
    password: CLICKHOUSE_PASSWORD,
});

module.exports = { clickHouseClient };
