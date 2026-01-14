import type { RouteSurveyModel } from "@components/route/routeSurvey/_redux/model";
import { saveOfflineRequest } from "@openDB/openDB";
import axios from "axios";

export class RouteSurveyService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    async find(id: string): Promise<RouteSurveyModel> {
        const fullUrl = `${this.url}/${id}/survey`;
        try {
            const res = await axios.get<RouteSurveyModel>(fullUrl);
            const responseToCache = new Response(JSON.stringify(res.data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await (await caches.open('route-survey-cache')).put(fullUrl, responseToCache);
            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                const cachedResponse = await caches.open('route-survey-cache').then(cache => cache.match(fullUrl));
                if (cachedResponse) {
                    return await cachedResponse.json() as RouteSurveyModel;
                }
            }
            return Promise.reject(e);
        }
    }


    async update(routeSurvey: RouteSurveyModel): Promise<RouteSurveyModel> {
        const url = `${this.url}/${routeSurvey.id}`;
        const data = {
            id: routeSurvey.id,
            survey: routeSurvey.survey,
            observations: routeSurvey.observations,
        };
        try {
            const res = await axios.put<RouteSurveyModel>(url, data);
            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                await saveOfflineRequest(url, 'PUT', data, [], []);
                return Promise.resolve(data as RouteSurveyModel);
            }
            return Promise.reject(e);
        }
    }

}
