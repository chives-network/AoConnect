/**
 * @typedef PageInfo
 * @property {boolean} hasNextPage
 *
 * @typedef Result
 * @property {any} Output
 * @property {any[]} Messages
 * @property {any[]} Spawns
 * @property {any} [Error]
 *
 * @typedef Edge
 * @property {Result} node
 * @property {string} cursor
 *
 * @typedef Response
 * @property {PageInfo} pageInfo
 * @property {Edge[]} edges
 *
 * @typedef ReadResultsArgs
 * @property {string} process
 * @property {string} [from]
 * @property {string} [to]
 * @property {number} [limit]
 * @property {string} [sort]
 *
 * @callback ReadResults
 * @param {ReadResultsArgs} args
 * @returns {Promise<MessageResult>} result
 *
 * @returns {ReadResults}
 */
export function resultsWith(env: any): ReadResults;
export type PageInfo = {
    hasNextPage: boolean;
};
export type Result = {
    Output: any;
    Messages: any[];
    Spawns: any[];
    Error?: any;
};
export type Edge = {
    node: Result;
    cursor: string;
};
export type Response = {
    pageInfo: PageInfo;
    edges: Edge[];
};
export type ReadResultsArgs = {
    process: string;
    from?: string;
    to?: string;
    limit?: number;
    sort?: string;
};
export type ReadResults = (args: ReadResultsArgs) => Promise<MessageResult>;
