/** Types generated for queries found in "src/database/queries/findUsernameById.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'FindUsernameById' parameters type */
export interface IFindUsernameByIdParams {
  user_id: number | null | void;
}

/** 'FindUsernameById' return type */
export interface IFindUsernameByIdResult {
  username: string;
}

/** 'FindUsernameById' query type */
export interface IFindUsernameByIdQuery {
  params: IFindUsernameByIdParams;
  result: IFindUsernameByIdResult;
}

const findUsernameByIdIR: any = {"name":"FindUsernameById","params":[{"name":"user_id","transform":{"type":"scalar"},"codeRefs":{"used":[{"a":73,"b":79,"line":2,"col":44}]}}],"usedParamSet":{"user_id":true},"statement":{"body":"SELECT username FROM users WHERE user_id = :user_id","loc":{"a":29,"b":79,"line":2,"col":0}}};

/**
 * Query generated from SQL:
 * ```
 * SELECT username FROM users WHERE user_id = :user_id
 * ```
 */
export const findUsernameById = new PreparedQuery<IFindUsernameByIdParams,IFindUsernameByIdResult>(findUsernameByIdIR);


