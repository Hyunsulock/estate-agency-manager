import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { UserId } from 'src/users/decorator/user-id.decorator';
import { AgencyId } from 'src/agencies/decorator/agency-id.decorator';
import { RBAC } from 'src/auth/decorator/rbac.decorator';
import { Role } from 'src/users/entities/user.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }


  @RBAC(Role.admin)
  @Delete('admin/:id')
  removeAdmin(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @UserId() userId: number, @AgencyId() agencyId: number) {
    return this.commentsService.create(createCommentDto, userId, agencyId);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  // filter by user

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @UserId() userId: number) {
    return this.commentsService.update(+id, updateCommentDto, userId, );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }



}
