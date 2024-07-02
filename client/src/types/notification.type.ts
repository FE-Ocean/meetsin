interface Ikeys {
    p256dh: string;
    auth: string;
}

export interface INotification {
    endpoint: string;
    keys: Ikeys;
}
