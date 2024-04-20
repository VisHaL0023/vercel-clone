const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT;
const REDIS_KEY = process.env.REDIS_KEY;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const NODE_MAILER_EMAIL = process.env.NODE_MAILER_EMAIL;
const NODE_MAILER_PASSWORD = process.env.NODE_MAILER_PASSWORD;
const SCOKET_PORT = process.env.SCOKET_PORT;
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

module.exports = {
    PORT,
    REDIS_KEY,
    JWT_SECRET_KEY,
    NODE_MAILER_EMAIL,
    NODE_MAILER_PASSWORD,
    SCOKET_PORT,
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_REGION,
    BUCKET_NAME,
    CONTAINER_IMAGE,
    CLUSTER,
    TASK,
    SUBNETS,
    SECURITY_GROUP,
};
