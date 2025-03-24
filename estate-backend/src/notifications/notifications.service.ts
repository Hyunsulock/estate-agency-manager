import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from 'src/agencies/entities/agency.entity';
import { User } from 'src/users/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { UpdatesGateway } from 'src/updates/updates.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Agency)
    private readonly agencyRepository: Repository<Agency>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly updatesGateway: UpdatesGateway,
  ) { }



  async inviteUser(id: number, createInvitationDto: CreateNotificationDto, agencyId: number) {
    const { message } = createInvitationDto;

    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) throw new NotFoundException('Agency not found');

    const user = await this.userRepository.findOne({ where: { id: id } });

    const notification = this.notificationRepository.create({
      agency: agency,
      user: user,
      type: 'invite',
      message: message || `You have been invited to join ${agency.name}`,
    });

    const notificationSaved = await this.notificationRepository.save(notification);

    const savedNotification = await this.notificationRepository.findOne({
      where: { id: notificationSaved.id },
      relations: ['agency', 'user'],
    });

    if (savedNotification?.agency?.id) {
      this.updatesGateway.sendDataUpdate(
        savedNotification.agency.id,
        'notification',
        {
          entity: 'notification',
          data: savedNotification,
          type: 'invite',
          updatedBy: id,
        }
      );

      this.updatesGateway.sendDataUpdatePerson(
        id,
        'notification',
        {
          entity: 'notification',
          data: savedNotification,
          type: 'invite',

        }
      );
    }

    return savedNotification;
  }


  async inviteUserEmail(createInvitationDto: CreateNotificationDto, agencyId: number) {
    const { message, email } = createInvitationDto;

    console.log('email', email);

    const agency = await this.agencyRepository.findOne({ where: { id: agencyId } });
    if (!agency) throw new NotFoundException('Agency not found');

    const user = await this.userRepository.findOne({ where: { email: email } });

    const notification = this.notificationRepository.create({
      agency: agency,
      user: user,
      type: 'invite',
      message: message || `You have been invited to join ${agency.name}`,
    });

    const notificationSaved = await this.notificationRepository.save(notification);

    const savedNotification = await this.notificationRepository.findOne({
      where: { id: notificationSaved.id },
      relations: ['agency', 'user'],
    });

    if (savedNotification?.agency?.id) {
      this.updatesGateway.sendDataUpdate(
        savedNotification.agency.id,
        'notification',
        {
          entity: 'notification',
          data: savedNotification,
          type: 'invite',
          updatedBy: user.id,
        }
      );

      this.updatesGateway.sendDataUpdatePerson(
        user.id,
        'notification',
        {
          entity: 'notification',
          data: savedNotification,
          type: 'invite',

        }
      );
    }

    return savedNotification;
  }

  // create(createNotificationDto: CreateNotificationDto) {
  //   return 'This action adds a new notification';
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }


  async findByUserId(userId: number) {
    const notifications = await this.notificationRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['user', 'agency'],
    });

    return notifications;
  }

  async findByAgency(agencyId: number) {
    const notifications = await this.notificationRepository.find({
      where: {
        agency: { id: agencyId },
      },
      relations: ['user', 'agency'],
    });

    return notifications;
  }


  async deleteInvite(id: number, userId: number) {


    const notification = await this.notificationRepository.findOne({
      where: {
        id
      },
      relations: ['user', 'agency'],
    });

    if (!notification) {
      throw new NotFoundException('no matching notification');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: ['agency'],
    });

    if (user.agency) {
      const agency = await this.agencyRepository.findOne({
        where: {
          id: user.agency.id,
        },
      });

      if (agency) {
        this.updatesGateway.sendDataUpdate(
          agency.id,
          'notification',
          {
            entity: 'notification',
            data: { id: id },
            type: 'delete',
            updatedBy: userId,
          }
        );
      }
    } else {
      this.updatesGateway.sendDataUpdatePerson( // send to user
        userId, 'notification',
        { entity: 'notification', data: { id: id }, type: 'delete' }
      );  // send to user
    }

    return await this.notificationRepository.delete(id);;



  }

  async acceptInvite(id: number, updateNotificationDto: UpdateNotificationDto) {

    const notification = await this.notificationRepository.findOne({
      where: {
        id,
      },
      relations: ['user', 'agency'],
    });
    if (!notification) throw new NotFoundException('Notification not found');

    const { type, user } = notification;

    const agency = await this.agencyRepository.findOne({
      where: { id: notification.agency.id },
    });

    if (!agency) throw new NotFoundException('Agency not found');

    console.log('user', user);

    if (!user) throw new NotFoundException('User not found');

    console.log('agency', agency);

    if (type !== 'invite') throw new NotFoundException('Notification is not an invite');

    const updatedUser = await this.userRepository.update(user.id, { agency: { id: agency.id } });

    console.log('updatedUser', updateNotificationDto);

    await this.notificationRepository.update(
      { id },
      { accepted: true },
    );
    return updatedUser;

  }


}
