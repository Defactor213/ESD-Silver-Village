import amqplib, { Channel, Connection } from 'amqplib';
import { BatchRecorder, ExplicitContext, model, Tracer } from 'zipkin';
import * as KoaInstrumentation from 'zipkin-instrumentation-koa';

class AMQPLogger {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(rabbitMQURL: string) {
    this.setup(rabbitMQURL);
  }

  private async setup(rabbitMQURL: string) {
    this.connection = await amqplib.connect(rabbitMQURL);
    this.channel = await this.connection.createChannel();
  }

  logSpan(span: model.Span) {
    const encodedSpan = JSON.stringify([span]);

    this.channel?.publish('zipkin', 'zipkin', Buffer.from(encodedSpan));
  }

  toString() {
    return 'AMQP Tracer';
  }
}

export default function setupTracingMiddleware() {
  const { RABBITMQ_URL } = process.env;

  if (RABBITMQ_URL == null) {
    throw new Error('No RabbitMQ URL');
  }

  const ctxImpl = new ExplicitContext();
  const recorder = new BatchRecorder({
    logger: new AMQPLogger(RABBITMQ_URL),
  });

  const tracer = new Tracer({
    ctxImpl,
    recorder,
    localServiceName: 'showtime',
  });

  return KoaInstrumentation.koaMiddleware({ tracer });
}
