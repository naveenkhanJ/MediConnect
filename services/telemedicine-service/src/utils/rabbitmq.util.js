import amqp from "amqplib";
import env from "../config/env.js";
import { getLogger } from "./logger.util.js";

const logger = getLogger("rabbitmq");

let connection = null;
let channel = null;
let connectingPromise = null;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function getRabbitChannel() {
  if (channel) return channel;
  if (connectingPromise) return connectingPromise;

  connectingPromise = (async () => {
    const url = env.rabbitmqUrl;
    if (!url) throw new Error("RABBITMQ_URL is not configured");

    let attempt = 0;
    while (true) {
      attempt += 1;
      try {
        connection = await amqp.connect(url);
        connection.on("error", (e) => logger.error("Connection error:", e.message));
        connection.on("close", () => {
          logger.warn("Connection closed; will reconnect on next publish");
          connection = null;
          channel = null;
        });

        channel = await connection.createChannel();

        await channel.assertExchange(env.rabbitmqExchange, "topic", { durable: true });

        logger.info("Connected (exchange=%s)", env.rabbitmqExchange);
        return channel;
      } catch (e) {
        const wait = Math.min(15000, 500 * attempt);
        logger.warn("Connect failed (attempt=%s): %s; retrying in %sms", attempt, e.message, wait);
        await sleep(wait);
      }
    }
  })();

  try {
    return await connectingPromise;
  } finally {
    connectingPromise = null;
  }
}

export async function publishEvent(routingKey, payload) {
  const ch = await getRabbitChannel();
  const body = Buffer.from(JSON.stringify(payload));

  const ok = ch.publish(env.rabbitmqExchange, routingKey, body, {
    contentType: "application/json",
    persistent: true,
  });

  return ok;
}

