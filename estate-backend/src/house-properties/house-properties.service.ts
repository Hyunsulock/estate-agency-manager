
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateHousePropertyDto } from './dto/create-house-property.dto';
import { UpdateHousePropertyDto } from './dto/update-house-property.dto';
import { HouseProperty } from './entities/house-property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from 'src/apartments/entities/apartment.entity';
import { Role, User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { HousePropertyUserSaved } from './entities/house-property-user-saved.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { UpdatesGateway } from 'src/updates/updates.gateway';
import { Offer } from 'src/offers/entities/offer.entity';
import { CreateHousePropertyWithOfferDto } from './dto/create-house-with-offer.dto';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { RBAC } from 'src/auth/decorator/rbac.decorator';

@Injectable()
export class HousePropertiesService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(HousePropertyUserSaved)
    private readonly housePropertyUserSavedRepository: Repository<HousePropertyUserSaved>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
    @InjectRepository(HouseProperty)
    private readonly housePropertyRepository: Repository<HouseProperty>,
    private readonly updatesGateway: UpdatesGateway,
    private readonly userHistoriesService: UserHistoriesService,
  ) { }
  async create(createHousePropertyDto: CreateHousePropertyDto, AgencyId: number) {


    const { apartmentId, ownerId, ...restData } = createHousePropertyDto;

    const housePropertyCreateParams: Partial<HouseProperty> = { ...restData };


    const apartment = await this.apartmentRepository.findOne({
      where: {
        id: apartmentId,
      },
    });

    if (!apartment) {
      throw new NotFoundException('apartment with no matching id');
    }

    housePropertyCreateParams.apartment = apartment

    if (ownerId) {
      const owner = await this.customerRepository.findOne({
        where: {
          id: ownerId,
        },
      });

      if (!owner) {
        throw new NotFoundException('owner with no matching id');
      }

      housePropertyCreateParams.owner = owner
    }



    const agency = await this.agencyRepository.findOne({
      where: {
        id: AgencyId,
      },
    });

    housePropertyCreateParams.agency = agency



    const createdHouseProperty = await this.housePropertyRepository.save(housePropertyCreateParams);

    if (createdHouseProperty?.agency?.id) {
      this.updatesGateway.sendDataUpdate(
        createdHouseProperty.agency.id,
        'houseProperty',
        { entity: 'houseProperty', data: createdHouseProperty, type: "create" },
      );
    }

    return createdHouseProperty
  }

  async createWithOffer(createHousePropertyWithOfferDto: CreateHousePropertyWithOfferDto, AgencyId: number, userId: number) {
    const { houseProperty, offer } = createHousePropertyWithOfferDto;
    return await this.housePropertyRepository.manager.transaction(async (manager) => {
      // Create HouseProperty
      const apartment = await manager.findOne(Apartment, { where: { id: houseProperty.apartmentId } });
      if (!apartment) throw new NotFoundException('apartment with no matching id');

      const agencyCreater = await manager.findOne(Agency, { where: { id: AgencyId } });
      if (!agencyCreater) throw new NotFoundException('agencyCreater with no matching id');

      const agency = await manager.findOne(Agency, { where: { id: offer.agencyId } });
      if (!agency) throw new NotFoundException('agency with no matching id');

      const { apartmentId, ownerId, ...housePropertyData } = houseProperty;


      const housePropertyEntity = manager.create(HouseProperty, {
        ...housePropertyData,
        apartment,
        agency: agencyCreater,
      });

      if (houseProperty.ownerId) {
        const owner = await manager.findOne(Customer, { where: { id: houseProperty.ownerId } });
        if (!owner) throw new NotFoundException('owner with no matching id');
        housePropertyEntity.owner = owner;
      }

      const savedHouseProperty = await manager.save(housePropertyEntity);

      // Create Offer related to that HouseProperty

      const { agencyId, ...offerData } = offer;


      const offerEntity = manager.create(Offer, {
        ...offerData,
        houseProperty: savedHouseProperty,
        agency: agency
      });
      const savedOffer = await manager.save(offerEntity);

      // Send socket update
      if (savedHouseProperty.agency?.id) {
        this.updatesGateway.sendDataUpdate(
          savedHouseProperty.agency.id,
          'houseProperty',
          { entity: 'houseProperty', data: savedHouseProperty, type: 'create', updatedBy: userId }
        );
      }

      const currentUser = await this.userRepository.findOne({ where: { id: userId } });
      const currentAgency = await this.agencyRepository.findOne({
        where: { id: AgencyId }
      });

      if (savedHouseProperty) {
        await this.userHistoriesService.logHistory({
          currentUser: currentUser,
          action: 'CREATE',
          tableName: 'houseProperties',
          recordId: savedHouseProperty.id,
          oldData: null,
          newData: savedHouseProperty,
          currentAgency: currentAgency
        });
      }

      

      return { houseProperty: savedHouseProperty, offer: savedOffer };
    });
  }



  findAll() {
    return this.housePropertyRepository.find(
      { relations: ['agency', 'apartment', 'offers'] }
    );
  }

  async findByQuery(userId: number, agencyId: number, tradeType: string, status: string, apartmentId: number, minDeposit: number, maxDeposit: number, minRent: number, maxRent: number, minSize: number, maxSize: number, offerCount: number, buildingNumber: number, unitNumber: number) {
    console.log(userId, agencyId,)
    let query = this.housePropertyRepository.createQueryBuilder('houseProperty')
      .leftJoin('houseProperty.agency', 'agency')
      .where('agency.id = :agencyId', { agencyId })
      .leftJoin("houseProperty.apartment", "apartment")
      .leftJoin('houseProperty.offers', 'offer')
      .select([
        'houseProperty.id AS id',
        'houseProperty.size AS size',
        'houseProperty.room AS room',
        'houseProperty.status AS status',
        'houseProperty.buildingNumber AS buildingNumber',
        'houseProperty.floor AS floor',
        'houseProperty.unitNumber AS unitNumber',

        "apartment.id AS apartmentId",
        "apartment.name AS apartmentName",
        // Trade Type (to identify Jeonse, Rent, or Sale)
        'offer.tradeType AS tradeType',

        // Offer Count
        'COUNT(offer.id)::int AS offerCount',

        // Jeonse
        'MIN(CASE WHEN offer.tradeType = \'jeonse\' THEN offer.jeonseDeposit ELSE NULL END) AS minJeonseDeposit',
        'MAX(CASE WHEN offer.tradeType = \'jeonse\' THEN offer.jeonseDeposit ELSE NULL END) AS maxJeonseDeposit',

        // Rent
        'MIN(CASE WHEN offer.tradeType = \'rent\' THEN offer.rentPrice ELSE NULL END) AS minRentPrice',
        'MAX(CASE WHEN offer.tradeType = \'rent\' THEN offer.rentPrice ELSE NULL END) AS maxRentPrice',
        'MIN(CASE WHEN offer.tradeType = \'rent\' THEN offer.rentDeposit ELSE NULL END) AS minRentDeposit',
        'MAX(CASE WHEN offer.tradeType = \'rent\' THEN offer.rentDeposit ELSE NULL END) AS maxRentDeposit',

        // Sale
        'MIN(CASE WHEN offer.tradeType = \'sale\' THEN offer.salePrice ELSE NULL END) AS minSalePrice',
        'MAX(CASE WHEN offer.tradeType = \'sale\' THEN offer.salePrice ELSE NULL END) AS maxSalePrice',
      ])
      .groupBy('houseProperty.id, offer.tradeType, apartment.id');


    if (tradeType) {
      query.andWhere("offer.tradeType = :tradeType", { tradeType });
    }
    if (status) {
      query.andWhere("houseProperty.status = :status", { status });
    }
    if (apartmentId) {
      query.andWhere("apartment.id = :apartmentId", { apartmentId });
    }
    if (minSize) {
      query.andWhere("houseProperty.size >= :minSize", { minSize });
    }
    if (maxSize) {
      query.andWhere("houseProperty.size <= :maxSize", { maxSize });
    }
    if (buildingNumber) {
      query.andWhere("houseProperty.buildingNumber = :buildingNumber", { buildingNumber });
    }
    if (unitNumber) {
      query.andWhere("houseProperty.unitNumber = :unitNumber", { unitNumber });
    }



    if (tradeType === 'jeonse') {
      if (minDeposit) {
        query = query.having(`
      MIN(CASE WHEN offer.tradeType = 'jeonse' THEN offer.jeonseDeposit ELSE NULL END) >= :minDeposit
    `, { minDeposit });
      }
      if (maxDeposit) {
        query = query.andHaving(`
      MAX(CASE WHEN offer.tradeType = 'jeonse' THEN offer.jeonseDeposit ELSE NULL END) <= :maxDeposit
    `, { maxDeposit });
      }
    }

    if (tradeType === 'rent') {
      if (minDeposit) {
        query = query.having(`
      MIN(CASE WHEN offer.tradeType = 'rent' THEN offer.rentDeposit ELSE NULL END) >= :minDeposit
    `, { minDeposit });
      }
      if (maxDeposit) {
        query = query.andHaving(`
      MAX(CASE WHEN offer.tradeType = 'rent' THEN offer.rentDeposit ELSE NULL END) <= :maxDeposit
    `, { maxDeposit });
      }
      if (minRent) {
        query = query.andHaving(`
      MIN(CASE WHEN offer.tradeType = 'rent' THEN offer.rentPrice ELSE NULL END) >= :minRent
    `, { minRent });
      }
      if (maxRent) {
        query = query.andHaving(`
      MAX(CASE WHEN offer.tradeType = 'rent' THEN offer.rentPrice ELSE NULL END) <= :maxRent
    `, { maxRent });
      }
    }

    if (tradeType === 'sale') {
      if (minDeposit) {
        query = query.having(`
      MIN(CASE WHEN offer.tradeType = 'sale' THEN offer.salePrice ELSE NULL END) >= :minDeposit
    `, { minDeposit });
      }
      if (maxDeposit) {
        query = query.andHaving(`
      MAX(CASE WHEN offer.tradeType = 'sale' THEN offer.salePrice ELSE NULL END) <= :maxDeposit
    `, { maxDeposit });
      }
    }


    if (offerCount) {
      query.andHaving("COUNT(offer.id) >= :offerCount", { offerCount });
    }


    let [data, count] = await query.getManyAndCount();

    data = await query.getRawMany()

    const housePropertyIds = data.map(houseProperty => houseProperty.id);


    const savedHouseProperties = housePropertyIds.length < 1 ? [] : await this.housePropertyUserSavedRepository.createQueryBuilder('housePropertyUserSaved')
      .leftJoinAndSelect('housePropertyUserSaved.user', 'user')
      .leftJoinAndSelect('housePropertyUserSaved.houseProperty', 'houseProperty')
      .where('houseProperty.id IN(:...housePropertyIds)', { housePropertyIds })
      .andWhere('user.id = :userId', { userId })
      .getMany();


    const savedHousePropertyMap = new Set(savedHouseProperties.map(hp => hp.houseProperty.id));

    data = data.map(x => ({
      ...x,
      savedStatus: savedHousePropertyMap.has(x.id)
    }));

    return data

  }

  async findOne(id: number, AgencyId: number) {
    const agency = await this.agencyRepository.findOne({
      where: {
        id: AgencyId,
      },
    });
    if (!agency) {
      throw new NotFoundException('no matching agency');
    }
    const houseProperty = await this.housePropertyRepository.findOne({
      where: {
        id,
        agency: {
          id: AgencyId
        }
      }, relations: ['apartment']
    });

    if (!houseProperty) {
      throw new NotFoundException('no matching house property');
    }

    return houseProperty;
  }

  async update(id: number, updateHousePropertyDto: UpdateHousePropertyDto, userId: number, agencyId: number) {
    const { apartmentId, ...restData } = updateHousePropertyDto;


    let housePropertyUpdateParams;

    if (apartmentId) {
      const apartment = await this.apartmentRepository.findOne({
        where: {
          id: apartmentId,
        },
      });

      if (!apartment) {
        throw new NotFoundException('apartment with no matching id');
      }
      housePropertyUpdateParams = {
        apartment: apartment, ...restData
      }
    } else {
      housePropertyUpdateParams = {
        ...restData
      }
    }

    await this.housePropertyRepository.update(
      { id },
      housePropertyUpdateParams,
    );

    const updatedHouseProperty = await this.housePropertyRepository.findOne({
      where: {
        id,
      },
      relations: ['agency', 'apartment']
    });

    if (updatedHouseProperty?.agency?.id) {
      this.updatesGateway.sendDataUpdate(
        updatedHouseProperty.agency.id,
        'houseProperty',
        {
          entity: 'houseProperty',
          data: updatedHouseProperty,
          type: 'update',
          updatedBy: userId,
        }
      );
    }
    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (updatedHouseProperty) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'UPDATE',
        tableName: 'houseProperties',
        recordId: updatedHouseProperty.id,
        oldData: null,
        newData: updateHousePropertyDto,
        currentAgency: currentAgency
      });
    }

    return updatedHouseProperty;
  }
  @RBAC(Role.manager) 
  async remove(id: number, userId: number, agencyId: number) {
    const houseProperty = await this.housePropertyRepository.findOne({
      where: {
        id,
      }, relations: ['agency', 'apartment']
    });

    if (!houseProperty) {
      throw new NotFoundException('no matching houseProperty');
    }

    if (houseProperty?.agency?.id) {
      this.updatesGateway.sendDataUpdate(
        houseProperty.agency.id,
        'houseProperty',
        {
          entity: 'houseProperty',
          data: { id: id },
          type: 'delete',
          updatedBy: userId,
        }
      );
    }
    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (houseProperty) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'DELETE',
        tableName: 'houseProperties',
        recordId: houseProperty.id,
        oldData: houseProperty,
        newData: null,
        currentAgency: currentAgency
      });
    }
    await this.housePropertyRepository.delete(id);

    return id;
  }

  getSavedRecord(housePropertyId: number, userId: number) {
    return this.housePropertyUserSavedRepository.createQueryBuilder('housePropertyUserSaved')
      .leftJoinAndSelect('housePropertyUserSaved.houseProperty', 'houseProperty')
      .leftJoinAndSelect('housePropertyUserSaved.user', 'user')
      .where('houseProperty.id = :housePropertyId', { housePropertyId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }

  async toggleHousePropertySaved(housePropertyId: number, userId: number) {
    const houseProperty = await this.housePropertyRepository.findOne({
      where: {
        id: housePropertyId,
      }
    });

    if (!houseProperty) {
      throw new BadRequestException('존재하지 않는 영화입니다!');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      }
    })

    if (!user) {
      throw new UnauthorizedException('사용자 정보가 없습니다!');
    }

    const likeRecord = await this.getSavedRecord(housePropertyId, userId);


    if (likeRecord) {
      await this.housePropertyUserSavedRepository.delete({
        houseProperty,
        user,
      });
    } else {
      await this.housePropertyUserSavedRepository.save({
        houseProperty,
        user,
      });
    }

    return likeRecord ? "unsaved" : "saved"
  }
}
