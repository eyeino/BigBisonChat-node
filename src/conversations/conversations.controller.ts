import {
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { IFindConversationResult } from '../database/queries/conversation.queries';
import { IFindConversationsByUserIdResult } from '../database/queries/conversations.queries';
import { decodeJwtFromAuthorizationHeader } from '../util/jwt';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getConversations(
    @Headers('Authorization') authorization: string
  ): Promise<IFindConversationsByUserIdResult[] | undefined> {
    const userInfo = decodeJwtFromAuthorizationHeader(authorization);

    return this.conversationsService.getConversations(userInfo);
  }

  @Get('/:username')
  async getMessages(
    @Headers('Authorization') authorization: string,
    @Param('username') username: string,
    @Query('offset') offset: number
  ): Promise<IFindConversationResult[]> {
    const userInfo = decodeJwtFromAuthorizationHeader(authorization);

    return this.conversationsService.getMessages(userInfo, username, offset);
  }

  @Post('/:username')
  async sendMessage(
    @Headers('Authorization') authorization: string,
    @Body() body: { messageBody: string },
    @Param('username') username: string
  ): Promise<void> {
    const userInfo = decodeJwtFromAuthorizationHeader(authorization);

    return this.conversationsService.sendMessage(
      userInfo,
      username,
      body?.messageBody
    );
  }
}
