import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Agency } from 'src/agencies/entities/agency.entity';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { UserId } from 'src/users/decorator/user-id.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // @Post()
  // create(@Body() createNotificationDto: CreateNotificationDto) {
  //   return this.notificationsService.create(createNotificationDto);
  // }

  // @Get()
  // findAll() {
  //   return this.notificationsService.findAll();
  // }

  @Get('invite')
  findByAgency(@AgencyId() agencyId: number) {
    return this.notificationsService.findByAgency(agencyId);
  }

  @Get('invited')
  findByUser(@UserId() userId: number) {
    return this.notificationsService.findByUserId(userId);
  }

  @Post('invite/:id')
  inviteUser(@Param('id') id: number, @Body() createNotificationDto: CreateNotificationDto, @AgencyId() agencyId: number) {
    return this.notificationsService.inviteUser(id, createNotificationDto, agencyId);
  }

  @Post('inviteByEmail')
  inviteUserEmail(@Body() createNotificationDto: CreateNotificationDto, @AgencyId() agencyId: number) {
    return this.notificationsService.inviteUserEmail(createNotificationDto, agencyId);
  }

  @Delete('invite/:id')
  cancelInvite(@Param('id') id: number, @UserId() userId: number) {
    return this.notificationsService.deleteInvite(id, userId);
  }

  @Patch('invite/:id/accept')
  acceptInvite(@Param('id') id: string, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notificationsService.acceptInvite(+id, updateNotificationDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.notificationsService.remove(+id);
  // }
}
