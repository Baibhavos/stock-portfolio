import axios, { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';

export class BaseApiService {

    constructor(
        public readonly baseUrl: string,
        private readonly axiosInstance: AxiosStatic = axios
    ) { }

    getConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
        if (!config) config = {};
        if (!config.headers) config.headers = {};

        return config;
    }

    getUrl(path: string): string {
        return `${this.baseUrl}${path}`;
    }

    post<T>(path: string, data?: T, config?: AxiosRequestConfig<T>) {
        return this.axiosInstance.post(this.getUrl(path), data, this.getConfig(config));
    }

    get(path: string, config?: AxiosRequestConfig) {
        return this.axiosInstance.get(this.getUrl(path), this.getConfig(config));
    }
}

