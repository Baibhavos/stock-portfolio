import { NextRequest } from 'next/server';
import { getYahooQuotes } from '@/lib/yahoo';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = (searchParams.get('symbols') || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!symbols.length) {
    return Response.json({ error: 'symbols required' }, { status: 400 });
  }

  try {
    const quotes = await getYahooQuotes(symbols).catch(err => console.log("err-quotes-getYahooQuotes=>", err));

    if (!quotes || Object.keys(quotes).length === 0) {
      return Response.json({ quotes: {}, warning: 'No quotes returned' }, { status: 200 });
    }
    return Response.json({ quotes });
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'failed to fetch quotes';
    return Response.json({ error }, { status: 502 });
  }
}
