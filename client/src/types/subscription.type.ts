interface Ikeys {
    p256dh: string;
    auth: string;
}

export interface ISubscription {
    endpoint: string;
    keys: Ikeys;
}
