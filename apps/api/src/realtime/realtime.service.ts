import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { Server, Socket } from 'socket.io';

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);
  private io: Server;

  constructor(private prisma: PrismaService) {}

  initializeSocket(io: Server) {
    this.io = io;

    io.on('connection', (socket: Socket) => {
      this.logger.log(`Client connected: ${socket.id}`);

      // Join user-specific room
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user:${userId}`);
        this.logger.log(`User ${userId} joined their room`);
      });

      // Join booking-specific room
      socket.on('join-booking-room', (bookingId: string) => {
        socket.join(`booking:${bookingId}`);
        this.logger.log(`Client joined booking room: ${bookingId}`);
      });

      // Handle chat messages
      socket.on('send-message', async (data: {
        bookingId: string;
        senderId: string;
        receiverId: string;
        message: string;
      }) => {
        try {
          const chatMessage = await this.createChatMessage(data);
          
          // Emit to booking room
          io.to(`booking:${data.bookingId}`).emit('new-message', chatMessage);
          
          // Emit to receiver's user room
          io.to(`user:${data.receiverId}`).emit('new-message', chatMessage);
          
          this.logger.log(`Message sent in booking ${data.bookingId}`);
        } catch (error) {
          this.logger.error('Error sending message:', error);
          socket.emit('message-error', { error: 'Failed to send message' });
        }
      });

      // Handle booking status updates
      socket.on('booking-status-update', async (data: {
        bookingId: string;
        status: string;
        userId: string;
      }) => {
        try {
          // Update booking status in database
          await this.updateBookingStatus(data.bookingId, data.status);
          
          // Emit to booking room
          io.to(`booking:${data.bookingId}`).emit('booking-updated', {
            bookingId: data.bookingId,
            status: data.status,
            timestamp: new Date(),
          });
          
          this.logger.log(`Booking ${data.bookingId} status updated to ${data.status}`);
        } catch (error) {
          this.logger.error('Error updating booking status:', error);
          socket.emit('booking-update-error', { error: 'Failed to update booking' });
        }
      });

      // Handle typing indicators
      socket.on('typing-start', (data: { bookingId: string; userId: string }) => {
        socket.to(`booking:${data.bookingId}`).emit('user-typing', {
          userId: data.userId,
          isTyping: true,
        });
      });

      socket.on('typing-stop', (data: { bookingId: string; userId: string }) => {
        socket.to(`booking:${data.bookingId}`).emit('user-typing', {
          userId: data.userId,
          isTyping: false,
        });
      });

      socket.on('disconnect', () => {
        this.logger.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  async createChatMessage(data: {
    bookingId: string;
    senderId: string;
    receiverId: string;
    message: string;
  }): Promise<ChatMessage> {
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        bookingId: data.bookingId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.message,
        message: data.message,
        isRead: false,
      },
    });

    return {
      id: chatMessage.id,
      bookingId: chatMessage.bookingId,
      senderId: chatMessage.senderId,
      receiverId: chatMessage.receiverId,
      message: chatMessage.message,
      timestamp: chatMessage.createdAt,
      isRead: chatMessage.isRead,
    };
  }

  async updateBookingStatus(bookingId: string, status: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: status as any },
    });
  }

  async getChatHistory(bookingId: string): Promise<ChatMessage[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map(msg => ({
      id: msg.id,
      bookingId: msg.bookingId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: msg.message,
      timestamp: msg.createdAt,
      isRead: msg.isRead,
    }));
  }

  async markMessagesAsRead(bookingId: string, userId: string) {
    return this.prisma.chatMessage.updateMany({
      where: {
        bookingId,
        receiverId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  // Emit booking status update to specific users
  async emitBookingUpdate(bookingId: string, status: string, userIds: string[]) {
    if (!this.io) return;

    const updateData = {
      bookingId,
      status,
      timestamp: new Date(),
    };

    // Emit to booking room
    this.io.to(`booking:${bookingId}`).emit('booking-updated', updateData);

    // Emit to specific user rooms
    userIds.forEach(userId => {
      this.io.to(`user:${userId}`).emit('booking-updated', updateData);
    });
  }

  // Emit notification to user
  async emitNotification(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    if (!this.io) return;

    this.io.to(`user:${userId}`).emit('notification', {
      ...notification,
      timestamp: new Date(),
    });
  }
}
