import { NextRequest } from 'next/server';
import { Holding, Row } from '@/lib/types';
import { toGoogleSymbol, toYahooSymbol } from '@/lib/exchange';
import { getYahooQuotes } from '@/lib/yahoo';
import { getGoogleFundamentals } from '@/lib/google';
import { attachDerived } from '@/lib/math';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const holdings = JSON.parse(body) as Holding[];
    if (!Array.isArray(holdings) || holdings.length === 0) {
      return Response.json({ error: 'holdings array required' }, { status: 400 });
    }

    const ySymbols = holdings.map(h => toYahooSymbol(h));
    const gSymbols = holdings.map(h => toGoogleSymbol(h));

    const [qres, fres] = await Promise.all([
      getYahooQuotes(ySymbols).catch((error: any) => (console.log("err-portfolio-getYahooQuotes=>", error))),
      getGoogleFundamentals(gSymbols).catch(() => ({} as any)),
    ]);

    const cmpMap: Record<string, number> = {};
    const peMap: Record<string, number | null> = {};
    const earnMap: Record<string, string | null> = {};

    for (let i = 0; i < holdings.length; i++) {
      const h = holdings[i];
      const y = ySymbols[i];
      const g = gSymbols[i];
      const q = (qres as any)?.[y];
      const f = (fres as any)?.[g];
      const key = `${h.exchange}:${h.symbol}`;
      cmpMap[key] = q?.price ?? 0;
      peMap[key] = f?.pe ?? null;
      earnMap[key] = f?.latestEarnings ?? null;
    }

    const rows: Row[] = attachDerived(holdings, cmpMap, peMap, earnMap);
    return Response.json(rows);
  } catch (e: any) {
    return Response.json({ error: e?.message || 'failed' }, { status: 500 });
  }
}
