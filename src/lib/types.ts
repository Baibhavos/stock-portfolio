export type Exchange = 'NSE' | 'BSE';
export type Holding = { symbol: string; exchange: Exchange; name: string; purchasePrice: number; quantity: number; sector: string; };
export type Quote = { symbol: string; price: number; currency?: string; timestamp?: number; };
export type Fundamentals = { symbol: string; pe?: number | null; latestEarnings?: string | null; };
export type Row = Holding & { investment: number; portfolioWeight: number; cmp?: number; presentValue?: number; gainLoss?: number; pe?: number | null; latestEarnings?: string | null; };
export type SectorSummary = { sector: string; totalInvestment: number; totalPresentValue: number; totalGainLoss: number; };
