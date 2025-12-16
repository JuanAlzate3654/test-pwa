import type { OfflineFile, OfflineRequest } from '@openDB/model';
import { openDB } from 'idb';

export const dbPromise = openDB('pwa-offline-db', 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains('offlineQueue')) {
            db.createObjectStore('offlineQueue', { keyPath: 'id', autoIncrement: true });
        }
    },
});

export async function saveOfflineRequest<T>(
    url: string,
    method: 'POST' | 'PUT',
    data: T,
    images: { field: string; image: File }[],
    files: { field: string; file: File }[]
) {
    const offlineImages: OfflineFile[] = await Promise.all(
        images.map(async ({ field, image }) => ({
            field,
            name: image.name,
            type: image.type,
            data: await image.arrayBuffer()
        }))
    );

    const offlineFiles: OfflineFile[] = await Promise.all(
        files.map(async ({ field, file }) => ({
            field,
            name: file.name,
            type: file.type,
            data: await file.arrayBuffer()
        }))
    );

    const request: OfflineRequest<T> = {
        url,
        method,
        data,
        images: offlineImages,
        files: offlineFiles,
        timestamp: Date.now()
    };

    const db = await dbPromise;
    await db.add('offlineQueue', request);
}
