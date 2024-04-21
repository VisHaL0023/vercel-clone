const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const NODE_MAILER_EMAIL = process.env.NODE_MAILER_EMAIL;
const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_REGION = process.env.S3_REGION;
const BUCKET_NAME = process.env.BUCKET_NAME;
const CONTAINER_IMAGE = process.env.CONTAINER_IMAGE;
const CLUSTER = process.env.CLUSTER;
const TASK = process.env.TASK;
const SUBNETS = [
    process.env.SUBNETS_1,
    process.env.SUBNETS_2,
    process.env.SUBNETS_3,
];
const SECURITY_GROUP = [process.env.SECURITY_GROUP];
const CLICKHOUSE_HOST = process.env.CLICKHOUSE_HOST;
const CLICKHOUSE_USERNAME = process.env.CLICKHOUSE_USERNAME;
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD;

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_BROKERS = process.env.KAFKA_BROKERS;
const KAFKA_USERNAME = process.env.KAFKA_USERNAME;
const KAFKA_PASSWORD = process.env.KAFKA_PASSWORD;
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;
const KAFKA_TOPICS = process.env.KAFKA_TOPICS;

module.exports = {
    PORT,
    JWT_SECRET_KEY,
    NODE_MAILER_EMAIL,
    NODE_MAILER_PASSWORD,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_REGION,
    BUCKET_NAME,
    CONTAINER_IMAGE,
    CLUSTER,
    TASK,
    SUBNETS,
    SECURITY_GROUP,
    CLICKHOUSE_HOST,
    CLICKHOUSE_USERNAME,
    CLICKHOUSE_PASSWORD,
    KAFKA_CLIENT_ID,
    KAFKA_BROKERS,
    KAFKA_USERNAME,
    KAFKA_PASSWORD,
    KAFKA_GROUP_ID,
    KAFKA_TOPICS,
};
