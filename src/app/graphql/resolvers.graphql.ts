import { getUserId, getConversation, getConversations } from '../../database';
import { decodeJwtFromAuthorizationHeader } from '../../util/jwt';

export const resolvers = {
  Query: {
    conversation: async (
      _parent: any,
      { otherUserId, offset }: { otherUserId: number; offset?: number },
      context: any
    ) => {
      const userInfo = decodeJwtFromAuthorizationHeader(
        context.req.headers.authorization
      );
      const userId = await getUserId(userInfo.nickname);

      return await getConversation(userId, otherUserId, offset);
    },
    conversations: async (_parent: any, _args: any, context: any) => {
      const userInfo = decodeJwtFromAuthorizationHeader(
        context.req.headers.authorization
      );
      const userId = await getUserId(userInfo.nickname);

      return await getConversations(userId);
    },
  },
  Subscription: {
    messageStored: {
      subscribe: () => {
        console.log('subscribed');
      },
    },
  },
};
