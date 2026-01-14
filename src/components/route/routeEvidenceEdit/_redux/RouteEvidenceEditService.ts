import type { RouteEvidenceEditModel } from "@components/route/routeEvidenceEdit/_redux/model";
import axios from "axios";

export class RouteEvidenceEditService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    async find(id: string): Promise<RouteEvidenceEditModel> {
        const fullUrl = `${this.url}/${id}/evidence`;
        try {
            const res = await axios.get<RouteEvidenceEditModel>(fullUrl);
            const responseToCache = new Response(JSON.stringify(res.data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await (await caches.open('route-evidence-cache')).put(fullUrl, responseToCache);
            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                const cachedResponse = await caches.open('route-evidence-cache').then(cache => cache.match(fullUrl));
                if (cachedResponse) {
                    return await cachedResponse.json() as RouteEvidenceEditModel;
                }
            }
            return Promise.reject(e);
        }
    }

    async update(routeEvidence: RouteEvidenceEditModel): Promise<RouteEvidenceEditModel> {
        const url = `${this.url}/${routeEvidence.id}`;
        const images = (routeEvidence.evidences || []).map((image: File, idx: number) => ({ field: `evidence_${idx}`, image }));
        const data = { id: routeEvidence.id };
        const formData = new FormData();
        formData.append('id', routeEvidence.id);
        images.forEach(({ field, image }) => {
            formData.append(field, image);
        });
        try {
            const res = await axios.put<RouteEvidenceEditModel>(url, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                const { saveOfflineRequest } = await import("@openDB/openDB");
                await saveOfflineRequest(url, 'PUT', data, images, []);
                return Promise.resolve({ ...routeEvidence });
            }
            return Promise.reject(e);
        }
    }

    async delete(id: string): Promise<void> {
        const url = `${this.url}/${id}`;
        try {
            await axios.delete(url);
        } catch (e: any) {
            if (!navigator.onLine) {
                const { saveOfflineRequest } = await import("@openDB/openDB");
                await saveOfflineRequest(url, 'DELETE', {}, [], []);
                return Promise.resolve();
            }
            return Promise.reject(e);
        }
    }
}
