import type { MonorepoTemplateData } from '../../../../types';

export function generateRabbitMQClient(_data: MonorepoTemplateData): string {
  return `import amqplib from "amqplib";
import type { Connection, Channel, ConsumeMessage } from "amqplib";
import type {
  RabbitMQConfig,
  QueueConfig,
  ExchangeConfig,
  PublishOptions,
  ConsumeOptions,
  Message,
  MessageHandler,
  DeadLetterConfig,
} from "./types";

export class RabbitMQClient {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private config: RabbitMQConfig;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(config: RabbitMQConfig) {
    this.config = {
      prefetchCount: 10,
      reconnectInterval: 5000,
      ...config,
    };
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqplib.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      if (this.config.prefetchCount) {
        await this.channel.prefetch(this.config.prefetchCount);
      }

      this.handleConnectionError();

      console.log("[RabbitMQ] Connected successfully");
    } catch (error) {
      console.error("[RabbitMQ] Connection failed:", error);
      this.scheduleReconnect();
      throw error;
    }
  }

  private handleConnectionError(): void {
    if (!this.connection) return;

    this.connection.on("error", (error) => {
      console.error("[RabbitMQ] Connection error:", error);
      this.scheduleReconnect();
    });

    this.connection.on("close", () => {
      console.warn("[RabbitMQ] Connection closed");
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimeout) return;

    this.reconnectTimeout = setTimeout(async () => {
      this.reconnectTimeout = null;
      console.log("[RabbitMQ] Attempting to reconnect...");
      try {
        await this.connect();
      } catch {
        // connect() will schedule another reconnect on failure
      }
    }, this.config.reconnectInterval);
  }

  private ensureChannel(): Channel {
    if (!this.channel) {
      throw new Error("[RabbitMQ] Channel is not initialized. Call connect() first.");
    }
    return this.channel;
  }

  async assertExchange(config: ExchangeConfig): Promise<void> {
    const channel = this.ensureChannel();
    await channel.assertExchange(config.name, config.type, {
      durable: config.durable ?? true,
      autoDelete: config.autoDelete ?? false,
      arguments: config.arguments,
    });
  }

  async assertQueue(config: QueueConfig): Promise<void> {
    const channel = this.ensureChannel();

    const args: Record<string, unknown> = { ...config.arguments };

    if (config.deadLetterExchange) {
      args["x-dead-letter-exchange"] = config.deadLetterExchange;
    }
    if (config.deadLetterQueue) {
      args["x-dead-letter-routing-key"] = config.deadLetterQueue;
    }
    if (config.messageTtl) {
      args["x-message-ttl"] = config.messageTtl;
    }

    await channel.assertQueue(config.name, {
      durable: config.durable ?? true,
      exclusive: config.exclusive ?? false,
      autoDelete: config.autoDelete ?? false,
      arguments: args,
    });
  }

  async setupDeadLetterQueue(config: DeadLetterConfig): Promise<void> {
    await this.assertExchange({
      name: config.exchange,
      type: "direct",
      durable: true,
    });

    await this.assertQueue({
      name: config.queue,
      durable: true,
    });

    await this.bindQueue(config.queue, config.exchange, config.routingKey);
  }

  async bindQueue(queue: string, exchange: string, routingKey: string): Promise<void> {
    const channel = this.ensureChannel();
    await channel.bindQueue(queue, exchange, routingKey);
  }

  async publish<T>(data: T, options: PublishOptions): Promise<boolean> {
    const channel = this.ensureChannel();
    const content = Buffer.from(JSON.stringify(data));

    const exchange = options.exchange ?? "";
    const routingKey = options.routingKey;

    return channel.publish(exchange, routingKey, content, {
      persistent: options.persistent ?? true,
      expiration: options.expiration,
      priority: options.priority,
      headers: options.headers,
      contentType: "application/json",
    });
  }

  async consume<T>(options: ConsumeOptions, handler: MessageHandler<T>): Promise<void> {
    const channel = this.ensureChannel();

    await channel.consume(
      options.queue,
      async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        try {
          const content = JSON.parse(msg.content.toString()) as T;

          const message: Message<T> = {
            content,
            properties: {
              messageId: msg.properties.messageId,
              timestamp: msg.properties.timestamp,
              correlationId: msg.properties.correlationId,
              replyTo: msg.properties.replyTo,
              headers: msg.properties.headers as Record<string, unknown> | undefined,
            },
            fields: {
              deliveryTag: msg.fields.deliveryTag,
              redelivered: msg.fields.redelivered,
              exchange: msg.fields.exchange,
              routingKey: msg.fields.routingKey,
            },
          };

          await handler(message);

          if (!options.noAck) {
            channel.ack(msg);
          }
        } catch (error) {
          console.error("[RabbitMQ] Message handling error:", error);
          if (!options.noAck) {
            channel.nack(msg, false, false);
          }
        }
      },
      {
        consumerTag: options.consumerTag,
        noAck: options.noAck ?? false,
        exclusive: options.exclusive ?? false,
        priority: options.priority,
      },
    );
  }

  async close(): Promise<void> {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
      }
      if (this.connection) {
        await this.connection.close();
        this.connection = null;
      }
      console.log("[RabbitMQ] Connection closed gracefully");
    } catch (error) {
      console.error("[RabbitMQ] Error closing connection:", error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }
}
`;
}
