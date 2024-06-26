var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.common.js
import { connect as schedulerUtilsConnect } from "@permaweb/ao-scheduler-utils";

// node_modules/hyper-async/dist/index.js
var Async = (fork) => ({
  fork,
  toPromise: () => new Promise((resolve, reject2) => fork(reject2, resolve)),
  map: (fn) => Async((rej, res) => fork(rej, (x) => res(fn(x)))),
  bimap: (f, g) => Async(
    (rej, res) => fork(
      (x) => rej(f(x)),
      (x) => res(g(x))
    )
  ),
  chain: (fn) => Async((rej, res) => fork(rej, (x) => fn(x).fork(rej, res))),
  bichain: (f, g) => Async(
    (rej, res) => fork(
      (x) => f(x).fork(rej, res),
      (x) => g(x).fork(rej, res)
    )
  ),
  fold: (f, g) => Async(
    (rej, res) => fork(
      (x) => f(x).fork(rej, res),
      (x) => g(x).fork(rej, res)
    )
  )
});
var of = (x) => Async((rej, res) => res(x));
var Resolved = (x) => Async((rej, res) => res(x));
var Rejected = (x) => Async((rej, res) => rej(x));
var fromPromise = (f) => (...args) => Async(
  (rej, res) => f(...args).then(res).catch(rej)
);

// src/client/ao-mu.js
function deployMessageWith({ fetch: fetch2, MU_URL: MU_URL2, logger: _logger }) {
  const logger = _logger.child("deployMessage");
  return (args) => {
    return of(args).chain(
      fromPromise(({ processId, data, tags, anchor, signer }) => (
        /**
         * The processId is the target set on the data item
         * See https://specs.g8way.io/?tx=xwOgX-MmqN5_-Ny_zNu2A8o-PnTGsoRb_3FrtiMAkuw
         */
        signer({ data, tags, target: processId, anchor })
      ))
    ).chain(
      (signedDataItem) => of(signedDataItem).chain(fromPromise(
        async (signedDataItem2) => fetch2(
          MU_URL2,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              Accept: "application/json"
            },
            redirect: "follow",
            body: signedDataItem2.raw
          }
        )
      )).bichain(
        (err) => Rejected(new Error(`Error while communicating with MU: ${JSON.stringify(err)}`)),
        fromPromise(
          async (res) => {
            if (res.ok)
              return res.json();
            throw new Error(`${res.status}: ${await res.text()}`);
          }
        )
      ).bimap(
        logger.tap("Error encountered when writing message via MU"),
        logger.tap("Successfully wrote message via MU")
      ).map((res) => ({ res, messageId: signedDataItem.id }))
    ).toPromise();
  };
}
function deployProcessWith({ fetch: fetch2, MU_URL: MU_URL2, logger: _logger }) {
  const logger = _logger.child("deployProcess");
  return (args) => {
    return of(args).chain(fromPromise(({ data, tags, signer }) => signer({ data, tags }))).chain(
      (signedDataItem) => of(signedDataItem).chain(fromPromise(
        async (signedDataItem2) => fetch2(
          MU_URL2,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              Accept: "application/json"
            },
            redirect: "follow",
            body: signedDataItem2.raw
          }
        )
      )).bichain(
        (err) => Rejected(new Error(`Error while communicating with MU: ${JSON.stringify(err)}`)),
        fromPromise(
          async (res) => {
            if (res.ok)
              return res.json();
            throw new Error(`${res.status}: ${await res.text()}`);
          }
        )
      ).bimap(
        logger.tap("Error encountered when deploying process via MU"),
        logger.tap("Successfully deployed process via MU")
      ).map((res) => ({ res, processId: signedDataItem.id }))
    ).toPromise();
  };
}
function deployMonitorWith({ fetch: fetch2, MU_URL: MU_URL2, logger: _logger }) {
  const logger = _logger.child("deployMonitor");
  return (args) => of(args).chain(
    fromPromise(({ processId, data, tags, anchor, signer }) => (
      /**
       * The processId is the target set on the data item
       */
      signer({ data, tags, target: processId, anchor })
    ))
  ).chain(
    (signedDataItem) => of(signedDataItem).chain(fromPromise(
      async (signedDataItem2) => fetch2(
        MU_URL2 + "/monitor/" + args.processId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            Accept: "application/json"
          },
          redirect: "follow",
          body: signedDataItem2.raw
        }
      )
    )).bichain(
      (err) => Rejected(new Error(`Error while communicating with MU: ${JSON.stringify(err)}`)),
      fromPromise(
        async (res) => {
          if (res.ok)
            return { ok: true };
          throw new Error(`${res.status}: ${await res.text()}`);
        }
      )
    ).bimap(
      logger.tap("Error encountered when subscribing to process via MU"),
      logger.tap("Successfully subscribed to process via MU")
    ).map((res) => ({ res, messageId: signedDataItem.id }))
  ).toPromise();
}
function deployUnmonitorWith({ fetch: fetch2, MU_URL: MU_URL2, logger: _logger }) {
  const logger = _logger.child("deployUnmonitor");
  return (args) => of(args).chain(
    fromPromise(({ processId, data, tags, anchor, signer }) => (
      /**
       * The processId is the target set on the data item
       */
      signer({ data, tags, target: processId, anchor })
    ))
  ).chain(
    (signedDataItem) => of(signedDataItem).chain(fromPromise(
      async (signedDataItem2) => fetch2(
        MU_URL2 + "/monitor/" + args.processId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/octet-stream",
            Accept: "application/json"
          },
          redirect: "follow",
          body: signedDataItem2.raw
        }
      )
    )).bichain(
      (err) => Rejected(new Error(`Error while communicating with MU: ${JSON.stringify(err)}`)),
      fromPromise(
        async (res) => {
          if (res.ok)
            return { ok: true };
          throw new Error(`${res.status}: ${await res.text()}`);
        }
      )
    ).bimap(
      logger.tap("Error encountered when unsubscribing to process via MU"),
      logger.tap("Successfully unsubscribed to process via MU")
    ).map((res) => ({ res, messageId: signedDataItem.id }))
  ).toPromise();
}
function deployAssignWith({ fetch: fetch2, MU_URL: MU_URL2, logger: _logger }) {
  const logger = _logger.child("deployAssign");
  return (args) => {
    return of(args).chain(fromPromise(
      async ({ process: process2, message: message2, baseLayer, exclude }) => fetch2(
        `${MU_URL2}?process-id=${process2}&assign=${message2}${baseLayer ? "&base-layer" : ""}${exclude ? "&exclude=" + exclude.join(",") : ""}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            Accept: "application/json"
          }
        }
      )
    )).bichain(
      (err) => Rejected(new Error(`Error while communicating with MU: ${JSON.stringify(err)}`)),
      fromPromise(
        async (res) => {
          if (res.ok)
            return res.json();
          throw new Error(`${res.status}: ${await res.text()}`);
        }
      )
    ).bimap(
      logger.tap("Error encountered when writing assignment via MU"),
      logger.tap("Successfully wrote assignment via MU")
    ).map((res) => ({ res, assignmentId: res.id })).toPromise();
  };
}

// src/client/ao-cu.js
function dryrunFetchWith({ fetch: fetch2, CU_URL: CU_URL2, logger }) {
  return (msg) => of(msg).map(logger.tap("posting dryrun request to CU")).chain(fromPromise((msg2) => fetch2(`${CU_URL2}/dry-run?process-id=${msg2.Target}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    redirect: "follow",
    body: JSON.stringify(msg2)
  }).then((res) => res.json()))).toPromise();
}
function loadResultWith({ fetch: fetch2, CU_URL: CU_URL2, logger }) {
  return ({ id, processId }) => {
    return of(`${CU_URL2}/result/${id}?process-id=${processId}`).map(logger.tap("fetching message result from CU")).chain(fromPromise(
      async (url) => fetch2(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        redirect: "follow"
      }).then((res) => res.json())
    )).toPromise();
  };
}
function queryResultsWith({ fetch: fetch2, CU_URL: CU_URL2, logger }) {
  return ({ process: process2, from, to, sort, limit }) => {
    const target = new URL(`${CU_URL2}/results/${process2}`);
    const params = new URLSearchParams(target.search);
    if (from) {
      params.append("from", from);
    }
    if (to) {
      params.append("to", to);
    }
    if (sort) {
      params.append("sort", sort);
    }
    if (limit) {
      params.append("limit", limit);
    }
    target.search = params;
    return of(target.toString()).map(logger.tap("fetching message result from CU")).chain(fromPromise(
      async (url) => fetch2(url, {
        method: "GET",
        headers: {
          Accept: "application/json"
        },
        redirect: "follow"
      }).then((res) => res.json())
    )).toPromise();
  };
}

// src/client/ao-su.js
import LruMap from "mnemonist/lru-map.js";
var processMetaCache;
var createProcessMetaCache = ({ MAX_SIZE }) => {
  if (processMetaCache)
    return processMetaCache;
  processMetaCache = new LruMap(MAX_SIZE);
  return processMetaCache;
};
var loadProcessMetaWith = ({ logger, fetch: fetch2, cache = processMetaCache }) => {
  return async ({ suUrl, processId }) => {
    if (cache.has(processId))
      return cache.get(processId);
    return fetch2(`${suUrl}/processes/${processId}`, { method: "GET", redirect: "follow" }).then(async (res) => {
      if (res.ok)
        return res.json();
      logger("Error Encountered when fetching process meta from SU '%s' for process '%s'", suUrl, processId);
      throw new Error(`Encountered Error fetching scheduled messages from Scheduler Unit: ${res.status}: ${await res.text()}`);
    }).then((meta) => {
      logger("Caching process meta for process '%s'", processId);
      cache.set(processId, { tags: meta.tags });
      return meta;
    });
  };
};

// src/client/gateway.js
import { path } from "ramda";
import { z } from "zod";
function loadTransactionMetaWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2, logger }) {
  const GET_TRANSACTIONS_QUERY = `
    query GetTransactions ($transactionIds: [ID!]!) {
      transactions(ids: $transactionIds) {
        edges {
          node {
            owner {
              address
            }
            tags {
              name
              value
            }
            block {
              id
              height
              timestamp
            }
          }
        }
      }
    }`;
  const transactionConnectionSchema = z.object({
    data: z.object({
      transactions: z.object({
        edges: z.array(z.object({
          node: z.record(z.any())
        }))
      })
    })
  });
  return (id) => of(id).chain(fromPromise(
    (id2) => fetch2(GRAPHQL_URL2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_TRANSACTIONS_QUERY,
        variables: { transactionIds: [id2] }
      })
    }).then(async (res) => {
      if (res.ok)
        return res.json();
      logger('Error Encountered when querying gateway for transaction "%s"', id2);
      throw new Error(`${res.status}: ${await res.text()}`);
    }).then(transactionConnectionSchema.parse).then(path(["data", "transactions", "edges", "0", "node"]))
  )).toPromise();
}

// src/logger.js
import debug from "debug";
import { tap } from "ramda";
var createLogger = (name = "@permaweb/aoconnect") => {
  const logger = debug(name);
  logger.child = (name2) => createLogger(`${logger.namespace}:${name2}`);
  logger.tap = (note, ...rest) => tap((...args) => logger(note, ...rest, ...args));
  return logger;
};

// src/lib/result/index.js
import { identity } from "ramda";

// src/lib/utils.js
import {
  F,
  T,
  __,
  allPass,
  always,
  append,
  assoc,
  chain,
  concat,
  cond,
  defaultTo,
  equals,
  has,
  ifElse,
  includes,
  is,
  join,
  map,
  pipe,
  propEq,
  propOr,
  reduce,
  reject
} from "ramda";
import { ZodError, ZodIssueCode } from "zod";
var joinUrl = ({ url, path: path2 }) => {
  if (!path2)
    return url;
  if (path2.startsWith("/"))
    return joinUrl({ url, path: path2.slice(1) });
  url = new URL(url);
  url.pathname += path2;
  return url.toString();
};
function parseTags(rawTags) {
  return pipe(
    defaultTo([]),
    reduce(
      (map2, tag) => pipe(
        // [value, value, ...] || []
        propOr([], tag.name),
        // [value]
        append(tag.value),
        // { [name]: [value, value, ...] }
        assoc(tag.name, __, map2)
      )(map2),
      {}
    ),
    /**
    * If the field is only a singly list, then extract the one value.
    *
    * Otherwise, keep the value as a list.
    */
    map((values) => values.length > 1 ? values : values[0])
  )(rawTags);
}
function removeTagsByNameMaybeValue(name, value) {
  return (tags) => reject(
    allPass([
      propEq(name, "name"),
      ifElse(
        always(value),
        propEq(value, "value"),
        T
      )
    ]),
    tags
  );
}
function eqOrIncludes(val) {
  return cond([
    [is(String), equals(val)],
    [is(Array), includes(val)],
    [T, F]
  ]);
}
function errFrom(err) {
  let e;
  if (is(ZodError, err)) {
    e = new Error(mapZodErr(err));
    e.stack += err.stack;
  } else if (is(Error, err)) {
    e = err;
  } else if (has("message", err)) {
    e = new Error(err.message);
  } else if (is(String, err)) {
    e = new Error(err);
  } else {
    e = new Error("An error occurred");
  }
  return e;
}
function mapZodErr(zodErr) {
  return pipe(
    (zodErr2) => (
      /**
       * Take a ZodError and flatten it's issues into a single depth array
       */
      function gatherZodIssues(zodErr3, status, contextCode) {
        return reduce(
          (issues, issue) => pipe(
            cond([
              /**
               * These issue codes indicate nested ZodErrors, so we resursively gather those
               * See https://github.com/colinhacks/zod/blob/HEAD/ERROR_HANDLING.md#zodissuecode
               */
              [
                equals(ZodIssueCode.invalid_arguments),
                () => gatherZodIssues(issue.argumentsError, 422, "Invalid Arguments")
              ],
              [
                equals(ZodIssueCode.invalid_return_type),
                () => gatherZodIssues(issue.returnTypeError, 500, "Invalid Return")
              ],
              [
                equals(ZodIssueCode.invalid_union),
                // An array of ZodErrors, so map over and flatten them all
                () => chain((i) => gatherZodIssues(i, 400, "Invalid Union"), issue.unionErrors)
              ],
              [T, () => [{ ...issue, status, contextCode }]]
            ]),
            concat(issues)
          )(issue.code),
          [],
          zodErr3.issues
        );
      }(zodErr2, 400, "")
    ),
    /**
     * combine all zod issues into a list of { message, status }
     * summaries of each issue
     */
    (zodIssues) => reduce(
      (acc, zodIssue) => {
        const { message: message2, path: _path, contextCode: _contextCode } = zodIssue;
        const path2 = _path[1] || _path[0];
        const contextCode = _contextCode ? `${_contextCode} ` : "";
        acc.push(`${contextCode}'${path2}': ${message2}.`);
        return acc;
      },
      [],
      zodIssues
    ),
    join(" | ")
  )(zodErr);
}

// src/lib/result/verify-input.js
import { z as z2 } from "zod";
var inputSchema = z2.object({
  id: z2.string().min(1, { message: "message is required to be a message id" }),
  processId: z2.string().min(1, { message: "process is required to be a process id" })
});
function verifyInputWith() {
  return (ctx) => {
    return of(ctx).map(inputSchema.parse).map(() => ctx);
  };
}

// src/dal.js
import { z as z3 } from "zod";
var tagSchema = z3.object({
  name: z3.string(),
  value: z3.string()
});
var dryrunResultSchema = z3.function().args(z3.object({
  Id: z3.string(),
  Target: z3.string(),
  Owner: z3.string(),
  Anchor: z3.string().optional(),
  Data: z3.any().default("1234"),
  Tags: z3.array(z3.object({ name: z3.string(), value: z3.string() }))
})).returns(z3.promise(z3.any()));
var loadResultSchema = z3.function().args(z3.object({
  id: z3.string().min(1, { message: "message id is required" }),
  processId: z3.string().min(1, { message: "process id is required" })
})).returns(z3.promise(z3.any()));
var queryResultsSchema = z3.function().args(z3.object({
  process: z3.string().min(1, { message: "process id is required" }),
  from: z3.string().optional(),
  to: z3.string().optional(),
  sort: z3.enum(["ASC", "DESC"]).default("ASC"),
  limit: z3.number().optional()
})).returns(z3.promise(z3.object({
  edges: z3.array(z3.object({
    cursor: z3.string(),
    node: z3.object({
      Output: z3.any().optional(),
      Messages: z3.array(z3.any()).optional(),
      Spawns: z3.array(z3.any()).optional(),
      Error: z3.any().optional()
    })
  }))
})));
var deployMessageSchema = z3.function().args(z3.object({
  processId: z3.string(),
  data: z3.any(),
  tags: z3.array(tagSchema),
  anchor: z3.string().optional(),
  signer: z3.any()
})).returns(z3.promise(
  z3.object({
    messageId: z3.string()
  }).passthrough()
));
var deployProcessSchema = z3.function().args(z3.object({
  data: z3.any(),
  tags: z3.array(tagSchema),
  signer: z3.any()
})).returns(z3.promise(
  z3.object({
    processId: z3.string()
  }).passthrough()
));
var deployAssignSchema = z3.function().args(z3.object({
  process: z3.string(),
  message: z3.string(),
  baseLayer: z3.boolean().optional(),
  exclude: z3.array(z3.string()).optional()
})).returns(z3.promise(
  z3.object({
    assignmentId: z3.string()
  }).passthrough()
));
var deployMonitorSchema = deployMessageSchema;
var loadProcessMetaSchema = z3.function().args(z3.object({
  suUrl: z3.string().url(),
  processId: z3.string()
})).returns(z3.promise(
  z3.object({
    tags: z3.array(tagSchema)
  }).passthrough()
));
var locateSchedulerSchema = z3.function().args(z3.string()).returns(z3.promise(
  z3.object({
    url: z3.string()
  })
));
var validateSchedulerSchema = z3.function().args(z3.string()).returns(z3.promise(z3.boolean()));
var loadTransactionMetaSchema = z3.function().args(z3.string()).returns(z3.promise(
  z3.object({
    tags: z3.array(tagSchema)
  }).passthrough()
));
var signerSchema = z3.function().args(z3.object({
  data: z3.any(),
  tags: z3.array(tagSchema),
  /**
   * target must be set with writeMessage,
   * but not for createProcess
   */
  target: z3.string().optional(),
  anchor: z3.string().optional()
})).returns(z3.promise(
  z3.object({
    id: z3.string(),
    raw: z3.any()
  })
));

// src/lib/result/read.js
function readWith({ loadResult }) {
  loadResult = fromPromise(loadResultSchema.implement(loadResult));
  return (ctx) => {
    return of({ id: ctx.id, processId: ctx.processId }).chain(loadResult);
  };
}

// src/lib/result/index.js
function resultWith(env) {
  const verifyInput = verifyInputWith(env);
  const read = readWith(env);
  return ({ message: message2, process: process2 }) => {
    return of({ id: message2, processId: process2 }).chain(verifyInput).chain(read).map(
      env.logger.tap(
        'readResult result for message "%s": %O',
        message2
      )
    ).map((result2) => result2).bimap(errFrom, identity).toPromise();
  };
}

// src/lib/message/index.js
import { identity as identity2 } from "ramda";

// src/lib/message/upload-message.js
import { z as z4 } from "zod";
import { __ as __2, always as always2, append as append2, assoc as assoc2, concat as concat2, defaultTo as defaultTo2, ifElse as ifElse2, pipe as pipe2, prop } from "ramda";
var tagSchema2 = z4.array(z4.object({
  name: z4.string(),
  value: z4.string()
}));
function buildTagsWith() {
  return (ctx) => {
    return of(ctx.tags).map(defaultTo2([])).map(removeTagsByNameMaybeValue("Data-Protocol", "ao")).map(removeTagsByNameMaybeValue("Variant")).map(removeTagsByNameMaybeValue("Type")).map(removeTagsByNameMaybeValue("SDK")).map(concat2(__2, [
      { name: "Data-Protocol", value: "ao" },
      { name: "Variant", value: "ao.TN.1" },
      { name: "Type", value: "Message" },
      { name: "SDK", value: "aoconnect" }
    ])).map(tagSchema2.parse).map(assoc2("tags", __2, ctx));
  };
}
function buildDataWith({ logger }) {
  return (ctx) => {
    return of(ctx).chain(ifElse2(
      always2(ctx.data),
      /**
       * data is provided as input, so do nothing
       */
      () => Resolved(ctx),
      /**
       * Just generate a random value for data
       */
      () => Resolved(Math.random().toString().slice(-4)).map(assoc2("data", __2, ctx)).map(
        (ctx2) => pipe2(
          prop("tags"),
          removeTagsByNameMaybeValue("Content-Type"),
          append2({ name: "Content-Type", value: "text/plain" }),
          assoc2("tags", __2, ctx2)
        )(ctx2)
      ).map(logger.tap('added pseudo-random string as message "data"'))
    ));
  };
}
function uploadMessageWith(env) {
  const buildTags = buildTagsWith(env);
  const buildData = buildDataWith(env);
  const deployMessage = deployMessageSchema.implement(env.deployMessage);
  return (ctx) => {
    return of(ctx).chain(buildTags).chain(buildData).chain(fromPromise(
      ({ id, data, tags, anchor, signer }) => deployMessage({ processId: id, data, tags, anchor, signer: signerSchema.implement(signer) })
    )).map((res) => assoc2("messageId", res.messageId, ctx));
  };
}

// src/lib/message/index.js
function messageWith(env) {
  const uploadMessage = uploadMessageWith(env);
  return ({ process: process2, data, tags, anchor, signer }) => {
    return of({ id: process2, data, tags, anchor, signer }).chain(uploadMessage).map((ctx) => ctx.messageId).bimap(errFrom, identity2).toPromise();
  };
}

// src/lib/spawn/index.js
import { identity as identity3 } from "ramda";

// src/lib/spawn/verify-inputs.js
import { isNotNil, prop as prop2 } from "ramda";
var checkTag = (name, pred, err) => (tags) => pred(tags[name]) ? Resolved(tags) : Rejected(`Tag '${name}': ${err}`);
function verifyModuleWith({ loadTransactionMeta, logger }) {
  loadTransactionMeta = fromPromise(loadTransactionMetaSchema.implement(loadTransactionMeta));
  return (module) => of(module).chain(loadTransactionMeta).map(prop2("tags")).map(parseTags).chain(checkTag("Data-Protocol", eqOrIncludes("ao"), "value 'ao' was not found on module")).chain(checkTag("Type", eqOrIncludes("Module"), "value 'Module' was not found on module")).chain(checkTag("Module-Format", isNotNil, "was not found on module")).chain(checkTag("Input-Encoding", isNotNil, "was not found on module")).chain(checkTag("Output-Encoding", isNotNil, "was not found on module")).bimap(
    logger.tap("Verifying module source failed: %s"),
    logger.tap("Verified module source")
  );
}
function verifySchedulerWith({ logger, validateScheduler }) {
  validateScheduler = fromPromise(validateSchedulerSchema.implement(validateScheduler));
  return (scheduler) => of(scheduler).chain(
    (scheduler2) => validateScheduler(scheduler2).chain((isValid) => isValid ? Resolved(scheduler2) : Rejected(`Valid Scheduler-Location owned by ${scheduler2} not found`))
  ).bimap(
    logger.tap("Verifying scheduler failed: %s"),
    logger.tap("Verified scheduler")
  );
}
function verifySignerWith({ logger }) {
  return (signer) => of(signer).map(logger.tap("Checking for signer")).chain((signer2) => signer2 ? Resolved(signer2) : Rejected("signer not found"));
}
function verifyInputsWith(env) {
  const logger = env.logger.child("verifyInput");
  env = { ...env, logger };
  const verifyModule = verifyModuleWith(env);
  const verifyScheduler = verifySchedulerWith(env);
  const verifySigner = verifySignerWith(env);
  return (ctx) => {
    return of(ctx).chain((ctx2) => verifyModule(ctx2.module).map(() => ctx2)).chain((ctx2) => verifyScheduler(ctx2.scheduler)).map(() => ctx).chain((ctx2) => verifySigner(ctx2.signer).map(() => ctx2)).bimap(
      logger.tap("Error when verify input: %s"),
      logger.tap("Successfully verified inputs")
    );
  };
}

// src/lib/spawn/upload-process.js
import { z as z5 } from "zod";
import { __ as __3, always as always3, append as append3, assoc as assoc3, concat as concat3, defaultTo as defaultTo3, ifElse as ifElse3, pipe as pipe3, prop as prop3 } from "ramda";
var tagSchema3 = z5.array(z5.object({
  name: z5.string(),
  value: z5.string()
}));
function buildTagsWith2() {
  return (ctx) => {
    return of(ctx).map(prop3("tags")).map(defaultTo3([])).map(removeTagsByNameMaybeValue("Data-Protocol", "ao")).map(removeTagsByNameMaybeValue("Variant")).map(removeTagsByNameMaybeValue("Type")).map(removeTagsByNameMaybeValue("Module")).map(removeTagsByNameMaybeValue("Scheduler")).map(removeTagsByNameMaybeValue("SDK")).map(concat3(__3, [
      { name: "Data-Protocol", value: "ao" },
      { name: "Variant", value: "ao.TN.1" },
      { name: "Type", value: "Process" },
      { name: "Module", value: ctx.module },
      { name: "Scheduler", value: ctx.scheduler },
      { name: "SDK", value: "aoconnect" }
    ])).map(tagSchema3.parse).map(assoc3("tags", __3, ctx));
  };
}
function buildDataWith2({ logger }) {
  return (ctx) => {
    return of(ctx).chain(ifElse3(
      always3(ctx.data),
      /**
       * data is provided as input, so do nothing
       */
      () => Resolved(ctx),
      /**
       * Just generate a random value for data
       */
      () => Resolved(Math.random().toString().slice(-4)).map(assoc3("data", __3, ctx)).map(
        (ctx2) => pipe3(
          prop3("tags"),
          removeTagsByNameMaybeValue("Content-Type"),
          append3({ name: "Content-Type", value: "text/plain" }),
          assoc3("tags", __3, ctx2)
        )(ctx2)
      ).map(logger.tap('added pseudo-random string as process "data"'))
    ));
  };
}
function uploadProcessWith(env) {
  const logger = env.logger.child("uploadProcess");
  env = { ...env, logger };
  const buildTags = buildTagsWith2(env);
  const buildData = buildDataWith2(env);
  const deployProcess = deployProcessSchema.implement(env.deployProcess);
  return (ctx) => {
    return of(ctx).chain(buildTags).chain(buildData).chain(fromPromise(
      ({ data, tags, signer }) => deployProcess({ data, tags, signer: signerSchema.implement(signer) })
    )).map((res) => assoc3("processId", res.processId, ctx));
  };
}

// src/lib/spawn/index.js
function spawnWith(env) {
  const verifyInputs = verifyInputsWith(env);
  const uploadProcess = uploadProcessWith(env);
  return ({ module, scheduler, signer, tags, data }) => {
    return of({ module, scheduler, signer, tags, data }).chain(verifyInputs).chain(uploadProcess).map((ctx) => ctx.processId).bimap(errFrom, identity3).toPromise();
  };
}

// src/lib/monitor/index.js
import { identity as identity4 } from "ramda";

// src/lib/monitor/upload-monitor.js
import { assoc as assoc4 } from "ramda";
function uploadMonitorWith(env) {
  const deployMonitor = deployMonitorSchema.implement(env.deployMonitor);
  return (ctx) => {
    return of(ctx).chain(fromPromise(
      ({ id, signer }) => deployMonitor({
        processId: id,
        signer: signerSchema.implement(signer),
        /**
         * No tags or data can be provided right now,
         *
         * so just randomize data and set tags to an empty array
         */
        data: Math.random().toString().slice(-4),
        tags: []
      })
    )).map((res) => assoc4("monitorId", res.messageId, ctx));
  };
}

// src/lib/monitor/index.js
function monitorWith(env) {
  const uploadMonitor = uploadMonitorWith(env);
  return ({ process: process2, signer }) => of({ id: process2, signer }).chain(uploadMonitor).map((ctx) => ctx.monitorId).bimap(errFrom, identity4).toPromise();
}

// src/lib/unmonitor/index.js
import { identity as identity5 } from "ramda";

// src/lib/unmonitor/upload-unmonitor.js
import { assoc as assoc5 } from "ramda";
function uploadUnmonitorWith(env) {
  const deployUnmonitor = deployMonitorSchema.implement(env.deployUnmonitor);
  return (ctx) => {
    return of(ctx).chain(fromPromise(
      ({ id, signer }) => deployUnmonitor({
        processId: id,
        signer: signerSchema.implement(signer),
        /**
         * No tags or data can be provided right now,
         *
         * so just randomize data and set tags to an empty array
         */
        data: Math.random().toString().slice(-4),
        tags: []
      })
    )).map((res) => assoc5("monitorId", res.messageId, ctx));
  };
}

// src/lib/unmonitor/index.js
function unmonitorWith(env) {
  const uploadUnmonitor = uploadUnmonitorWith(env);
  return ({ process: process2, signer }) => of({ id: process2, signer }).chain(uploadUnmonitor).map((ctx) => ctx.monitorId).bimap(errFrom, identity5).toPromise();
}

// src/lib/results/index.js
import { identity as identity6 } from "ramda";

// src/lib/results/verify-input.js
import { z as z6 } from "zod";
var inputSchema2 = z6.object({
  process: z6.string().min(1, { message: "process identifier is required" }),
  from: z6.string().optional(),
  to: z6.string().optional(),
  sort: z6.enum(["ASC", "DESC"]).default("ASC"),
  limit: z6.number().optional()
});
function verifyInputWith2() {
  return (ctx) => {
    return of(ctx).map(inputSchema2.parse).map(() => ctx);
  };
}

// src/lib/results/query.js
function queryWith({ queryResults }) {
  queryResults = fromPromise(queryResultsSchema.implement(queryResults));
  return (ctx) => {
    return of({ process: ctx.process, from: ctx.from, to: ctx.to, sort: ctx.sort, limit: ctx.limit }).chain(queryResults);
  };
}

// src/lib/results/index.js
function resultsWith(env) {
  const verifyInput = verifyInputWith2(env);
  const query = queryWith(env);
  return ({ process: process2, from, to, sort, limit }) => {
    return of({ process: process2, from, to, sort, limit }).chain(verifyInput).chain(query).map(
      env.logger.tap(
        'readResults result for message "%s": %O',
        process2
      )
    ).map((result2) => result2).bimap(errFrom, identity6).toPromise();
  };
}

// src/lib/dryrun/verify-input.js
import { z as z7 } from "zod";
var inputSchema3 = z7.object({
  Id: z7.string(),
  Target: z7.string(),
  Owner: z7.string(),
  Anchor: z7.string().optional(),
  Data: z7.any().default("1234"),
  Tags: z7.array(z7.object({ name: z7.string(), value: z7.string() }))
});
function verifyInputWith3() {
  return (msg) => {
    return of(msg).map(inputSchema3.parse).map((m) => {
      m.Tags = m.Tags.concat([
        { name: "Data-Protocol", value: "ao" },
        { name: "Type", value: "Message" },
        { name: "Variant", value: "ao.TN.1" }
      ]);
      return m;
    });
  };
}

// src/lib/dryrun/run.js
function runWith({ dryrunFetch }) {
  return fromPromise(dryrunResultSchema.implement(dryrunFetch));
}

// src/lib/dryrun/index.js
function dryrunWith(env) {
  const verifyInput = verifyInputWith3(env);
  const dryrun2 = runWith(env);
  return (msg) => of(msg).map(convert).chain(verifyInput).chain(dryrun2).toPromise();
}
function convert({ process: process2, data, tags, anchor, ...rest }) {
  return {
    Id: "1234",
    Owner: "1234",
    ...rest,
    Target: process2,
    Data: data || "1234",
    Tags: tags || [],
    Anchor: anchor || "0"
  };
}

// src/lib/assign/index.js
import { identity as identity7 } from "ramda";

// src/lib/assign/send-assign.js
import { assoc as assoc6 } from "ramda";
function sendAssignWith(env) {
  const deployAssign = deployAssignSchema.implement(env.deployAssign);
  return (ctx) => {
    return of(ctx).chain(fromPromise(
      ({ process: process2, message: message2, baseLayer, exclude }) => deployAssign({ process: process2, message: message2, baseLayer, exclude })
    )).map((res) => assoc6("assignmentId", res.assignmentId, ctx));
  };
}

// src/lib/assign/index.js
function assignWith(env) {
  const sendAssign = sendAssignWith(env);
  return ({ process: process2, message: message2, baseLayer, exclude }) => {
    return of({ process: process2, message: message2, baseLayer, exclude }).chain(sendAssign).map((ctx) => ctx.assignmentId).bimap(errFrom, identity7).toPromise();
  };
}

// src/index.common.js
var DEFAULT_GATEWAY_URL = "https://arweave.net";
var DEFAULT_MU_URL = "https://mu.ao-testnet.xyz";
var DEFAULT_CU_URL = "https://cu.ao-testnet.xyz";
function connect({
  GRAPHQL_URL: GRAPHQL_URL2,
  GATEWAY_URL: GATEWAY_URL2 = DEFAULT_GATEWAY_URL,
  MU_URL: MU_URL2 = DEFAULT_MU_URL,
  CU_URL: CU_URL2 = DEFAULT_CU_URL
} = {}) {
  const logger = createLogger();
  if (!GRAPHQL_URL2)
    GRAPHQL_URL2 = joinUrl({ url: GATEWAY_URL2, path: "/graphql" });
  const { validate } = schedulerUtilsConnect({ cacheSize: 100, GRAPHQL_URL: GRAPHQL_URL2 });
  const processMetaCache2 = createProcessMetaCache({ MAX_SIZE: 25 });
  const resultLogger = logger.child("result");
  const result2 = resultWith({
    loadResult: loadResultWith({ fetch, CU_URL: CU_URL2, logger: resultLogger }),
    logger: resultLogger
  });
  const messageLogger = logger.child("message");
  const message2 = messageWith({
    loadProcessMeta: loadProcessMetaWith({
      fetch,
      cache: processMetaCache2,
      logger: messageLogger
    }),
    // locateScheduler: locate,
    deployMessage: deployMessageWith({ fetch, MU_URL: MU_URL2, logger: messageLogger }),
    logger: messageLogger
  });
  const spawnLogger = logger.child("spawn");
  const spawn2 = spawnWith({
    loadTransactionMeta: loadTransactionMetaWith({ fetch, GRAPHQL_URL: GRAPHQL_URL2, logger: spawnLogger }),
    validateScheduler: validate,
    deployProcess: deployProcessWith({ fetch, MU_URL: MU_URL2, logger: spawnLogger }),
    logger: spawnLogger
  });
  const monitorLogger = logger.child("monitor");
  const monitor2 = monitorWith({
    loadProcessMeta: loadProcessMetaWith({
      fetch,
      cache: processMetaCache2,
      logger: monitorLogger
    }),
    // locateScheduler: locate,
    deployMonitor: deployMonitorWith({ fetch, MU_URL: MU_URL2, logger: monitorLogger }),
    logger: monitorLogger
  });
  const unmonitorLogger = logger.child("unmonitor");
  const unmonitor2 = unmonitorWith({
    loadProcessMeta: loadProcessMetaWith({
      fetch,
      cache: processMetaCache2,
      logger: unmonitorLogger
    }),
    // locateScheduler: locate,
    deployUnmonitor: deployUnmonitorWith({ fetch, MU_URL: MU_URL2, logger: unmonitorLogger }),
    logger: monitorLogger
  });
  const resultsLogger = logger.child("results");
  const results2 = resultsWith({
    queryResults: queryResultsWith({ fetch, CU_URL: CU_URL2, logger: resultsLogger }),
    logger: resultsLogger
  });
  const dryrunLogger = logger.child("dryrun");
  const dryrun2 = dryrunWith({
    dryrunFetch: dryrunFetchWith({ fetch, CU_URL: CU_URL2, logger: dryrunLogger }),
    logger: dryrunLogger
  });
  const assignLogger = logger.child("assign");
  const assign2 = assignWith({
    deployAssign: deployAssignWith({
      fetch,
      MU_URL: MU_URL2,
      logger: assignLogger
    }),
    logger: messageLogger
  });
  return { result: result2, results: results2, message: message2, spawn: spawn2, monitor: monitor2, unmonitor: unmonitor2, dryrun: dryrun2, assign: assign2 };
}

// src/client/node/wallet.js
var wallet_exports = {};
__export(wallet_exports, {
  createDataItemSigner: () => createDataItemSigner
});
import * as WarpArBundles from "warp-arbundles";
var pkg = WarpArBundles.default ? WarpArBundles.default : WarpArBundles;
var { createData, ArweaveSigner } = pkg;
function createDataItemSigner(wallet) {
  const signer = async ({ data, tags, target, anchor }) => {
    const signer2 = new ArweaveSigner(wallet);
    const dataItem = createData(data, signer2, { tags, target, anchor });
    return dataItem.sign(signer2).then(async () => ({
      id: await dataItem.id,
      raw: await dataItem.getRaw()
    }));
  };
  return signer;
}

// src/index.js
var GATEWAY_URL = process.env.GATEWAY_URL || void 0;
var MU_URL = process.env.MU_URL || void 0;
var CU_URL = process.env.CU_URL || void 0;
var GRAPHQL_URL = process.env.GRAPHQL_URL || void 0;
var { result, results, message, spawn, monitor, unmonitor, dryrun, assign } = connect({ GATEWAY_URL, MU_URL, CU_URL, GRAPHQL_URL });
var createDataItemSigner2 = wallet_exports.createDataItemSigner;
export {
  assign,
  connect,
  createDataItemSigner2 as createDataItemSigner,
  dryrun,
  message,
  monitor,
  result,
  results,
  spawn,
  unmonitor
};
