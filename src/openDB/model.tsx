export type OfflineFile = {
    field: string;
    name: string;
    type: string;
    data: ArrayBuffer;
};

export type OfflineRequest<T = any> = {
    id?: number;
    url: string;
    method: 'POST' | 'PUT' | 'PATCH';
    data: T;
    images?: OfflineFile[];
    files?: OfflineFile[];
    headers?: Record<string, string>;
    timestamp: number;
};