import { Repository } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Users } from '../entities/Users';

@Repository(Users)
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
    });

    this.persistAndFlush(createdUser);

    return createdUser;
  }
}
