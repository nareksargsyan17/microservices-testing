import { Controller } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Put, Req, Body } from '@nestjs/common/decorators';
import { Request } from 'express';
import { EditProfile } from './dto/edit.profile.dto';
import { JwtService } from '@nestjs/jwt';
import { EventPattern } from '@nestjs/microservices';
import { CreateProfile } from './dto/create.profile.dto';
@Controller()
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private jwtService: JwtService,
  ) {}

  @EventPattern('register')
  async createProfile(data: CreateProfile) {
    return await this.profileService.createProfile(data);
  }

  @EventPattern('delete')
  async deleteProfile(id: number) {
    return await this.profileService.delete(id);
  }

  @Put('edit') //editing profile rows
  async update(@Req() request: Request, @Body() editDto: EditProfile) {
    const jwt: any = this.jwtService.decode(request.cookies['jwt']); //jwt token decoding
    if (jwt.role) {
      return {
        data : await this.profileService.update(editDto.userId, editDto),
        message : "updated by admin"
      }
    } else if (jwt && jwt.id && !editDto.userId) {
      return {
        data : await this.profileService.update(jwt.id, editDto),
        message : 'updated by user'
      }
    } else {
      return 'not Found';
    }
  }
}
