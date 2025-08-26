import { quotesCache } from './cache';
import { Quote } from './types';
import yahooFinance from 'yahoo-finance2';

export async function getYahooQuotes(yahooSymbols: string[]): Promise<Record<string, Quote>> {
  const key = `qy:${yahooSymbols.sort().join(',')}`;
  const cached = quotesCache.get(key);
  if (cached) return cached;

  const results = await yahooFinance.quote(yahooSymbols);
  const arr = Array.isArray(results) ? results : [results];
  const map: Record<string, Quote> = {};
  for (const r of arr) {
    if (!r || !r.symbol) continue;
    map[r.symbol] = {
      symbol: r.symbol,
      price: r.regularMarketPrice ?? r.postMarketPrice ?? r.preMarketPrice ?? 0,
      currency: r.currency,
      timestamp: r.regularMarketTime ? (new Date(r.regularMarketTime).getTime()) : Date.now(),
    };
  }
  quotesCache.set(key, map);
  return map;
}
