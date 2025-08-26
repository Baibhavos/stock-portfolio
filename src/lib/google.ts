import { fundamentalsCache } from './cache';
import { Fundamentals } from './types';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';

const limit = pLimit(4);

async function fetchOne(symbol: string): Promise<Fundamentals> {
  const url = `https://www.google.com/finance/quote/${encodeURIComponent(symbol)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) return { symbol, pe: null, latestEarnings: null };
  const html = await res.text();
  const $ = cheerio.load(html);
  const text = $('body').text();

  let pe: number | null = null;
  for (const re of [/P\/E\s*ratio\s*\(TTM\)\s*([\d\.]+)/i, /P\/E\s*ratio\s*([\d\.]+)/i, /P\/E[^\d]*([\d\.]+)/i]) {
    const m = text.match(re);
    if (m) { pe = parseFloat(m[1]); break; }
  }

  let latestEarnings: string | null = null;
  const edate = text.match(/Earnings\s*date\s*([A-Za-z]{3,9}\s+\d{1,2},\s*\d{4})/i) || text.match(/Results?\s*(?:on|date)\s*([A-Za-z]{3,9}\s+\d{1,2},\s*\d{4})/i);
  if (edate) latestEarnings = edate[1];

  return { symbol, pe, latestEarnings };
}

export async function getGoogleFundamentals(googleSymbols: string[]): Promise<Record<string, Fundamentals>> {
  const key = `gf:${googleSymbols.sort().join(',')}`;
  const cached = fundamentalsCache.get(key);
  if (cached) return cached;

  const results = await Promise.allSettled(googleSymbols.map(s => limit(() => fetchOne(s))));
  const map: Record<string, Fundamentals> = {};
  results.forEach((res, idx) => {
    const s = googleSymbols[idx];
    if (res.status === 'fulfilled') map[s] = res.value;
    else map[s] = { symbol: s, pe: null, latestEarnings: null };
  });
  fundamentalsCache.set(key, map);
  return map;
}
