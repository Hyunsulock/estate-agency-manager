import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { UpdatesGateway } from 'src/updates/updates.gateway';
import { UserHistoriesService } from 'src/user-histories/user-histories.service';
import { Role, User } from 'src/users/entities/user.entity';
import { RBAC } from 'src/auth/decorator/rbac.decorator';

@Injectable()
export class OffersService {
  constructor(

    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(HouseProperty)
    private readonly housePropertyRepository: Repository<HouseProperty>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly updatesGateway: UpdatesGateway,
    private readonly userHistoriesService: UserHistoriesService,
  ) { }

  async create(createOfferDto: CreateOfferDto, createrAgencyId: number, userId: number) {
    const { housePropertyId, agencyId, ...restData } = createOfferDto;

    const houseProperty = await this.housePropertyRepository.findOne({
      where: {
        id: housePropertyId,
      },
    });

    if (!houseProperty) {
      throw new NotFoundException('houseproperty with no matching id');
    }

    const agency = await this.agencyRepository.findOne({
      where: {
        id: agencyId,
      },
    });

    if (!agency) {
      throw new NotFoundException('agency with no matching id');
    }

    let offerCreateParams = {
      houseProperty: houseProperty, agency: agency, ...restData
    }

    const savedOffer = await this.offerRepository.save(offerCreateParams);

    if (savedOffer) {
      this.updatesGateway.sendDataUpdate(
        createrAgencyId,
        'offer',
        {
          entity: 'offer',
          data: savedOffer,
          type: 'create',
          updatedBy: userId,
        }
      );
    }

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: createrAgencyId }
    });

    if (savedOffer) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'CREATE',
        tableName: 'offers',
        recordId: savedOffer.id,
        oldData: null,
        newData: savedOffer,
        currentAgency: currentAgency
      });
    }



    return savedOffer;
  }

  findAll() {
    return this.offerRepository.find(
      { relations: ['agency', 'houseProperty'] }
    );
  }

  async findOne(id: number) {
    const offer = await this.offerRepository.findOne({
      where: {
        id,
      },
      relations: ['agency', 'houseProperty'],
    });

    if (!offer) {
      throw new NotFoundException('no matching house property');
    }

    return offer;
  }

  async findOffersByHousePropertyId(housePropertyId: number, tradeType: string) {
    const offers = await this.offerRepository.find({
      where: {
        tradeType: tradeType,
        houseProperty: { id: housePropertyId },
      },
      relations: ['agency', 'houseProperty'],
    });

    return offers;
  }


  async update(id: number, updateOfferDto: UpdateOfferDto, userId: number, AgencyId: number) {
    const { housePropertyId, agencyId, ...restData } = updateOfferDto;


    const offerUpdateParams: Partial<Offer> = { ...restData };

    if (housePropertyId) {
      const houseProperty = await this.housePropertyRepository.findOne({ where: { id: housePropertyId } });

      if (!houseProperty) {
        throw new NotFoundException(`HouseProperty with ID ${housePropertyId} not found`);
      }

      offerUpdateParams.houseProperty = houseProperty;
    }

    if (agencyId) {
      const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });

      if (!agency) {
        throw new NotFoundException(`Agency with ID ${agencyId} not found`);
      }

      offerUpdateParams.agency = agency;
    }

    await this.offerRepository.update(
      { id },
      offerUpdateParams,
    );

    const updatedOffer = await this.offerRepository.findOne({ where: { id }, relations: ['houseProperty', 'agency'] })


    if (AgencyId) {
      this.updatesGateway.sendDataUpdate(
        AgencyId,
        'offer',
        {
          entity: 'offer',
          data: updatedOffer,
          type: 'update',
          updatedBy: userId,
        }
      );


    }

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (updatedOffer) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'UPDATE',
        tableName: 'offers',
        recordId: updatedOffer.id,
        oldData: null,
        newData: updateOfferDto,
        currentAgency: currentAgency
      });
    }

    return updatedOffer
  }

  @RBAC(Role.manager) 
  async remove(id: number, userId: number, agencyId: number) {
    const offer = await this.offerRepository.findOne({
      where: {
        id,
      },
      relations: ['agency', 'houseProperty'],
    });

    if (!offer) {
      throw new NotFoundException('no matching houseProperty');
    }





    await this.offerRepository.delete(id);

    if (agencyId) {
      this.updatesGateway.sendDataUpdate(
        agencyId,
        'offer',
        {
          entity: 'offer',
          data: offer,
          type: 'delete',
          updatedBy: userId,
        }
      );
    }

    const currentUser = await this.userRepository.findOne({ where: { id: userId } });
    const currentAgency = await this.agencyRepository.findOne({
      where: { id: agencyId }
    });

    if (offer) {
      await this.userHistoriesService.logHistory({
        currentUser: currentUser,
        action: 'DELETE',
        tableName: 'offers',
        recordId: offer.id,
        oldData: offer,
        newData: null,
        currentAgency: currentAgency
      });
    }

    return offer;
  }
}
