import type { Request } from 'express';

import jwtDecode from 'jwt-decode';

interface IDecodedJwt {
  sub: string;
  username: string;
  nickname: string;
  picture: string;
}

export function decodeSubFromRequestHeader(request: Request): IDecodedJwt {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function isJwt(decodedJwt: any): decodedJwt is IDecodedJwt {
    return (
      typeof decodedJwt.sub === 'string' &&
      typeof decodedJwt.nickname === 'string' &&
      typeof decodedJwt.username === 'string' &&
      typeof decodedJwt.picture === 'string'
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    // Return a default authenticated user instead of requiring a login
    return {
      sub: 'rodrigoOpenId',
      username: 'rodrigo',
      picture: '',
      nickname: 'rodrigo',
    };
  }

  const jwt = request.header('authorization')?.split(' ')[1] ?? '';

  const decodedJwt = jwtDecode(jwt);
  if (isJwt(decodedJwt)) {
    const { sub, username, picture, nickname } = decodedJwt;

    return {
      sub,
      username,
      picture,
      nickname,
    };
  }

  throw {
    message: 'JWT is missing keys sub, username, picture and/or nickname.',
    decodedJwt,
  };
}

// create unique and deterministic event name for a conversation
export function determineEventNameFromUsernames(
  username1: string,
  username2: string
): string {
  return [username1, username2].sort().join('-');
}
