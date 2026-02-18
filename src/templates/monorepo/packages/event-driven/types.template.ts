import type { MonorepoTemplateData } from '../../../../types';

export function generateEventDrivenTypes(_data: MonorepoTemplateData): string {
  return `export interface RabbitMQConfig {
  url: string;
  prefetchCount?: number;
  reconnectInterval?: number;
}

export interface QueueConfig {
  name: string;
  durable?: boolean;
  exclusive?: boolean;
  autoDelete?: boolean;
  arguments?: Record<string, unknown>;
  deadLetterExchange?: string;
  deadLetterQueue?: string;
  messageTtl?: number;
  maxRetries?: number;
}

export interface ExchangeConfig {
  name: string;
  type: "direct" | "topic" | "fanout" | "headers";
  durable?: boolean;
  autoDelete?: boolean;
  arguments?: Record<string, unknown>;
}

export interface PublishOptions {
  exchange?: string;
  routingKey: string;
  persistent?: boolean;
  expiration?: string;
  priority?: number;
  headers?: Record<string, unknown>;
}

export interface ConsumeOptions {
  queue: string;
  consumerTag?: string;
  noAck?: boolean;
  exclusive?: boolean;
  priority?: number;
}

export interface Message<T = unknown> {
  content: T;
  properties: {
    messageId?: string;
    timestamp?: number;
    correlationId?: string;
    replyTo?: string;
    headers?: Record<string, unknown>;
  };
  fields: {
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
}

export type MessageHandler<T = unknown> = (message: Message<T>) => Promise<void> | void;

export interface DeadLetterConfig {
  exchange: string;
  queue: string;
  routingKey: string;
  maxRetries: number;
}
`;
}
