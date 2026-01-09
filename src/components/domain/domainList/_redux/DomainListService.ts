import type { DomainListModel } from "@components/domain/domainList/_redux/model";
import type { PageModel, PaginationRequest } from "@integral-software/react-utilities";
import axios from "axios";

export class DomainListService {

    url = 'api/v1/domains';

    async find(pagination: PaginationRequest): Promise<PageModel<DomainListModel>> {
        const params = {
            query: String(pagination.query ?? ''),
            columnSort: String(pagination.sortColumn ?? ''),
            page: String(pagination.page ?? ''),
            sort: String(pagination.sort?.toUpperCase() ?? ''),
            size: String(pagination.size ?? ''),
        };
        const urlParams = new URLSearchParams(params).toString();
        const fullUrl = `${this.url}?${urlParams}`;

        try {
            const res = await axios.get(fullUrl);
            const responseToCache = new Response(JSON.stringify(res.data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await (await caches.open('domain-list-cache')).put(fullUrl, responseToCache);
            return res.data as PageModel<DomainListModel>;
        } catch (e: any) {
            if (!navigator.onLine) {
                const cachedResponse = await caches.open('domain-list-cache').then(cache => cache.match(fullUrl));
                if (cachedResponse) {
                    const data = await cachedResponse.json();
                    return data as PageModel<DomainListModel>;
                }
            }
            return Promise.reject(e);
        }
    }

    delete(group: string, key: string): Promise<void> {
        return axios.delete(`${this.url}/groups/${group}/keys/${key}`)
    }

    enable(group: string, key: string): Promise<DomainListModel> {
        return axios.patch(`${this.url}/groups/${group}/keys/${key}`, { group, key })
    }

    disable(group: string, key: string): Promise<DomainListModel> {
        return axios.patch(`${this.url}/groups/${group}/keys/${key}`, { group, key })
    }

}