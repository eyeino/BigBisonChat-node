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
    throw new TypeError('Authorization header is undefined');
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

  // Tries to parse from 'Bearer <token>' and if that
  // fails, it will assume that the <token> itself
  // was passed in.
  const jwt = authHeader.split(' ')[1] ?? authHeader;

  const decodedJwt = jwtDecode(jwt);
  assertIsJwt(decodedJwt);

  return decodedJwt;
}

// create unique and deterministic event name for a conversation
export function determineEventNameFromUsernames(
  username1: string,
  username2: string
): string {
  return [username1, username2].sort().join('-');
}
