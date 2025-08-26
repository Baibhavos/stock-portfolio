import { LRUCache } from 'lru-cache';
import { Quote, Fundamentals } from './types';

const options = {
    max: 200,
    ttl: 1000 * 15,
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false
};

export const quotesCache = new LRUCache<string, Record<string, Quote>>(options);
export const fundamentalsCache = new LRUCache<string, Record<string, Fundamentals>>({ ...options, ttl: 6 * 60 * 60 * 1000 });

