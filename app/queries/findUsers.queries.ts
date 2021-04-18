/** Types generated for queries found in "app/queries/findUsers.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindUsersLikeUsername' parameters type */
export interface IFindUsersLikeUsernameParams {
  query: string | null | void;
}

/** 'FindUsersLikeUsername' return type */
export interface IFindUsersLikeUsernameResult {
  user_id: number;
  username: string;
}

/** 'FindUsersLikeUsername' query type */
export interface IFindUsersLikeUsernameQuery {
  params: IFindUsersLikeUsernameParams;
  result: IFindUsersLikeUsernameResult;
}

const findUsersLikeUsernameIR: any = {"name":"FindUsersLikeUsername","params":[{"name":"query","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":91,"b":95,"line":2,"col":57}]}}],"usedParamSet":{"query":true},"statement":{"body":"SELECT user_id, username FROM users WHERE username LIKE :query LIMIT 10","loc":{"a":34,"b":104,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT user_id, username FROM users WHERE username LIKE :query LIMIT 10
 * ```
 */
export const findUsersLikeUsername = new PreparedQuery<IFindUsersLikeUsernameParams,IFindUsersLikeUsernameResult>(findUsersLikeUsernameIR);


