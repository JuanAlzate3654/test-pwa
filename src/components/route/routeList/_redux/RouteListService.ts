import type { RouteListModel } from "@components/route/routeList/_redux/model";
import type { PaginationRequest } from "@integral-software/react-utilities";
import axios from "axios";

export class RouteListService {

    url = 'api/v1/routes';

    async find(pagination: PaginationRequest): Promise<RouteListModel> {
        const params = {
            query: String(pagination.query ?? ''),
            columnSort: String(pagination.sortColumn ?? ''),
            page: String(pagination.page ?? 0),
            sort: String(pagination.sort?.toUpperCase() ?? ''),
            size: String(pagination.size ?? 10),
        };

        const urlParams = new URLSearchParams(params).toString();
        const fullUrl = `${this.url}?${urlParams}`;

        try {
            const res = await axios.get<RouteListModel>(fullUrl);

            const responseToCache = new Response(JSON.stringify(res.data), {
                headers: { 'Content-Type': 'application/json' }
            });

            await (await caches.open('route-list-cache'))
                .put(fullUrl, responseToCache);

            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                const cachedResponse = await caches
                    .open('route-list-cache')
                    .then(cache => cache.match(fullUrl));

                if (cachedResponse) {
                    return await cachedResponse.json() as RouteListModel;
                }
            }
            return Promise.reject(e);
        }
    }

    delete(id: string): Promise<void> {
        return axios.delete(`${this.url}/${id}`)
    }

    enable(id: string): Promise<RouteListModel> {
        return axios.patch(`${this.url}/${id}`, { id })
    }

    disable(id: string): Promise<RouteListModel> {
        return axios.patch(`${this.url}/${id}`, { id })
    }

}