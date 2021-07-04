/** Types generated for queries found in "app/queries/findUserId.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindUserIdByUsername' parameters type */
export interface IFindUserIdByUsernameParams {
  username: string | null | void;
}

/** 'FindUserIdByUsername' return type */
export interface IFindUserIdByUsernameResult {
  user_id: number;
}

/** 'FindUserIdByUsername' query type */
export interface IFindUserIdByUsernameQuery {
  params: IFindUserIdByUsernameParams;
  result: IFindUserIdByUsernameResult;
}

const findUserIdByUsernameIR: any = {
  name: 'FindUserIdByUsername',
  params: [
    {
      name: 'username',
      transform: { type: 'scalar' },
      codeRefs: { used: [{ a: 77, b: 84, line: 2, col: 44 }] },
    },
  ],
  usedParamSet: { username: true },
  statement: {
    body: 'SELECT user_id FROM users WHERE username = :username',
    loc: { a: 33, b: 84, line: 2, col: 0 },
  },
};

/**
 * Query generated from SQL:
 * ```
 * SELECT user_id FROM users WHERE username = :username
 * ```
 */
export const findUserIdByUsername = new PreparedQuery<
  IFindUserIdByUsernameParams,
  IFindUserIdByUsernameResult
>(findUserIdByUsernameIR);
