import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './entity/Profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt/dist';

@Module({
  imports : [TypeOrmModule.forFeature([Profile]),
  JwtModule],
  providers: [ProfileService],
  controllers: [ProfileController],
  exports : [TypeOrmModule, ProfileService]
})
export class ProfileModule {}
