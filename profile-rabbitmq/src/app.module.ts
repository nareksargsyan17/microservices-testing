import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entity/Profile';
import appconfig from './appconfig';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appconfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 3008,
      username: 'postgres',
      password: '170801nsrm',
      database: 'profile',
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
