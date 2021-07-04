import { getUserId, getConversation, getConversations } from '../../database';
import { decodeSubFromRequestHeader } from '../../util/jwt';

export const resolvers = {
  Query: {
    conversation: async (
      _parent: any,
      { otherUserId, offset }: { otherUserId: number; offset?: number },
      context: any
    ) => {
      const userInfo = decodeSubFromRequestHeader(context.req);
      const userId = await getUserId(userInfo.username);

      return await getConversation(userId, otherUserId, offset);
    },
    conversations: async (_parent: any, _args: any, context: any) => {
      const userInfo = decodeSubFromRequestHeader(context.req);
      const userId = await getUserId(userInfo.username);

      return await getConversations(userId);
    },
  },
  Subscription: {
    messageStored: {
      subscribe: () => {},
    },
  },
};
