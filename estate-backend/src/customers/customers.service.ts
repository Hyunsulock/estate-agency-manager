import { SearchCustomerDto } from './dto/search-customer.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Deal } from 'src/deals/entities/deal.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Repository } from 'typeorm';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    // @InjectRepository(Deal)
    // private readonly dealRepository: Repository<Deal>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(HouseProperty)
    private readonly housePropertyRepository: Repository<HouseProperty>,
  ) { }
  async create(createCustomerDto: CreateCustomerDto, agencyId: number) {

    const {housePropertyId, ...restData } = createCustomerDto;
  
    const customerCreateParams: Partial<Customer> = { ...restData };
  
    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
  
    if (!agency) {
      throw new NotFoundException(`agency with ID ${agencyId} not found`);
      }
  
    customerCreateParams.agency = agency;

    if (housePropertyId) {
      const houseProperty = await this.housePropertyRepository.findOne({ where: { id: housePropertyId } });
      customerCreateParams.houseProperties = [houseProperty]
    } 

    return this.customerRepository.save(customerCreateParams);
  }

  // findAll() {
  //   return this.customerRepository.find();
  // }

  findOne(id: number) {
    return this.customerRepository.findOne({ where: { id } });
  }

  // findByAgencyQuery with dynamic filtering
  async findByAgencyQuery (agencyId: number, searchCustomerDto: SearchCustomerDto) {
    const { name, phoneNumber, intro } = searchCustomerDto;
    const query = this.customerRepository.createQueryBuilder('customer')
      .where('customer.agency = :agencyId', { agencyId });

    if (name) {
      query.andWhere('customer.name LIKE :name', { name: `%${name}%` });
    }

    if (phoneNumber) {
      query.andWhere('customer.phoneNumber LIKE :phoneNumber', { phoneNumber: `%${phoneNumber}%` });
    }

    if (intro) {
      query.andWhere('customer.intro LIKE :intro', { intro: `%${intro}%` });
    }

    const result = await query.getMany();

    return result;
  }


  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`customer with ID ${id} not found`);
    }

    await this.customerRepository.update(id, updateCustomerDto);
    const newCustomer = await this.customerRepository.findOne({ where: { id } });

    return newCustomer;
  }

  async remove(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });

    if (!customer) {
      throw new NotFoundException(`customer with ID ${id} not found`);
    }

    await this.customerRepository.delete(id);
    return id;
  }
}
