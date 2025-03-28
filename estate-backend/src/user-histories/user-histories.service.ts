import { Injectable } from '@nestjs/common';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHistory } from './entities/user-history.entity';
import { User } from 'src/users/entities/user.entity';
import { Agency } from 'src/agencies/entities/agency.entity';
import { SearchUserHistoriesDto } from './dto/search-user-history.dto';

@Injectable()
export class UserHistoriesService {
  constructor(
    @InjectRepository(UserHistory)
    private readonly userHistoryRepository: Repository<UserHistory>,
  ) { }
  create(createUserHistoryDto: CreateUserHistoryDto) {
    return 'This action adds a new userHistory';
  }

  async logHistory(params: {
    currentUser: User,
    currentAgency: Agency,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    tableName: string,
    recordId: number,
    oldData?: any,
    newData?: any,
    field?: string,
  }) {
    await this.userHistoryRepository.save({
      user: params.currentUser,
      agency: params.currentAgency,
      action: params.action,
      tableName: params.tableName,
      recordId: params.recordId,
      oldData: params.oldData,
      newData: params.newData,
      field: params.field ?? null,
    });
  }

  async userActivityInLast30Days(userId: number) {
    return this.userHistoryRepository
      .createQueryBuilder('history')
      .select('history.tableName', 'tableName')
      .addSelect('history.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('history.user.id = :userId', { userId })
      .andWhere('history.createdAt >= NOW() - INTERVAL \'30 days\'')
      .groupBy('history.tableName')
      .addGroupBy('history.action')
      .orderBy('history.tableName', 'ASC')
      .addOrderBy('history.action', 'ASC')
      .getRawMany();
  }

  async searchHistories(searchDto: SearchUserHistoriesDto, agencyId: number) {
    const {
      tableName,
      userId,
      userHistoryDateStartRange,
      userHistoryDateEndRange,
      limit,
      action
    } = searchDto;

    console.log('searchDto', searchDto);

    const query = this.userHistoryRepository.createQueryBuilder('history').leftJoinAndSelect('history.user', 'user')


    if (agencyId) {
      query.andWhere('history.agency.id = :agencyId', { agencyId });
    }

    if (tableName) {
      query.andWhere('history.tableName = :tableName', { tableName });
    }

    if (action) {
      query.andWhere('history.action = :action', { action });
    }


    if (userId) {
      query.andWhere('history.user.id = :userId', { userId });
    }

    if (userHistoryDateStartRange) {
      query.andWhere('history.createdAt >= :startDate', {
        startDate: userHistoryDateStartRange,
      });
    }

    if (userHistoryDateEndRange) {
      query.andWhere('history.createdAt <= :endDate', {
        endDate: userHistoryDateEndRange,
      });
    }

    query.orderBy('history.createdAt', 'DESC');

    if (limit) {
      query.limit(limit);
    }

    return query.getMany();
  }




  async findAll() {
    return await this.userHistoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} userHistory`;
  }

  update(id: number, updateUserHistoryDto: UpdateUserHistoryDto) {
    return `This action updates a #${id} userHistory`;
  }

  remove(id: number) {
    return this.userHistoryRepository.delete(id);
  }





}
