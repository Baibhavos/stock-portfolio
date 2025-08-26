import { Holding, Row, SectorSummary } from './types';
export const calcInvestment = (h: Holding) => h.purchasePrice * h.quantity;
export const calcPresentValue = (qty: number, cmp?: number) => (cmp ?? 0) * qty;
export const calcGainLoss = (pv: number, inv: number) => pv - inv;
export const attachDerived = (holdings: Holding[], cmps: Record<string, number>, peMap: Record<string, number | null>, earnMap: Record<string, string | null>): Row[] => {
  const totalInvestment = holdings.reduce((sum, h) => sum + calcInvestment(h), 0) || 1;
  return holdings.map(h => {
    const key = `${h.exchange}:${h.symbol}`;
    const cmp = cmps[key];
    const investment = calcInvestment(h);
    const presentValue = calcPresentValue(h.quantity, cmp);
    const gainLoss = calcGainLoss(presentValue, investment);
    return { ...h, investment, portfolioWeight: investment / totalInvestment, cmp, presentValue, gainLoss, pe: peMap[key] ?? null, latestEarnings: earnMap[key] ?? null };
  });
};
export const groupBySector = (rows: Row[]): SectorSummary[] => {
  const map = new Map<string, SectorSummary>();
  for (const r of rows) {
    const prev = map.get(r.sector) ?? { sector: r.sector, totalInvestment: 0, totalPresentValue: 0, totalGainLoss: 0 };
    prev.totalInvestment += r.investment;
    prev.totalPresentValue += r.presentValue ?? 0;
    prev.totalGainLoss += r.gainLoss ?? 0;
    map.set(r.sector, prev);
  }
  return Array.from(map.values());
};
