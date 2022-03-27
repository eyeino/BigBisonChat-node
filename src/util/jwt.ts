import jwtDecode from 'jwt-decode';

export interface INamespacedDecodedJwt {
  sub: string;
  'https://chat.bigbison.co/nickname': string;
  'https://chat.bigbison.co/name': string;
  'https://chat.bigbison.co/picture': string;
}

export interface IDecodedJwt {
  sub: string;
  nickname: string;
  name: string;
  picture: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assertIsJwt(decodedJwt: any): asserts decodedJwt is INamespacedDecodedJwt {
  if (
    !(
      typeof decodedJwt['sub'] === 'string' &&
      typeof decodedJwt['https://chat.bigbison.co/nickname'] === 'string' &&
      typeof decodedJwt['https://chat.bigbison.co/name'] === 'string' &&
      typeof decodedJwt['https://chat.bigbison.co/picture'] === 'string'
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

  // Tries to parse from 'Bearer <token>' and if that
  // fails, it will assume that the <token> itself
  // was passed in.
  const jwt = authHeader.split(' ')[1] ?? authHeader;

  const decodedJwt = jwtDecode(jwt);
  assertIsJwt(decodedJwt);

  return {
    sub: decodedJwt.sub,
    name: decodedJwt['https://chat.bigbison.co/name'],
    nickname: decodedJwt['https://chat.bigbison.co/nickname'],
    picture: decodedJwt['https://chat.bigbison.co/picture'],
  };
}

// create unique and deterministic event name for a conversation
export function determineEventNameFromUsernames(
  username1: string,
  username2: string
): string {
  return [username1, username2].sort().join('-');
}
