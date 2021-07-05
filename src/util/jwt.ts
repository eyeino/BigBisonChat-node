import type { Request } from 'express';
import { Headers } from 'jwks-rsa';

import jwtDecode from 'jwt-decode';

interface IDecodedJwt {
  sub: string;
  username: string;
  nickname: string;
  picture: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertIsJwt(decodedJwt: any): asserts decodedJwt is IDecodedJwt {
  if (
    !(
      typeof decodedJwt.sub === 'string' &&
      typeof decodedJwt.nickname === 'string' &&
      typeof decodedJwt.username === 'string' &&
      typeof decodedJwt.picture === 'string'
    )
  ) {
    throw {
      message: 'JWT is missing keys sub, username, picture and/or nickname.',
      decodedJwt,
    };
  }
}

export function decodeJwtFromAuthorizationHeader(
  authHeader: string | undefined
): IDecodedJwt {
  if (typeof authHeader === 'undefined') {
    throw {
      message: 'No auth header present.',
      authHeader,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    // Return a default authenticated user instead of
    // requiring a login when developing on local
    return {
      sub: 'rodrigo',
      username: 'rodrigo',
      picture: '',
      nickname: 'rodrigo',
    };
  }

  const jwt = authHeader.split(' ')[1] ?? '';

  const decodedJwt = jwtDecode(jwt);
  assertIsJwt(decodedJwt);

  const { sub, username, picture, nickname } = decodedJwt;

  return {
    sub,
    username,
    picture,
    nickname,
  };
}

// create unique and deterministic event name for a conversation
export function determineEventNameFromUsernames(
  username1: string,
  username2: string
): string {
  return [username1, username2].sort().join('-');
}
