import { NextRequest } from 'next/server';
import { getGoogleFundamentals } from '@/lib/google';
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const symbols = (searchParams.get('symbols') || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!symbols.length) {
    return Response.json({ error: 'symbols required' }, { status: 400 });
  }

  try {
    const fundamentals = await getGoogleFundamentals(symbols);
    return Response.json({ fundamentals });
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'failed to fetch fundamentals';
    return Response.json({ error }, { status: 502 });
  }
}
