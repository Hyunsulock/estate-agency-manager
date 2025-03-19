import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/customers/entities/customer.entity';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { HouseProperty } from 'src/house-properties/entities/house-property.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Deal } from 'src/deals/entities/deal.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,
    @InjectRepository(HouseProperty)
    private readonly housePropertyRepository: Repository<HouseProperty>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Deal)
    private readonly dealRepository: Repository<Deal>,
  ) { }

  async create(createCommentDto: CreateCommentDto, userId: number, agencyId: number) {
    const { housePropertyId, offerId, customerId, dealId, ...restData } = createCommentDto;

    const commentCreateParams: Partial<Comment> = { ...restData };

    // If `housePropertyId` is provided, validate and attach it
    if (housePropertyId) {
      const houseProperty = await this.housePropertyRepository.findOne({ where: { id: housePropertyId } });

      if (!houseProperty) {
        throw new NotFoundException(`HouseProperty with ID ${housePropertyId} not found`);
      }

      commentCreateParams.houseProperty = houseProperty;
    }

    if (offerId) {
      const offer = await this.offerRepository.findOne({ where: { id: offerId } });

      if (!offer) {
        throw new NotFoundException(`offer with ID ${offerId} not found`);
      }

      commentCreateParams.offer = offer;
    }

    if (customerId) {
      const customer = await this.customerRepository.findOne({ where: { id: customerId } });

      if (!customer) {
        throw new NotFoundException(`customer with ID ${customerId} not found`);
      }

      commentCreateParams.customer = customer;
    }

    if (dealId) {
      const deal = await this.dealRepository.findOne({ where: { id: dealId } });

      if (!deal) {
        throw new NotFoundException(`deal with ID ${dealId} not found`);
      }

      commentCreateParams.deal = deal;
    }


    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });

    if (!agency) {
      throw new NotFoundException(`Agency with ID ${agencyId} not found`);
    }

    commentCreateParams.agency = agency;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`user with ID ${userId} not found`);
    }

    commentCreateParams.user = user;


    return await this.commentRepository.save(commentCreateParams);

  }

  findAll() {
    return this.commentRepository.find(
      //{ relations: ['agency', 'houseProperty'] }
    );
  }

  findOne(id: number) {
    return this.commentRepository.findOne({ where: { id },});
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number) {

    const { comment, ...restData } = updateCommentDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`user with ID ${userId} not found`);
    }

    const oldComment = await this.commentRepository.findOne({ where: { id }, });

    if (!oldComment) {
      throw new NotFoundException(`comment with ID ${id} not found`);
    }

    if (oldComment.user.id == userId) {
      await this.commentRepository.update(
        { id },
        {comment}
      );
    } else {
      throw new NotFoundException(`not authorized with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
      }
    });

    if (!comment) {
      throw new NotFoundException('no matching cooment');
    }

    await this.commentRepository.delete(id);

    return id;
  }
  
}
