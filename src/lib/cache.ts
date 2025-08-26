import { LRUCache } from 'lru-cache';

const options = {
    max: 200,
    ttl: 1000 * 15,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false
};

export const quotesCache = new LRUCache<string, any>(options);
export const fundamentalsCache = new LRUCache<string, any>({ ...options, ttl: 6 * 60 * 60 * 1000 });

