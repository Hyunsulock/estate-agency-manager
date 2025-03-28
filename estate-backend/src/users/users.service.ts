import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { envVariableKeys } from 'src/common/const/env.const';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Agency } from 'src/agencies/entities/agency.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    private readonly configService: ConfigService,
  ) {

  }


  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new BadRequestException('user already exists');
    }

    const hash = await bcrypt.hash(password, this.configService.get<number>(envVariableKeys.hashRounds))

    return await this.userRepository.save({
      name,
      email,
      password: hash,
    });
  }

  findAll() {
    return this.userRepository.find({
      relations: ['agency']
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['agency']
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다!');
    }

    return user
  }

  async findByAgency(agencyId: number) {
    const users = await this.userRepository.find({
      where: {
        agency: {
          id: agencyId
        },
      },
      relations: ['agency']
    });
    return users
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    const { password, name, agency, email } = updateUserDto;

    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다!');
    }

    let data = {}

    if (agency) {
      const agency_found = await this.agencyRepository.findOne({
        where: {
          id: agency,
        }
      });

      if (agency_found) {
        data = {
          agency: agency_found
        }
      } else {
        throw new NotFoundException('no agency found')
      }

    }

    if (password) {
      const hash = await bcrypt.hash(password, this.configService.get<number>(envVariableKeys.hashRounds));

      data = {
        ...data, password: hash
      }
    }

    if (name) {
      data = {
        ...data, name: name
      }
    }

    if (email) {
      data = {
        ...data, email: email
      }
    }

    await this.userRepository.update(
      { id },
      { ...data }
    );

    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }


  async updateUserRole(id: number, updateUserRole: UpdateUserRoleDto, agencyId: number) {
    const { role } = updateUserRole;

    const agency = await this.agencyRepository.findOne({
      where: {
        id: agencyId,
      }
    });

    if (agency) {
      const staff = await this.userRepository.findOne({ where: { id }, relations: ['agency'] },);

      if (!staff) {
        throw new NotFoundException('no user found');
      }

      if (staff.agency.id !== agency.id) {
        throw new BadRequestException('staff is not in the agency');
      }

      await this.userRepository.update(
        { id },
        { role }
      );

      return staff.id
    }
  }

  async remove(id: number) {
      const user = await this.userRepository.findOne({
        where: {
          id,
        }
      });

      if (!user) {
        throw new NotFoundException('존재하지 않는 사용자입니다!');
      }


      await this.userRepository.delete(id);

      return id;
    }
  }
