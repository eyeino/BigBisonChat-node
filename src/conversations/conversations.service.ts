import { em } from '../common';
import {
  getConversation,
  getConversations,
  getUserId,
  makeUser,
  sendMessage,
} from '../database';
import { IFindConversationResult } from '../database/queries/conversation.queries';
import { IFindConversationsByUserIdResult } from '../database/queries/conversations.queries';
import { determineEventNameFromUsernames, IDecodedJwt } from '../util/jwt';

export class ConversationsService {
  async getConversations(
    userInfo: IDecodedJwt
  ): Promise<IFindConversationsByUserIdResult[] | undefined> {
    try {
      await makeUser(userInfo.nickname, userInfo.sub, userInfo.picture);
      const userId = await getUserId(userInfo.nickname);
      const conversations = await getConversations(userId);

      return conversations;
    } catch (error) {
      console.log(error);
    }
  }

  async getMessages(
    userInfo: IDecodedJwt,
    username: string,
    offset: number
  ): Promise<IFindConversationResult[]> {
    const userId = await getUserId(userInfo.nickname);

    const otherUserId = await getUserId(username);

    return await getConversation(userId, otherUserId, offset);
  }

  async sendMessage(
    userInfo: IDecodedJwt,
    username: string,
    messageBody: string
  ): Promise<void> {
    try {
      const userId = await getUserId(userInfo.nickname);
      const otherUserId = await getUserId(username);

      const insertedMessage = await sendMessage(
        userId,
        otherUserId,
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
