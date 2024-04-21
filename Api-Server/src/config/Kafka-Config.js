const { Kafka } = require("kafkajs");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const {
    KAFKA_USERNAME,
    KAFKA_BROKERS,
    KAFKA_CLIENT_ID,
    KAFKA_GROUP_ID,
    KAFKA_PASSWORD,
    KAFKA_TOPICS,
} = require("./ServerConfig");
const { clickHouseClient } = require("./ClickHouseConfig");

const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKERS],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, "../../kafka.pem"), "utf-8")],
    },
    sasl: {
        username: KAFKA_USERNAME,
        password: KAFKA_PASSWORD,
        mechanism: "plain",
    },
});

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

async function initKafkaConsumer() {
    await consumer.connect();
    await consumer.subscribe({
        topics: [KAFKA_TOPICS],
        fromBeginning: true,
    });
    await consumer.run({
        autoCommit: false,
        eachBatch: async function ({
            batch,
            heartbeat,
            commitOffsetsIfNecessary,
            resolveOffset,
        }) {
            const messages = batch.messages;
            console.log(`Recevied ${messages.length} messages..`);
            for (const message of messages) {
                if (!message.value) continue;
                const stringMessage = message.value.toString();
                const { PROJECT_ID, DEPLOYEMENT_ID, log } =
                    JSON.parse(stringMessage);
                console.log({ log, DEPLOYEMENT_ID });

                try {
                    const { query_id } = await clickHouseClient.insert({
                        table: "log_events",
                        values: [
                            {
                                event_id: uuidv4(),
                                deployment_id: DEPLOYEMENT_ID,
                                log,
                            },
                        ],
                        format: "JSONEachRow",
                    });
                    console.log("inserted", query_id);
                    resolveOffset(message.offset);
                    await commitOffsetsIfNecessary(message.offset);
                    await heartbeat();
                } catch (error) {
                    console.log("Error in kafka consumer", error);
                }
            }
        },
    });
}

module.exports = { initKafkaConsumer };
