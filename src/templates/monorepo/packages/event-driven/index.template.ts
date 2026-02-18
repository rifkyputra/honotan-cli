import type { MonorepoTemplateData } from '../../../../types';

export function generateEventDrivenIndex(_data: MonorepoTemplateData): string {
  return `export { RabbitMQClient } from "./rabbitmq";
export type {
  RabbitMQConfig,
  QueueConfig,
  ExchangeConfig,
  PublishOptions,
  ConsumeOptions,
  Message,
  MessageHandler,
  DeadLetterConfig,
} from "./types";
`;
}
