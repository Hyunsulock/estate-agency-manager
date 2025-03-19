import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { Deal } from './entities/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';

@Injectable()
export class DealsService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(HouseProperty)
    private readonly housePropertyRepository: Repository<HouseProperty>,
  ) { }
  async create(createDealDto: CreateDealDto) {
    const { buyAgencyId, sellAgencyId, dealersId, housePropertyId, offerId, buyerId, sellerId, ...restData } = createDealDto;

    const dealCrerateParams: Partial<Deal> = { ...restData };

    const houseProperty = await this.housePropertyRepository.findOne({ where: { id: housePropertyId } });

    if (!houseProperty) {
      throw new NotFoundException(`houseProperty with ID ${housePropertyId} not found`);
    }

    dealCrerateParams.houseProperty = houseProperty;

    const buyAgency = await this.agencyRepository.findOne({ where: { id: buyAgencyId } });

    if (!buyAgency) {
      throw new NotFoundException(`buyAgency with ID ${buyAgencyId} not found`);
    }

    dealCrerateParams.buyAgency = buyAgency;


    const seller = await this.customerRepository.findOne({ where: { id: sellerId } });

    if (!seller) {
      throw new NotFoundException(`seller with ID ${sellerId} not found`);
    }

    dealCrerateParams.seller = seller;

    const buyer = await this.customerRepository.findOne({ where: { id: buyerId } });

    if (!buyer) {
      throw new NotFoundException(`buyer with ID ${buyerId} not found`);
    }

    dealCrerateParams.buyer = buyer;


    const sellAgency = await this.agencyRepository.findOne({ where: { id: sellAgencyId } });

    if (!sellAgency) {
      throw new NotFoundException(`sellAgency with ID ${sellAgencyId} not found`);
    }

    dealCrerateParams.sellAgency = sellAgency;

    const dealerList = []

    for (const dealerId of dealersId) {
      const dealer = await this.userRepository.findOne({ where: { id: +dealerId } });

      if (!dealer) {
        throw new NotFoundException(`Dealer with ID ${dealerId} not found`);
      }

      dealerList.push(dealer);
    }




    if (dealerList.length !== dealersId.length) {

      console.log(dealerList)
      console.log(dealersId)
      throw new NotFoundException(`dealer with ID not found`);
    }
    else {
      dealCrerateParams.dealers = dealerList
    }



    if (offerId) {
      const offer = await this.offerRepository.findOne({ where: { id: offerId } });

      if (!offer) {
        throw new NotFoundException(`offer with ID ${offerId} not found`);
      }

      dealCrerateParams.offer = offer;
    }

    return this.dealRepository.save(dealCrerateParams);
  }

  findAll() {
    return this.dealRepository.find(
      {
        relations: ['houseProperty', 'offer', 'buyAgency', 'sellAgency', 'dealers', 'seller', 'buyer']
      }
    );
  }

  findOne(id: number) {
    return this.dealRepository.findOne({ where: { id }, relations: ['houseProperty', 'agency', 'offer', 'buyAgency', 'sellAgency', 'dealers'] });
  }

  async update(id: number, updateDealDto: UpdateDealDto) {
    const { buyAgencyId, sellAgencyId, dealersId, sellerId, buyerId, ...restData } = updateDealDto;


    const dealUpdateParams: Partial<Deal> = { ...restData };

    if (buyAgencyId) {
      const buyAgency = await this.agencyRepository.findOne({ where: { id: buyAgencyId } });

      if (!buyAgency) {
        throw new NotFoundException(`buyAgency with ID ${buyAgencyId} not found`);
      }

      dealUpdateParams.buyAgency = buyAgency;
    }

    if (sellAgencyId) {
      const sellAgency = await this.agencyRepository.findOne({ where: { id: sellAgencyId } });

      if (!sellAgency) {
        throw new NotFoundException(`buyAgency with ID ${sellAgencyId} not found`);
      }

      dealUpdateParams.sellAgency = sellAgency;
    }

    if (sellerId) {
      const seller = await this.customerRepository.findOne({ where: { id: sellerId } });

      if (!seller) {
        throw new NotFoundException(`seller with ID ${sellerId} not found`);
      }

      dealUpdateParams.seller = seller;
    }


    if (buyerId) {
      const buyer = await this.customerRepository.findOne({ where: { id: buyerId } });

      if (!buyer) {
        throw new NotFoundException(`buyer with ID ${buyerId} not found`);
      }

      dealUpdateParams.buyer = buyer;
    }



    if (dealersId) {

      const dealerList = []
      dealersId.forEach(async (dealerId) => {
        const dealer = await this.userRepository.findOne({ where: { id: +dealerId } });

        if (!dealer) {
          throw new NotFoundException(`dealer with ID ${dealerId} not found`);
        }

        dealerList.push(dealer);
      })

      if (dealerList.length !== dealersId.length) {
        throw new NotFoundException(`dealer with ID not found`);
      }
      else {
        dealUpdateParams.dealers = dealerList
      }

    }

    await this.dealRepository.update(
      { id },
      dealUpdateParams,
    );


    return this.dealRepository.findOne({ where: { id }, relations: ['houseProperty', 'buyAgency', 'sellAgency', 'offer'] });
  }

  async remove(id: number) {
    const deal = await this.dealRepository.findOne({
      where: {
        id,
      }
    });

    if (!deal) {
      throw new NotFoundException('no matching deal');
    }

    await this.dealRepository.delete(id);

    return id;
  }
}
