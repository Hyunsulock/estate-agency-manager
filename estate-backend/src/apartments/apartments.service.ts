import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApartmentDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Apartment } from './entities/apartment.entity';
import { Repository } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { SearchApartmentDto } from './dto/search-apartment.dto';

@Injectable()
export class ApartmentsService {
  constructor(
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
  ) { }

  async create(createApartmentDto: CreateApartmentDto, agencyId: number) {
    const apartmentCreateParams: Partial<Apartment> = { ...createApartmentDto };
    const agency = await this.agencyRepository.findOne({
      where: {
        id: agencyId,
      },
    });
    apartmentCreateParams.agency = agency
    return this.apartmentRepository.save(apartmentCreateParams);
  }

  find(agencyId: number) {
    return this.apartmentRepository.find({
      where: {
        agency: { id: agencyId },
      },
    });
  }

  async search(searchDto: SearchApartmentDto, agencyId: number) {
    const { name, address } = searchDto;
    const query = this.apartmentRepository.createQueryBuilder('apartment');

    if (agencyId) {
      query.where('apartment.agencyId = :agencyId', { agencyId });
    }

    if (name) {
      query.andWhere('apartment.name ILIKE :name', { name: `%${name}%` });
    }

    if (address) {
      query.andWhere('apartment.address ILIKE :address', { address: `%${address}%` });
    }

    query.orderBy('apartment.createdAt', 'DESC');

    return query.getMany();
  }

  findAll() {
    return this.apartmentRepository.find();
  }

  findOne(id: number) {
    return this.apartmentRepository.findOne({ where: { id } });
  }

  async update(id: number, updateApartmentDto: UpdateApartmentDto) {
    const apartment = await this.apartmentRepository.findOne({ where: { id } });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    await this.apartmentRepository.update(id, updateApartmentDto);
    const newApartment = await this.apartmentRepository.findOne({ where: { id } });


    return newApartment;
  }

  async remove(id: number) {
    const apartment = await this.apartmentRepository.findOne({ where: { id } });

    if (!apartment) {
      throw new NotFoundException(`Apartment with ID ${id} not found`);
    }

    await this.apartmentRepository.delete(id);
    return id;
  }
}
