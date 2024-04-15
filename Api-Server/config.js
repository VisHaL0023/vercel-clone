const CLUSTER = process.env.CLUSTER;
const TASK = process.env.TASK;
const SUBNETS = [process.env.SUBNETS];
const SECURITY_GROUP = [process.env.SECURITY_GROUP];

module.exports = { CLUSTER, TASK, SUBNETS, SECURITY_GROUP };
