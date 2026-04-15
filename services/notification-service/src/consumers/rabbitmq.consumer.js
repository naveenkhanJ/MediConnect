import amqp from "amqplib";
import env from "../config/env.js";
import {
  notifyAppointmentBooked,
  notifyConsultationCompleted,
} from "../services/notification.service.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function handleEvent(routingKey, payload) {
  if (routingKey === "appointment.booked") {
    await notifyAppointmentBooked(payload);
    return;
  }
  if (routingKey === "consultation.completed") {
    await notifyConsultationCompleted(payload);
    return;
  }
  // ignore unknown events
}

export async function startRabbitConsumer({ logger = console } = {}) {
  if (!env.rabbitmqUrl) {
    logger.log("RabbitMQ disabled (RABBITMQ_URL not set)");
    return { enabled: false };
  }

  let attempt = 0;
  while (true) {
    attempt += 1;
    try {
      const conn = await amqp.connect(env.rabbitmqUrl);
      conn.on("error", (e) => logger.error("RabbitMQ connection error:", e.message));
      conn.on("close", () => logger.warn("RabbitMQ connection closed"));

      const ch = await conn.createChannel();
      await ch.assertExchange(env.rabbitmqExchange, "topic", { durable: true });
      await ch.assertQueue(env.rabbitmqQueue, { durable: true });

      await ch.bindQueue(env.rabbitmqQueue, env.rabbitmqExchange, "appointment.*");
      await ch.bindQueue(env.rabbitmqQueue, env.rabbitmqExchange, "consultation.*");

      ch.prefetch(env.rabbitmqPrefetch);

      logger.log(
        `RabbitMQ consumer started (exchange=${env.rabbitmqExchange}, queue=${env.rabbitmqQueue})`
      );

      await ch.consume(
        env.rabbitmqQueue,
        async (msg) => {
          if (!msg) return;
          const routingKey = msg.fields.routingKey;
          try {
            const raw = msg.content.toString("utf8");
            const payload = raw ? JSON.parse(raw) : {};
            await handleEvent(routingKey, payload);
            ch.ack(msg);
          } catch (e) {
            logger.error("RabbitMQ message failed:", e.message);
            // Don't poison the queue forever; drop after failure.
            ch.nack(msg, false, false);
          }
        },
        { noAck: false }
      );

      return { enabled: true, connection: conn, channel: ch };
    } catch (e) {
      const wait = Math.min(15000, 500 * attempt);
      logger.warn(`RabbitMQ connect failed (attempt=${attempt}): ${e.message}; retry in ${wait}ms`);
      await sleep(wait);
    }
  }
}

