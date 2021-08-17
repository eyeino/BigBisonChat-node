import { Injectable } from '@nestjs/common';
import { getConversations } from '../database';
import { DatabaseService } from '../database/database.service';
import { Messages } from '../database/entities/Messages';
import { IFindConversationsByUserIdResult } from '../database/queries/conversations.queries';
import { IDecodedJwt } from '../util/jwt';

@Injectable()
export class ConversationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getConversations(
    userInfo: IDecodedJwt
  ): Promise<IFindConversationsByUserIdResult[] | undefined> {
    try {
      const createdUser = await this.databaseService.usersRepository.makeUser(
        userInfo.nickname,
        userInfo.sub,
        userInfo.picture
      );

      /**
       * @todo use mikro orm here instead of generated query
       */
      const conversations = await getConversations(createdUser.userId);

      return conversations;
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(
    userInfo: IDecodedJwt,
    username: string,
    offset = 0,
    limit = 20
  ): Promise<Messages[] | undefined> {
    const user = await this.databaseService.usersRepository.findOne({
      username: userInfo.nickname,
    });

    const otherUser = await this.databaseService.usersRepository.findOne({
      username,
    });

    if (user && otherUser) {
      return await this.databaseService.messagesRepository.find(
        {
          $or: [
            { sender: user.userId, recipient: otherUser.userId },
            { sender: otherUser.userId, recipient: user.userId },
          ],
        },
        { offset, limit }
      );
    }
  }

  async sendMessage(
    userInfo: IDecodedJwt,
    username: string,
    messageBody: string
  ): Promise<void> {
    try {
      const user = await this.databaseService.usersRepository.findOne({
        username: userInfo.nickname,
      });

      const otherUser = await this.databaseService.usersRepository.findOne({
        username,
      });

      if (!user || !otherUser) {
        return;
      }

      const createdMessage = this.databaseService.messagesRepository.create({
        sender: user.userId,
        recipient: otherUser.userId,
        body: messageBody,
      });

      this.databaseService.messagesRepository.persistAndFlush(createdMessage);
    } catch (error) {
      console.log(error);
    }
  }
}
