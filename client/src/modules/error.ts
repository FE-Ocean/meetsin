export class FetchError extends Error {
    constructor(public message: string, public statusCode: number, public statusText: string) {
        super();
    }
}
