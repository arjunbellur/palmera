import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { GroupRole, InviteStatus } from '@prisma/client';

export interface CreateGroupDto {
  name: string;
  description?: string;
}

export interface InviteMemberDto {
  email: string;
  role?: GroupRole;
}

export interface UpdateMemberDto {
  role?: GroupRole;
  status?: InviteStatus;
}

export interface GroupChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(ownerId: string, data: CreateGroupDto) {
    const group = await this.prisma.group.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId,
        members: {
          create: {
            userId: ownerId,
            role: GroupRole.OWNER,
            status: InviteStatus.ACCEPTED,
            joinedAt: new Date(),
          },
        },
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
    });

    return group;
  }

  async getUserGroups(userId: string) {
    const groups = await this.prisma.group.findMany({
      where: {
        members: {
          some: {
            userId,
            status: InviteStatus.ACCEPTED,
          },
        },
        isActive: true,
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
        members: {
          where: { status: InviteStatus.ACCEPTED },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return groups;
  }

  async getGroupById(groupId: string, userId: string) {
    const group = await this.prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            userId,
            status: InviteStatus.ACCEPTED,
          },
        },
        isActive: true,
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
        bookings: {
          include: {
            listing: {
              select: { id: true, title: true, images: true, city: true },
            },
            contributions: {
              include: {
                user: {
                  select: { id: true, firstName: true, lastName: true },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found or you do not have access');
    }

    return group;
  }

  async inviteMember(groupId: string, inviterId: string, data: InviteMemberDto) {
    // Check if inviter is group owner or has PAYER role
    const inviterMember = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: inviterId,
        status: InviteStatus.ACCEPTED,
      },
    });

    if (!inviterMember || (inviterMember.role !== GroupRole.OWNER && inviterMember.role !== GroupRole.PAYER)) {
      throw new ForbiddenException('Only group owners and payers can invite members');
    }

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('User not found with this email');
    }

    // Check if already a member
    const existingMember = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: user.id,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a member of this group');
    }

    const member = await this.prisma.groupMember.create({
      data: {
        groupId,
        userId: user.id,
        role: data.role || GroupRole.MEMBER,
        status: InviteStatus.INVITED,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
      },
    });

    // TODO: Send invitation email/push notification

    return member;
  }

  async respondToInvite(groupId: string, userId: string, accept: boolean) {
    const member = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });

    if (!member || member.status !== InviteStatus.INVITED) {
      throw new NotFoundException('Invitation not found');
    }

    const updatedMember = await this.prisma.groupMember.update({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
      data: {
        status: accept ? InviteStatus.ACCEPTED : InviteStatus.DECLINED,
        joinedAt: accept ? new Date() : null,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
        group: {
          select: { id: true, name: true },
        },
      },
    });

    return updatedMember;
  }

  async removeMember(groupId: string, removerId: string, memberUserId: string) {
    // Check if remover is group owner
    const remover = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: removerId,
        role: GroupRole.OWNER,
        status: InviteStatus.ACCEPTED,
      },
    });

    if (!remover) {
      throw new ForbiddenException('Only group owners can remove members');
    }

    // Can't remove the owner
    if (memberUserId === removerId) {
      throw new BadRequestException('Group owner cannot be removed');
    }

    const member = await this.prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId: memberUserId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    await this.prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId: memberUserId,
        },
      },
    });

    return { success: true, message: 'Member removed from group' };
  }

  async sendMessage(groupId: string, senderId: string, message: string) {
    // Verify sender is a group member
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: senderId,
        status: InviteStatus.ACCEPTED,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }

    // Get sender info
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: { firstName: true, lastName: true },
    });

    // Get current chat thread
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { chatThread: true },
    });

    const currentChat = (group?.chatThread as GroupChatMessage[]) || [];
    
    const newMessage: GroupChatMessage = {
      id: `msg_${Date.now()}_${senderId}`,
      senderId,
      senderName: `${sender?.firstName} ${sender?.lastName}`,
      message,
      timestamp: new Date(),
    };

    const updatedChat = [...currentChat, newMessage];

    // Update group with new message
    await this.prisma.group.update({
      where: { id: groupId },
      data: {
        chatThread: updatedChat,
        updatedAt: new Date(),
      },
    });

    return newMessage;
  }

  async getGroupChat(groupId: string, userId: string) {
    // Verify user is a group member
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        status: InviteStatus.ACCEPTED,
      },
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this group');
    }

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      select: { chatThread: true },
    });

    return (group?.chatThread as GroupChatMessage[]) || [];
  }

  async updateGroup(groupId: string, userId: string, data: Partial<CreateGroupDto>) {
    // Check if user is group owner
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: GroupRole.OWNER,
        status: InviteStatus.ACCEPTED,
      },
    });

    if (!member) {
      throw new ForbiddenException('Only group owners can update group details');
    }

    const updatedGroup = await this.prisma.group.update({
      where: { id: groupId },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true, avatar: true },
            },
          },
        },
      },
    });

    return updatedGroup;
  }

  async deleteGroup(groupId: string, userId: string) {
    // Check if user is group owner
    const member = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
        role: GroupRole.OWNER,
        status: InviteStatus.ACCEPTED,
      },
    });

    if (!member) {
      throw new ForbiddenException('Only group owners can delete the group');
    }

    // Check if group has active bookings
    const activeBookings = await this.prisma.booking.count({
      where: {
        groupId,
        status: { in: ['confirmed', 'pending_payment'] },
      },
    });

    if (activeBookings > 0) {
      throw new BadRequestException('Cannot delete group with active bookings');
    }

    await this.prisma.group.update({
      where: { id: groupId },
      data: { isActive: false },
    });

    return { success: true, message: 'Group deleted successfully' };
  }
}
