import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
  ) { }

  create(createAgencyDto: CreateAgencyDto) {
    return this.agencyRepository.save(createAgencyDto);
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
