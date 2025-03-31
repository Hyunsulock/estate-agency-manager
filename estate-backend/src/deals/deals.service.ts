import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { Deal } from './entities/deal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Role, User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { SearchDealDto } from './dto/search-deal.dto';
import { UpdatesGateway } from 'src/updates/updates.gateway';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { RBAC } from 'src/auth/decorator/rbac.decorator';

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
    private readonly updatesGateway: UpdatesGateway,
    private readonly userHistoriesService: UserHistoriesService,
  ) { }
  async create(createDealDto: CreateDealDto, agencyId: number, userId: number) {
    const { buyAgencyId, sellAgencyId, dealerId, housePropertyId, offerId, buyerId, sellerId, ...restData } = createDealDto;

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

    if (seller) {
      dealCrerateParams.seller = seller;
    }

    const buyer = await this.customerRepository.findOne({ where: { id: buyerId } });

    if (buyer) {
      dealCrerateParams.buyer = buyer;
    }

    const sellAgency = await this.agencyRepository.findOne({ where: { id: sellAgencyId } });

    if (!sellAgency) {
      throw new NotFoundException(`sellAgency with ID ${sellAgencyId} not found`);
    }

    dealCrerateParams.sellAgency = sellAgency;


    const dealer = await this.userRepository.findOne({ where: { id: +dealerId } });

    if (!dealer) {
      throw new NotFoundException(`Dealer with ID ${dealerId} not found`);
    }

    dealCrerateParams.dealer = dealer

    if (offerId) {
      const offer = await this.offerRepository.findOne({ where: { id: offerId } });

      if (!offer) {
        throw new NotFoundException(`offer with ID ${offerId} not found`);
      }

      dealCrerateParams.offer = offer;
    }

    const savedDeal = await this.dealRepository.save(dealCrerateParams);

    if (agencyId) {
      this.updatesGateway.sendDataUpdate(
        agencyId,
        'deal',
        {
          entity: 'deal',
          data: savedDeal,
          type: 'create',
        }
      );
    }

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (savedDeal) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'CREATE',
        tableName: 'deals',
        recordId: savedDeal.id,
        oldData: null,
        newData: savedDeal,
        currentAgency: currentAgency
      });
    }

    return savedDeal
  }

  findAll() {
    return this.dealRepository.find(
      {
        relations: ['houseProperty', 'houseProperty.apartment', 'offer', 'buyAgency', 'sellAgency', 'dealers', 'seller', 'buyer']
      }
    );
  }


  async searchDeals(searchParams: SearchDealDto, agencyId: number) {
    console.log('searchParams', searchParams)
    const query = this.dealRepository
      .createQueryBuilder('deal')
      .leftJoinAndSelect('deal.houseProperty', 'houseProperty')
      .leftJoinAndSelect('houseProperty.apartment', 'apartment')
      .leftJoinAndSelect('houseProperty.agency', 'agency')
      .leftJoinAndSelect('deal.buyAgency', 'buyAgency')
      .leftJoinAndSelect('deal.sellAgency', 'sellAgency')
      .leftJoinAndSelect('deal.seller', 'seller')
      .leftJoinAndSelect('deal.buyer', 'buyer')
      .leftJoinAndSelect('deal.dealer', 'dealer')
      .leftJoinAndSelect('deal.offer', 'offer')


    if (searchParams.tradeType) {
      query.andWhere('offer.tradeType = :tradeType', { tradeType: searchParams.tradeType });
    }

    if (searchParams.apartmentId) {
      query.andWhere('apartment.id = :apartmentId', { apartmentId: searchParams.apartmentId });
    }
    if (searchParams.buildingNumber) {
      query.andWhere('houseProperty.buildingNumber = :buildingNumber', { buildingNumber: searchParams.buildingNumber });
    }
    if (searchParams.unitNumber) {
      query.andWhere('houseProperty.unitNumber = :unitNumber', { unitNumber: searchParams.unitNumber });
    }
    if (searchParams.buyerName) {
      query.andWhere('buyer.name LIKE :buyerName', { buyerName: `%${searchParams.buyerName}%` });
    }
    if (searchParams.sellerName) {
      query.andWhere('seller.name LIKE :sellerName', { sellerName: `%${searchParams.sellerName}%` });
    }
    if (searchParams.sellerAgencyName) {
      query.andWhere('sellAgency.name LIKE :sellerAgencyName', { sellerAgencyName: `%${searchParams.sellerAgencyName}%` });
    }
    if (searchParams.buyerAgencyName) {
      query.andWhere('buyAgency.name LIKE :buyerAgencyName', { buyerAgencyName: `%${searchParams.buyerAgencyName}%` });
    }
    if (searchParams.dealDateStartRange && searchParams.dealDateEndRange) {
      query.andWhere('deal.dealDate BETWEEN :start AND :end', {
        start: searchParams.dealDateStartRange,
        end: searchParams.dealDateEndRange,
      });
    }
    return query.getMany();
  }

  findOne(id: number) {
    return this.dealRepository.findOne({ where: { id }, relations: ['houseProperty', 'houseProperty.apartment', 'offer', 'offer.agency', 'buyAgency', 'sellAgency', 'dealer', 'buyer', 'seller'] });
  }

  async update(id: number, updateDealDto: UpdateDealDto, userId: number, agencyId: number) {
    const { buyAgencyId, sellAgencyId, dealerId, sellerId, buyerId, ...restData } = updateDealDto;


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



    if (dealerId) {
      const dealer = await this.userRepository.findOne({ where: { id: +dealerId } });
      if (!dealer) {
        throw new NotFoundException(`dealer with ID ${dealerId} not found`);
      }
      dealUpdateParams.dealer = dealer
    }

    await this.dealRepository.update(
      { id },
      dealUpdateParams,
    );

    const updatedDeal = await this.dealRepository.findOne({ where: { id }, relations: ['houseProperty', 'buyAgency', 'sellAgency', 'offer'] });

    if (agencyId) {
      this.updatesGateway.sendDataUpdate(
        agencyId,
        'deal',
        {
          entity: 'deal',
          data: updatedDeal,
          type: 'update',
        }
      );
    }

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (updatedDeal) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'UPDATE',
        tableName: 'deals',
        recordId: updatedDeal.id,
        oldData: null,
        newData: updateDealDto,
        currentAgency: currentAgency
      });
    }


    return updatedDeal
  }

  @RBAC(Role.manager)
  async remove(id: number, userId: number, agencyId: number) {
    const deal = await this.dealRepository.findOne({
      where: {
        id,
      }
    });

    if (!deal) {
      throw new NotFoundException('no matching deal');
    }

    await this.dealRepository.delete(id);

    if (agencyId) {
      this.updatesGateway.sendDataUpdate(
        agencyId,
        'deal',
        {
          entity: 'deal',
          data: deal,
          type: 'delete',
        }
      );
    }

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (deal) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'DELETE',
        tableName: 'deals',
        recordId: deal.id,
        oldData: deal,
        newData: null,
        currentAgency: currentAgency
      });
    }

    return id;
  }
}
