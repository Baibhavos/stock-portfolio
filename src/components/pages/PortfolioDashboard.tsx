'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import holdingsData from '@/data/portfolio.json';
import { Holding, Row, SectorSummary } from '@/lib/types';
import { toYahooSymbol } from '@/lib/exchange';
import { groupBySector } from '@/lib/math';
import { PortfolioTable } from '@/components/organisms/PortfolioTable';
import { StatCards } from '@/components/molecules/StatCards';
import { ErrorBanner } from '@/components/molecules/ErrorBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDashboardController } from '@/controllers/dashboard.controller';
import { AxiosError } from 'axios';
import { LoadingScreen } from '../molecules/LoadingScreen';

const holdings = holdingsData as Holding[];

export default function PortfolioDashboard() {
    const [allRows, setAllRows] = useState<Row[]>([]);
    const [filteredRows, setFilteredRows] = useState<Row[]>([]);
    const [initialError, setInitialError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [liveError, setLiveError] = useState<string | null>(null);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);

    const dashboardController = useDashboardController();

    const handlePortfolioSuccess = useCallback((data: Row[]) => {
        setAllRows(data);
        setFilteredRows(data);
        setInitialError(null);
        setLoading(false);
    }, []);

    const handlePortfolioError = useCallback((err: Error | AxiosError) => {
        setInitialError('Failed to load portfolio');
        toast.error('Uh oh!  Failed to get portfolio data!', {
            description: `${err.message}`,
            richColors: true,
            position: 'top-right'
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        dashboardController.getPortfolio(JSON.stringify(holdings), handlePortfolioSuccess, handlePortfolioError);
    }, [dashboardController, handlePortfolioSuccess, handlePortfolioError]);

    useEffect(() => {
        if (!allRows.length) return;
        let cancelled = false;
        let timer: NodeJS.Timeout | null = null;
        let failureCount = 0;

        const poll = async () => {
            try {
                const ySymbols = holdings.map((h) => toYahooSymbol(h)).join(',');

                dashboardController.getQuotes(ySymbols, (quotes) => {
                    if (cancelled) return;

                    const updateRow = (row: Row) => {
                        const ysym = toYahooSymbol(row);
                        const quote = quotes.quotes[ysym];
                        const cmp = quote ? quote.price : row.cmp || 0;
                        const presentValue = (cmp ?? 0) * row.quantity;
                        const gainLoss = presentValue - row.investment;
                        return { ...row, cmp, presentValue, gainLoss };
                    };

                    setAllRows((prev) => prev.map(updateRow));
                    setFilteredRows((prev) => prev.map(updateRow));

                    failureCount = 0;
                    setLiveError(null);
                }, (err: Error | AxiosError) => {
                    failureCount++;
                    setLiveError(err.message || 'Live price update failed');
                });
            } catch (e: unknown) {
                failureCount++;
                const errorMessage = e instanceof Error ? e.message : 'Live price update failed';
                setLiveError(errorMessage);
            } finally {
                const wait = Math.min(60000, 15000 * Math.max(1, failureCount));
                if (timer) clearTimeout(timer);
                timer = setTimeout(poll, wait);
            }
        };
        poll();
        return () => {
            cancelled = true;
            if (timer) clearTimeout(timer);
        };
    }, [allRows.length, dashboardController]);

    const sectors: SectorSummary[] = useMemo(() => groupBySector(allRows), [allRows]);

    const totals = useMemo(() => {
        const ti = filteredRows.reduce((s, r) => s + r.investment, 0);
        const tpv = filteredRows.reduce((s, r) => s + (r.presentValue ?? 0), 0);
        return { ti, tpv, pnl: tpv - ti };
    }, [filteredRows]);

    const handleFilterBySector = (sector: string) => {
        const filtered = allRows.filter((r) => r.sector.toLowerCase() === sector.toLowerCase());
        setFilteredRows(filtered);
        setSelectedSector(sector);
    };

    return (
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-10">
            <h1 className="text-2xl font-semibold">Dynamic Portfolio Dashboard</h1>
            {initialError && <ErrorBanner message={initialError} />}
            {liveError && <ErrorBanner title="Live update issue" message={liveError} />}
            {loading && <LoadingScreen />}
            {!loading && !!filteredRows.length && (
                <>
                    <div className="flex flex-col items-center justify-center lg:flex-row gap-6">
                        <div className="w-full lg:w-[20vw] shrink-0 min-w-[10vw]">
                            <StatCards
                                totalInvestment={totals.ti}
                                totalPresentValue={totals.tpv}
                                totalPnL={totals.pnl}
                            />
                        </div>

                        <Card className="w-full lg:w-[calc(100%-20vw)]">
                            <CardHeader>
                                <div className="flex justify-between items-center gap-y-4">
                                    <CardTitle>Sector Summaries</CardTitle>
                                    <div className="flex gap-2 flex-wrap">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setFilteredRows(allRows);
                                                setSelectedSector(null);
                                            }}
                                            className='hover:bg-gray-400 cursor-pointer'
                                        >
                                            Show All Sectors
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() => location.reload()}
                                            className='hover:bg-gray-400 cursor-pointer'
                                        >
                                            Hard refresh fundamentals
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex overflow-x-auto gap-4 pb-2">
                                    {sectors.map((s) => {
                                        const isSelected = selectedSector?.toLowerCase() === s.sector.toLowerCase();
                                        return (
                                            <Card
                                                key={s.sector}
                                                onClick={() => handleFilterBySector(s.sector)}
                                                className={`min-w-[10vw] shrink-0 cursor-pointer transition-colors duration-200 ${isSelected
                                                    ? 'border-2 border-primary bg-muted'
                                                    : 'hover:bg-accent'
                                                    }`}
                                            >
                                                <CardContent className="space-y-1 py-4">
                                                    <div className="text-base font-semibold">{s.sector}</div>
                                                    <div className="text-sm">
                                                        Investment: ₹{s.totalInvestment.toFixed(2)}
                                                    </div>
                                                    <div className="text-sm">
                                                        Present Value: ₹{s.totalPresentValue.toFixed(2)}
                                                    </div>
                                                    <div
                                                        className={`text-sm ${s.totalGainLoss >= 0
                                                            ? 'text-green-500'
                                                            : 'text-red-500'
                                                            }`}
                                                    >
                                                        {s.totalGainLoss > 0
                                                            ? `Gain : ₹${s.totalGainLoss.toFixed(2)}`
                                                            : `Loss : ₹${(-s.totalGainLoss).toFixed(2)}`}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <PortfolioTable rows={filteredRows} />

                    <div className="text-xs text-muted-foreground mt-2">
                        * CMP via Yahoo (unofficial). P/E & latest earnings via Google Finance scraping.
                        Values may be delayed or unavailable.
                    </div>
                </>
            )}
        </div>
    );
}
