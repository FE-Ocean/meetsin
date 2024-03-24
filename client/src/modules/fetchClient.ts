import { FetchError } from "./error";

interface FetchClientOptions {
    baseURL: string;
    config: RequestInit;
}

export class FetchClient {
    constructor(private baseURL: string, private config: RequestInit = {}) {}

    static create(options: FetchClientOptions) {
        return new FetchClient(options.baseURL, options.config);
    }

    public get<T>(path: string, config: RequestInit = {}): Promise<T> {
        return this.request<T>(path, { ...config, method: "GET" });
    }

    public post<T>(
        path: string,
        body?: BodyInit | Record<string, unknown>,
        config: RequestInit = {},
    ): Promise<T> {
        const requestBody = body instanceof FormData ? body : JSON.stringify(body);
        return this.request<T>(path, { ...config, method: "POST", body: requestBody });
    }

    public delete<T>(path: string, config: RequestInit = {}): Promise<T> {
        return this.request<T>(path, { ...config, method: "DELETE" });
    }

    public patch<T>(
        path: string,
        body: BodyInit | Record<string, unknown>,
        config: RequestInit = {},
    ): Promise<T> {
        const requestBody = body instanceof FormData ? body : JSON.stringify(body);
        return this.request<T>(path, { ...config, method: "PATCH", body: requestBody });
    }

    private async request<T>(path: string, config: RequestInit): Promise<T> {
        const url = this.baseURL + path;
        const requestConfig: RequestInit = {
            ...this.config,
            ...config,
        };

        try {
            const response = await fetch(url, requestConfig);

            if (!response.ok) {
                const errorBody = await response.json();
                throw new FetchError(errorBody.message, response.status, response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof FetchError) {
                throw error;
            } else {
                throw new Error("Unknown Error");
            }
        }
    }
}

export const baseClient = FetchClient.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    config: {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    },
});
