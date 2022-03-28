import { EntityRepository } from '@mikro-orm/postgresql';
import { Users } from '../entities/Users';

export class UsersRepository extends EntityRepository<Users> {
  async makeUser(
    nickname: string,
    sub: string,
    picture: string
  ): Promise<Users> {
    const createdUser = this.create({
      username: nickname,
      openIdSub: sub,
      avatarUrl: picture,
      userId: 1,
    });

    this.persistAndFlush(createdUser);

    return createdUser;
  }
}
