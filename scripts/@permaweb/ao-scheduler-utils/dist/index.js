// src/client/gateway.js
import { defaultTo, find, juxt, path, pipe, prop, propEq } from "ramda";

// src/err.js
var InvalidSchedulerLocationError = class extends Error {
  name = "InvalidSchedulerLocation";
};
var SchedulerTagNotFoundError = class extends Error {
  name = "SchedulerTagNotFound";
};
var TransactionNotFoundError = class extends Error {
  name = "TransactionNotFound";
};

// src/client/gateway.js
var URL_TAG = "Url";
var TTL_TAG = "Time-To-Live";
var SCHEDULER_TAG = "Scheduler";
var findTagValue = (name) => pipe(
  defaultTo([]),
  find(propEq(name, "name")),
  defaultTo({}),
  prop("value")
);
var findTransactionTags = (err) => pipe(
  (transaction) => {
    if (!transaction)
      throw new TransactionNotFoundError(err);
    return transaction;
  },
  prop("tags"),
  defaultTo([])
);
function gatewayWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2 }) {
  return async ({ query, variables }) => {
    return fetch2(GRAPHQL_URL2, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables })
    }).then((res) => res.json());
  };
}
function loadProcessSchedulerWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2 }) {
  const gateway = gatewayWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2 });
  const loadScheduler = loadSchedulerWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2 });
  const GET_TRANSACTIONS_QUERY = `
    query GetTransactions ($transactionIds: [ID!]!) {
      transactions(ids: $transactionIds) {
        edges {
          node {
            tags {
              name
              value
            }
          }
        }
      }
    }
  `;
  return async (process2) => {
    return gateway({ query: GET_TRANSACTIONS_QUERY, variables: { transactionIds: [process2] } }).then(path(["data", "transactions", "edges", "0", "node"])).then(findTransactionTags(`Process ${process2} was not found on gateway`)).then(findTagValue(SCHEDULER_TAG)).then((walletAddress) => {
      if (!walletAddress)
        throw new SchedulerTagNotFoundError('No "Scheduler" tag found on process');
      return loadScheduler(walletAddress);
    });
  };
}
function loadSchedulerWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2 }) {
  const gateway = gatewayWith({ fetch: fetch2, GRAPHQL_URL: GRAPHQL_URL2 });
  const GET_SCHEDULER_LOCATION = `
    query GetSchedulerLocation ($owner: String!) {
      transactions (
        owners: [$owner]
        tags: [
          { name: "Data-Protocol", values: ["ao"] },
          { name: "Type", values: ["Scheduler-Location"] }
        ]
        # Only need the most recent Scheduler-Location
        sort: HEIGHT_DESC
        first: 1
      ) {
        edges {
          node {
            tags {
              name
              value
            }
          }
        }
      }
    }
  `;
  return async (walletAddress) => gateway({ query: GET_SCHEDULER_LOCATION, variables: { owner: walletAddress } }).then(path(["data", "transactions", "edges", "0", "node"])).then(findTransactionTags(`Could not find 'Scheduler-Location' owner by wallet ${walletAddress}`)).then(juxt([
    findTagValue(URL_TAG),
    findTagValue(TTL_TAG)
  ])).then(([url, ttl]) => {
    if (!url)
      throw new InvalidSchedulerLocationError('No "Url" tag found on Scheduler-Location');
    if (!ttl)
      throw new InvalidSchedulerLocationError('No "Time-To-Live" tag found on Scheduler-Location');
    return { url, ttl, address: walletAddress };
  });
}

// src/client/in-memory.js
import { LRUCache } from "lru-cache";
function createLruCache({ size }) {
  const cache = new LRUCache({
    /**
     * number of entries
     */
    max: size,
    /**
     * max size of cache, as a scalar.
     *
     * In our case, characters (see sizeCalculation)
     */
    maxSize: 1e6 * 5,
    /**
     * Simply stringify to get the bytes
     */
    sizeCalculation: (v) => JSON.stringify(v).length,
    allowStale: true
  });
  return cache;
}
function getByProcessWith({ cache }) {
  return async (process2) => {
    if (!cache.max)
      return;
    return cache.get(process2);
  };
}
function setByProcessWith({ cache }) {
  return async (process2, { url, address }, ttl) => {
    if (!cache.max)
      return;
    return cache.set(process2, { url, address }, { ttl });
  };
}
function getByOwnerWith({ cache }) {
  return async (owner) => {
    if (!cache.max)
      return;
    return cache.get(owner);
  };
}
function setByOwnerWith({ cache }) {
  return async (owner, url, ttl) => {
    if (!cache.max)
      return;
    return cache.set(owner, { url, address: owner, ttl }, { ttl });
  };
}

// src/client/scheduler.js
function checkForRedirectWith({ fetch: fetch2 }) {
  return async (url, process2) => {
    const response = await fetch2(`${url}?process-id=${process2}`, { method: "GET", redirect: "manual" });
    if ([301, 302, 307, 308].includes(response.status)) {
      return new URL(response.headers.get("Location")).origin;
    }
    return url;
  };
}

// src/dal.js
import { z } from "zod";
var processCacheEntry = z.object({ url: z.string(), address: z.string() });
var scheduler = z.object({ url: z.string(), address: z.string(), ttl: z.coerce.number() });
var checkForRedirectSchema = z.function().args(z.string(), z.string()).returns(z.promise(z.string()));
var getByProcessSchema = z.function().args(z.string()).returns(z.promise(processCacheEntry.nullish()));
var setByProcessSchema = z.function().args(z.string(), processCacheEntry, z.number()).returns(z.promise(z.any()));
var getByOwnerSchema = z.function().args(z.string()).returns(z.promise(scheduler.nullish()));
var setByOwnerSchema = z.function().args(z.string(), z.string(), z.number()).returns(z.promise(z.any()));
var loadSchedulerSchema = z.function().args(z.string()).returns(z.promise(scheduler));
var loadProcessSchedulerSchema = loadSchedulerSchema;

// src/locate.js
function locateWith({ loadProcessScheduler, loadScheduler, cache, followRedirects, checkForRedirect }) {
  loadProcessScheduler = loadProcessSchedulerSchema.implement(loadProcessScheduler);
  loadScheduler = loadSchedulerSchema.implement(loadScheduler);
  checkForRedirect = checkForRedirectSchema.implement(checkForRedirect);
  const getByProcess = getByProcessSchema.implement(cache.getByProcess);
  const getByOwner = getByOwnerSchema.implement(cache.getByOwner);
  const setByProcess = setByProcessSchema.implement(cache.setByProcess);
  const setByOwner = setByOwnerSchema.implement(cache.setByOwner);
  return (process2, schedulerHint) => getByProcess(process2).then(async (cached) => {
    if (cached)
      return cached;
    return Promise.resolve().then(async () => {
      if (schedulerHint) {
        const byOwner = await getByOwner(schedulerHint);
        if (byOwner)
          return byOwner;
        return loadScheduler(schedulerHint).then((scheduler2) => {
          setByOwner(scheduler2.address, scheduler2.url, scheduler2.ttl);
          return scheduler2;
        });
      }
      return loadProcessScheduler(process2);
    }).then(async (scheduler2) => {
      let finalUrl = scheduler2.url;
      if (followRedirects)
        finalUrl = await checkForRedirect(scheduler2.url, process2);
      const byProcess = { url: finalUrl, address: scheduler2.address };
      await setByProcess(process2, byProcess, scheduler2.ttl);
      return byProcess;
    });
  });
}

// src/raw.js
function rawWith({ loadScheduler, cache }) {
  loadScheduler = loadSchedulerSchema.implement(loadScheduler);
  const getByOwner = getByOwnerSchema.implement(cache.getByOwner);
  const setByOwner = setByOwnerSchema.implement(cache.setByOwner);
  return (address) => getByOwner(address).then((cached) => {
    if (cached)
      return { url: cached.url };
    return loadScheduler(address).then(
      (scheduler2) => setByOwner(address, scheduler2.url, scheduler2.ttl).then(() => ({ url: scheduler2.url }))
    ).catch((err) => {
      if (err instanceof InvalidSchedulerLocationError)
        return void 0;
      throw err;
    });
  });
}

// src/validate.js
function validateWith({ loadScheduler, cache }) {
  loadScheduler = loadSchedulerSchema.implement(loadScheduler);
  const getByOwner = getByOwnerSchema.implement(cache.getByOwner);
  const setByOwner = setByOwnerSchema.implement(cache.setByOwner);
  return (address) => getByOwner(address).then((cached) => {
    if (cached)
      return true;
    return loadScheduler(address).then((scheduler2) => setByOwner(address, scheduler2.url, scheduler2.ttl)).then(() => true).catch((err) => {
      if (err instanceof InvalidSchedulerLocationError)
        return false;
      throw err;
    });
  });
}

// src/index.common.js
var DEFAULT_GRAPHQL_URL = "https://arweave.net/graphql";
function connect({ cacheSize = 100, GRAPHQL_URL: GRAPHQL_URL2 = DEFAULT_GRAPHQL_URL, followRedirects = false } = {}) {
  const _cache = createLruCache({ size: cacheSize });
  const loadScheduler = loadSchedulerWith({ fetch, GRAPHQL_URL: GRAPHQL_URL2 });
  const cache = {
    getByProcess: getByProcessWith({ cache: _cache }),
    getByOwner: getByOwnerWith({ cache: _cache }),
    setByProcess: setByProcessWith({ cache: _cache }),
    setByOwner: setByOwnerWith({ cache: _cache })
  };
  const locate2 = locateWith({
    loadProcessScheduler: loadProcessSchedulerWith({ fetch, GRAPHQL_URL: GRAPHQL_URL2 }),
    loadScheduler,
    cache,
    followRedirects,
    checkForRedirect: checkForRedirectWith({ fetch })
  });
  const validate2 = validateWith({ loadScheduler, cache });
  const raw2 = rawWith({ loadScheduler, cache });
  return { locate: locate2, validate: validate2, raw: raw2 };
}

// src/index.js
var GRAPHQL_URL = process.env.GRAPHQL_URL || void 0;
var CACHE_SIZE = process.env.SCHEDULER_UTILS_CACHE_SIZE || void 0;
var FOLLOW_REDIRECTS = process.env.SCHEDULER_UTILS_FOLLOW_REDIRECTS === "true" || void 0;
var { locate, validate, raw } = connect({ GRAPHQL_URL, cacheSize: CACHE_SIZE, followRedirects: FOLLOW_REDIRECTS });
export {
  InvalidSchedulerLocationError,
  SchedulerTagNotFoundError,
  TransactionNotFoundError,
  connect,
  locate,
  raw,
  validate
};
