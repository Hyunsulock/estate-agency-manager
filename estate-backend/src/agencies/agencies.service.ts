import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Repository } from 'typeorm';
import { SearchAgencyDto } from './dto/search-agency.dto';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userHistoriesService: UserHistoriesService,
  ) { }

  async create(createAgencyDto: CreateAgencyDto, userId: number, agencyId: number) {

    const currentUser = await this.userRepository.findOne({
      where: { id: userId }
    });

    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    const savedAgency = await this.agencyRepository.save(createAgencyDto);

    if (savedAgency) {
      console.log('savedAgency', savedAgency)
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'CREATE',
        tableName: 'agencies',
        recordId: savedAgency.id,
        oldData: null,
        newData: savedAgency,
        currentAgency: currentAgency
      });
    }
    return savedAgency;

  }

  async createAgencyAdmin(createAgencyDto: CreateAgencyDto, userId: number,) {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId }
    });

    const savedAgency = await this.agencyRepository.save(createAgencyDto);

    if (currentUser) {
      await this.userRepository.update(
        { id: userId },
        { role: 0,  agency: savedAgency } // 0 = agency admin
      );
    }

    return savedAgency;

  }

  async findAll() {
    return await this.agencyRepository.find();
  }

  async findOne(id: number) {
    const agency = await this.agencyRepository.findOne({
      where: {
        id,
      }
    })

    if (!agency) {
      throw new NotFoundException('none existing agency')
    }

    return agency;
  }

  async searchAgencies(searchAgencyDto: SearchAgencyDto) {
    const { name, phoneNumber, location } = searchAgencyDto

    console.log('ssearchDto', name, phoneNumber, location)

    const query = this.agencyRepository.createQueryBuilder('agency');

    if (name) {
      query.andWhere('agency.name LIKE :name', { name: `%${name}%` });
    }
    if (phoneNumber) {
      query.andWhere('agency.phoneNumber LIKE :phoneNumber', { phoneNumber: `%${phoneNumber}%` });
    }
    if (location) {
      query.andWhere('agency.location LIKE :location', { location: `%${location}%` });
    }

    if (name) {
      console.log('name', name)
    }

    const data = await query.getMany();

    console.log('query', data)

    return data;

  }


  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    const agency = await this.agencyRepository.findOne({
      where: {
        id,
      }
    });

    if (!agency) {
      throw new NotFoundException('none existing agency')
    }

    await this.agencyRepository.update(
      { id, }, {
      ...updateAgencyDto,
    });

    const newAgency = await this.agencyRepository.findOne({
      where: {
        id,
      }
    });

    return newAgency;
  }

  async remove(id: number) {
    const agency = await this.agencyRepository.findOne({
      where: {
        id,
      }
    });

    if (!agency) {
      throw new NotFoundException('none existing agency')
    }

    await this.agencyRepository.delete(id);

    return id;

  }
}
