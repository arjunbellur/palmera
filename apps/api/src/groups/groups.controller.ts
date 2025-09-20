import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService, CreateGroupDto, InviteMemberDto } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Groups')
@Controller('groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  async createGroup(@Request() req, @Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.createGroup(req.user.id, createGroupDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user groups' })
  @ApiResponse({ status: 200, description: 'User groups retrieved successfully' })
  async getUserGroups(@Request() req) {
    return this.groupsService.getUserGroups(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully' })
  async getGroup(@Param('id') id: string, @Request() req) {
    return this.groupsService.getGroupById(id, req.user.id);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite member to group' })
  @ApiResponse({ status: 201, description: 'Member invited successfully' })
  async inviteMember(
    @Param('id') id: string,
    @Request() req,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return this.groupsService.inviteMember(id, req.user.id, inviteMemberDto);
  }

  @Post(':id/respond')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Respond to group invitation' })
  @ApiResponse({ status: 200, description: 'Invitation response recorded' })
  async respondToInvite(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { accept: boolean },
  ) {
    return this.groupsService.respondToInvite(id, req.user.id, body.accept);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from group' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  async removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req,
  ) {
    return this.groupsService.removeMember(id, req.user.id, userId);
  }

  @Post(':id/chat')
  @ApiOperation({ summary: 'Send message to group chat' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  async sendMessage(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { message: string },
  ) {
    return this.groupsService.sendMessage(id, req.user.id, body.message);
  }

  @Get(':id/chat')
  @ApiOperation({ summary: 'Get group chat messages' })
  @ApiResponse({ status: 200, description: 'Chat messages retrieved successfully' })
  async getGroupChat(@Param('id') id: string, @Request() req) {
    return this.groupsService.getGroupChat(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update group details' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  async updateGroup(
    @Param('id') id: string,
    @Request() req,
    @Body() updateGroupDto: Partial<CreateGroupDto>,
  ) {
    return this.groupsService.updateGroup(id, req.user.id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  async deleteGroup(@Param('id') id: string, @Request() req) {
    return this.groupsService.deleteGroup(id, req.user.id);
  }
}
