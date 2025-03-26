import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Repository } from 'typeorm';
import { SearchAgencyDto } from './dto/search-agency.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) { }

  async create(createAgencyDto: CreateAgencyDto) {
    return await this.agencyRepository.save(createAgencyDto);
  }

  findAll() {
    return this.agencyRepository.find();
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

    if( name) {
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
