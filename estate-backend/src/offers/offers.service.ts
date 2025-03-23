import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Agency } from 'src/agencies/entities/agency.entity';

@Injectable()
export class OffersService {
  constructor(

    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(HouseProperty)
    private readonly housePropertyRepository: Repository<HouseProperty>,
  ) { }

  async create(createOfferDto: CreateOfferDto) {
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

    return await this.offerRepository.save(offerCreateParams);
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
      }
    });

    if (!offer) {
      throw new NotFoundException('no matching house property');
    }

    return offer;
  }

  async findOffersByHousePropertyId(housePropertyId: number) {
    const offers = await this.offerRepository.find({
      where: {
        houseProperty: { id: housePropertyId },
      },
      relations: ['agency', 'houseProperty'],
    });

    return offers;
  }


  async update(id: number, updateOfferDto: UpdateOfferDto) {
    const { housePropertyId, agencyId, ...restData } = updateOfferDto;


    const offerUpdateParams: Partial<Offer> = { ...restData };

    // If `housePropertyId` is provided, validate and attach it
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

    return await this.offerRepository.findOne({ where: { id }, relations: ['houseProperty', 'agency'] });
  }

  async remove(id: number) {
    const houseProperty = await this.housePropertyRepository.findOne({
      where: {
        id,
      }
    });

    if (!houseProperty) {
      throw new NotFoundException('no matching houseProperty');
    }


    await this.housePropertyRepository.delete(id);

    return id;
  }
}
