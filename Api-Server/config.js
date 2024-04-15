const dotenv = require("dotenv");

dotenv.config();

const CLUSTER = process.env.CLUSTER;
const TASK = process.env.TASK;
const SUBNETS = [
    process.env.SUBNETS_1,
    process.env.SUBNETS_2,
    process.env.SUBNETS_3,
];
const SECURITY_GROUP = [process.env.SECURITY_GROUP];

module.exports = { CLUSTER, TASK, SUBNETS, SECURITY_GROUP };
