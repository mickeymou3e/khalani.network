/* eslint-disable @typescript-eslint/no-empty-function */
import { Price, Findable, TokenPrices } from '@/types';
import { wrappedTokensMap as aaveWrappedMap } from '../token-yields/tokens/aave';
import axios from 'axios';
import { logger } from '@/logger';

// Conscious choice for a deferred promise since we have setTimeout that returns a promise
// Some reference for history buffs: https://github.com/petkaantonov/bluebird/wiki/Promise-anti-patterns
interface PromisedTokenPrices {
  promise: Promise<TokenPrices>;
  resolve: (value: TokenPrices) => void;
  reject: (reason: unknown) => void;
}

const makePromise = (): PromisedTokenPrices => {
  let resolve: (value: TokenPrices) => void = () => {};
  let reject: (reason: unknown) => void = () => {};
  const promise = new Promise<TokenPrices>((res, rej) => {
    [resolve, reject] = [res, rej];
  });
  return { promise, reject, resolve };
};

/**
 * Simple coingecko price source implementation. Configurable by network and token addresses.
 */
export class CoingeckoPriceRepository implements Findable<Price> {
  prices: TokenPrices = {};
  urlBase: string;
  baseTokenAddresses: string[];

  // Properties used for deferring API calls
  // TODO: move this logic to hooks
  requestedAddresses = new Set<string>(); // Accumulates requested addresses
  debounceWait = 200; // Debouncing waiting time [ms]
  promisedCalls: PromisedTokenPrices[] = []; // When requesting a price we return a deferred promise
  promisedCount = 0; // New request coming when setTimeout is executing will make a new promise
  timeout?: ReturnType<typeof setTimeout>;
  debounceCancel = (): void => {}; // Allow to cancel mid-flight requests

  constructor(tokenAddresses: string[], chainId = 1) {
    this.baseTokenAddresses = tokenAddresses
      .map((a) => a.toLowerCase())
      .map((a) => unwrapToken(a));
    this.urlBase = `https://api.coingecko.com/api/v3/simple/token_price/${this.platform(
      chainId
    )}?vs_currencies=usd,eth`;
  }

  private fetch(
    addresses: string[],
    { signal }: { signal?: AbortSignal } = {}
  ): Promise<TokenPrices> {
    logger.profile(`fetching coingecko for ${addresses.length} tokens`, {
      level: 'debug',
    });

    return axios
      .get<TokenPrices>(this.url(addresses), { signal })
      .then(({ data }) => {
        return data;
      })
      .finally(() => {
        logger.profile(`fetching coingecko for ${addresses.length} tokens`, {
          level: 'debug',
        });
      });
  }

  private debouncedFetch(): Promise<TokenPrices> {
    if (!this.promisedCalls[this.promisedCount]) {
      this.promisedCalls[this.promisedCount] = makePromise();
    }

    const { promise, resolve, reject } = this.promisedCalls[this.promisedCount];

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.promisedCount++; // any new call will get a new promise
      this.fetch([...this.requestedAddresses])
        .then((results) => {
          resolve(results);
          this.debounceCancel = () => {};
        })
        .catch((reason) => {
          logger.error(reason);
        });
    }, this.debounceWait);

    this.debounceCancel = () => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      reject('Cancelled');
      delete this.promisedCalls[this.promisedCount];
    };

    return promise;
  }

  async find(address: string): Promise<Price | undefined> {
    const lowercaseAddress = address.toLowerCase();
    const unwrapped = unwrapToken(lowercaseAddress);
    if (!this.prices[unwrapped]) {
      try {
        let init = false;
        if (Object.keys(this.prices).length === 0) {
          // Make initial call with all the tokens we want to preload
          this.baseTokenAddresses.forEach(
            this.requestedAddresses.add.bind(this.requestedAddresses)
          );
          init = true;
        }
        this.requestedAddresses.add(unwrapped);
        const promised = await this.debouncedFetch();
        this.prices[unwrapped] = promised[unwrapped];
        this.requestedAddresses.delete(unwrapped);
        if (init) {
          this.baseTokenAddresses.forEach((a) => {
            this.prices[a] = promised[a];
            this.requestedAddresses.delete(a);
          });
        }
      } catch (error) {
        logger.error(error);
      }
    }

    return this.prices[unwrapped];
  }

  async findBy(attribute: string, value: string): Promise<Price | undefined> {
    if (attribute != 'address') {
      return undefined;
    }

    return this.find(value);
  }

  private platform(chainId: number): string {
    switch (chainId) {
      case 1:
      case 42:
      case 31337:
        return 'ethereum';
      case 137:
        return 'polygon-pos';
      case 42161:
        return 'arbitrum-one';
    }

    return '2';
  }

  private url(addresses: string[]): string {
    return `${this.urlBase}&contract_addresses=${addresses.join(',')}`;
  }
}

const unwrapToken = (wrappedAddress: string) => {
  const lowercase = wrappedAddress.toLocaleLowerCase();

  if (Object.keys(aaveWrappedMap).includes(lowercase)) {
    return aaveWrappedMap[lowercase as keyof typeof aaveWrappedMap].aToken;
  } else {
    return lowercase;
  }
};
