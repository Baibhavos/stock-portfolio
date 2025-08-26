'use client'
import { serverApiService } from "@/services/api/server-api.service";
import { AxiosError } from "axios";
import { createContext, useContext } from "react";

type TCommonContextProps = {
    children: React.ReactNode,
};

type TDashboardControllerProps = {
    getPortfolio: (payload: string, onSuccess: (success: any) => any, onFailure: (failure: Error | AxiosError) => any) => void;
    getQuotes: (symbols: string, onSuccess: (success: any) => any, onFailure: (failure: Error | AxiosError) => any) => void;
};

const initialState: TDashboardControllerProps = {
    getPortfolio: (payload: string, onSuccess: (success: any) => any, onFailure: (failure: Error | AxiosError) => any) => { },
    getQuotes: (symbols: string, onSuccess: (success: any) => any, onFailure: (failure: Error | AxiosError) => any) => { }
};

const DashboardContext = createContext<TDashboardControllerProps>(initialState);

export function DashboardContextProvider(props: TCommonContextProps) {

    const getPortfolio = async (
        payload: string,
        onSuccess: (success: any) => any,
        onFailure: (failure: Error | AxiosError) => any
    ) => {
        try {
            const res = await serverApiService.post('/portfolio', payload);
            onSuccess(res.data);
        } catch (error: any) {
            if (onFailure) {
                onFailure(error)
            }
        }
    }

    const getQuotes = async (
        symbols: string,
        onSuccess: (success: any) => any,
        onFailure: (failure: Error | AxiosError) => any
    ) => {
        try {
            const res = await serverApiService.get(`/quotes?symbols=${encodeURIComponent(symbols)}`,
                {
                    timeout: 15000
                }
            );
            onSuccess(res.data);
        } catch (error: any) {
            if (onFailure) {
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
