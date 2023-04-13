import { Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entity/Profile';
import { CreateProfile } from './dto/create.profile.dto';
import { EditProfile } from './dto/edit.profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async get() {
    return await this.profileRepository.find();
  }

  //creating profile
  async createProfile(profile: CreateProfile) {
    return await this.profileRepository.save(profile);
  }

  //updating profile
  async update(id: number, editDto: EditProfile) {
    console.log(await this.profileRepository.update(id, editDto));
    await this.profileRepository.update(id, editDto);
    let newdata = this.profileRepository.findOneBy({id})
    return newdata
  }

  async delete(id: number) {
    await this.profileRepository.delete({ userId: id });
    return 'deleted';
  }
}
