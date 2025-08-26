'use client'
import { serverApiService } from "@/services/api/server-api.service";
import { AxiosError } from "axios";
import { createContext, useContext } from "react";
import { Row, Quote } from "@/lib/types";

type TCommonContextProps = {
    children: React.ReactNode,
};

type QuotesResponse = {
    quotes: Record<string, Quote>;
    warning?: string;
};

type TDashboardControllerProps = {
    getPortfolio: (payload: string, onSuccess: (success: Row[]) => void, onFailure: (failure: Error | AxiosError) => void) => void;
    getQuotes: (symbols: string, onSuccess: (success: QuotesResponse) => void, onFailure: (failure: Error | AxiosError) => void) => void;
};

const initialState: TDashboardControllerProps = {
    getPortfolio: () => { },
    getQuotes: () => { }
};

const DashboardContext = createContext<TDashboardControllerProps>(initialState);

export function DashboardContextProvider(props: TCommonContextProps) {

    const getPortfolio = async (
        payload: string,
        onSuccess: (success: Row[]) => void,
        onFailure: (failure: Error | AxiosError) => void
    ) => {
        try {
            const res = await serverApiService.post('/portfolio', payload);
            onSuccess(res.data as Row[]);
        } catch (error: unknown) {
            if (onFailure && (error instanceof Error || error instanceof AxiosError)) {
                onFailure(error);
            }
        }
    }

    const getQuotes = async (
        symbols: string,
        onSuccess: (success: QuotesResponse) => void,
        onFailure: (failure: Error | AxiosError) => void
    ) => {
        try {
            const res = await serverApiService.get(`/quotes?symbols=${encodeURIComponent(symbols)}`,
                {
                    timeout: 15000
                }
            );
            onSuccess(res.data as QuotesResponse);
        } catch (error: unknown) {
            if (onFailure && (error instanceof Error || error instanceof AxiosError)) {
                onFailure(error);
            }
        }
    };

    return (
        <DashboardContext.Provider
            value={{
                getPortfolio,
                getQuotes
            }}>
            {props.children}
        </DashboardContext.Provider>
    );
}

export const useDashboardController = () => useContext(DashboardContext);
