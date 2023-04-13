import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/User';
import { CreateUser } from './dto/create.user.dto';
import { LoginUser } from './dto/login.user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //creating user
  async register(createUserDto: CreateUser) {
    if (
      !(await this.userRepository.findOne({
        where: { email: createUserDto.email },
      }))
    ) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 12); //password hashing
      const { id } = await this.userRepository.save({
        email: createUserDto.email,
        password: createUserDto.password,
        role: createUserDto.role,
      }); //saving user
      return id;
    } else {
      return false;
    }
  }
  async login(loginUser: LoginUser) {
    const user = await this.userRepository.findOne({
      where: { email: loginUser.email },
    });

    if (!user) {
      return 'invalid email';
    }

    if (!(await bcrypt.compare(loginUser.password, user.password))) {
      //compareIng password
      return 'invalid password';
    }

    const jwt = await this.jwtService.signAsync({
      id: user.id,
      role: user.role,
    }); //signing jwt token
    return jwt;
  }

  async getUserById(id: number): Promise<any> {
    const { password, ...user } = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    return user;
  }
  async delete(id: number) {
    try {
      await this.userRepository.delete({ id });
      return 'deleted';
    } catch {
      return 'not found';
    }
  }
}
