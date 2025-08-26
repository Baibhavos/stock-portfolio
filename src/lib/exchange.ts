import { Holding } from './types';

export const toYahooSymbol = (h: Pick<Holding, 'symbol' | 'exchange'>) => {
    if (h.exchange === 'NSE') return `${h.symbol}.NS`;
    if (h.exchange === 'BSE') return `${h.symbol}.BO`;
    return h.symbol;
};

export const toGoogleSymbol = (h: Pick<Holding, 'symbol' | 'exchange'>) => {
    if (h.exchange === 'NSE') return `${h.symbol}:NSE`;
    if (h.exchange === 'BSE') return `${h.symbol}:BOM`;
    return h.symbol;
};
