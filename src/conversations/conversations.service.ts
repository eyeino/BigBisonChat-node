import { Injectable } from '@nestjs/common';
import { em } from '../common';
import { getConversation, getConversations, sendMessage } from '../database';
import { DatabaseService } from '../database/database.service';
import { IFindConversationResult } from '../database/queries/conversation.queries';
import { IFindConversationsByUserIdResult } from '../database/queries/conversations.queries';
import { determineEventNameFromUsernames, IDecodedJwt } from '../util/jwt';

@Injectable()
export class ConversationsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // async getConversations(
  //   userInfo: IDecodedJwt
  // ): Promise<IFindConversationsByUserIdResult[] | undefined> {
  //   try {
  //     await makeUser(userInfo.nickname, userInfo.sub, userInfo.picture);
  //     const userId = await getUserId(userInfo.nickname);
  //     const conversations = await getConversations(userId);

  //     return conversations;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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

  // async getMessages(
  //   userInfo: IDecodedJwt,
  //   username: string,
  //   offset: number
  // ): Promise<IFindConversationResult[]> {
  //   const userId = await getUserId(userInfo.nickname);

  //   const otherUserId = await getUserId(username);

  //   return await getConversation(userId, otherUserId, offset);
  // }

  async getMessages(
    userInfo: IDecodedJwt,
    username: string,
    offset: number
  ): Promise<IFindConversationResult[] | undefined> {
    const user = await this.databaseService.usersRepository.findOne({
      username: userInfo.nickname,
    });

    const otherUser = await this.databaseService.usersRepository.findOne({
      username,
    });

    if (user && otherUser) {
      /**
       * @todo use mikro orm here instead of generated query
       */
      return await getConversation(user.userId, otherUser.userId, offset);
    }
  }

  // async sendMessage(
  //   userInfo: IDecodedJwt,
  //   username: string,
  //   messageBody: string
  // ): Promise<void> {
  //   try {
  //     const userId = await getUserId(userInfo.nickname);
  //     const otherUserId = await getUserId(username);

  //     const insertedMessage = await sendMessage(
  //       userId,
  //       otherUserId,
  //       messageBody
  //     );

  //     const eventName = determineEventNameFromUsernames(
  //       userInfo.nickname,
  //       username
  //     );

  //     em.emit('post', eventName, insertedMessage);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

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

      const insertedMessage = await sendMessage(
        user.userId,
        otherUser.userId,
        messageBody
      );

      const eventName = determineEventNameFromUsernames(
        userInfo.nickname,
        username
      );

      em.emit('post', eventName, insertedMessage);
    } catch (error) {
      console.log(error);
    }
  }
}
