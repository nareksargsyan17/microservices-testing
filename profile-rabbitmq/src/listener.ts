import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [
          'amqps://cfuifrls:7tObqMvVSD9jH47jJWy-3sZOMwfwfcMN@jackal.rmq.cloudamqp.com/cfuifrls',
        ],
        queue: 'user_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  app.listen().then(() => {
    console.log('microservice is working');
  });
}
bootstrap();
