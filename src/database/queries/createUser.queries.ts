/** Types generated for queries found in "app/queries/createUser.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  username: string | null | void;
  open_id_sub: string | null | void;
  avatar_url: string | null | void;
}

/** 'CreateUser' return type */
export type ICreateUserResult = void;

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {
  name: 'CreateUser',
  params: [
    {
      name: 'username',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 86, b: 93, line: 2, col: 63 }] },
    },
    {
      name: 'open_id_sub',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 97, b: 107, line: 2, col: 74 }] },
    },
    {
      name: 'avatar_url',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 111, b: 120, line: 2, col: 88 }] },
    },
  ],
  usedParamSet: { username: true, open_id_sub: true, avatar_url: true },
  statement: {
    body:
      'INSERT INTO users (username, open_id_sub, avatar_url) VALUES (:username, :open_id_sub, :avatar_url) ON CONFLICT DO NOTHING',
    loc: { a: 23, b: 144, line: 2, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (username, open_id_sub, avatar_url) VALUES (:username, :open_id_sub, :avatar_url) ON CONFLICT DO NOTHING
 * ```
 */
export const createUser = new PreparedQuery<
  ICreateUserParams,
  ICreateUserResult
>(createUserIR);
