/**
 * Build the sdk apis using the provided ao component urls. You can currently specify
 *
 * - a GATEWAY_URL
 * - a GRAPHQL_URL (defaults to GATEWAY_URL/graphql)
 * - a Messenger Unit URL
 * - a Compute Unit URL
 *
 * If any url is not provided, an SDK default will be used.
 * Invoking connect() with no parameters or an empty object is functionally equivalent
 * to using the top-lvl exports of the SDK ie.
 *
 * @example
 * import {
 *  spawn,
 *  message,
 *  result,
 *  results,
 *  monitor,
 *  connect
 * } from '@permaweb/ao-sdk';
 *
 * // These are functionally equivalent
 * connect() == { spawn, message, result, monitor }
 *
 * @typedef Services
 * @property {string} [GATEWAY_URL] - the url of the desried Gateway.
 * @property {string} [GRAPHQL_URL] - the url of the desired Arweave Gateway GraphQL Server
 * @property {string} [MU_URL] - the url of the desried ao Messenger Unit.
 * @property {string} [CU_URL] - the url of the desried ao Compute Unit.
 *
 * @param {Services} [services]
 */
export function connect({ GRAPHQL_URL, GATEWAY_URL, MU_URL, CU_URL }?: Services): {
    result: import("./lib/result/index.js").ReadResult;
    results: import("./lib/results/index.js").ReadResults;
    message: import("./lib/message/index.js").SendMessage;
    spawn: import("./lib/spawn/index.js").SpawnProcess;
    monitor: import("./lib/monitor/index.js").SendMonitor;
    unmonitor: import("./lib/unmonitor/index.js").SendMonitor;
    dryrun: import("./lib/dryrun/index.js").DryRun;
    assign: import("./lib/assign/index.js").Assign;
};
/**
 * Build the sdk apis using the provided ao component urls. You can currently specify
 *
 * - a GATEWAY_URL
 * - a GRAPHQL_URL (defaults to GATEWAY_URL/graphql)
 * - a Messenger Unit URL
 * - a Compute Unit URL
 *
 * If any url is not provided, an SDK default will be used.
 * Invoking connect() with no parameters or an empty object is functionally equivalent
 * to using the top-lvl exports of the SDK ie.
 */
export type Services = {
    /**
     * - the url of the desried Gateway.
     */
    GATEWAY_URL?: string;
    /**
     * - the url of the desired Arweave Gateway GraphQL Server
     */
    GRAPHQL_URL?: string;
    /**
     * - the url of the desried ao Messenger Unit.
     */
    MU_URL?: string;
    /**
     * - the url of the desried ao Compute Unit.
     */
    CU_URL?: string;
};
