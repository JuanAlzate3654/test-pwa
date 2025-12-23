import type { DomainListModel } from "@components/domain/domainList/_redux/model";
import type { PageModel, PaginationRequest } from "@integral-software/react-utilities";

export interface DomainListGR {
    domainPage: DomainListModel;
    errors: any;
}

export class DomainListService {

    url = (import.meta.env.VITE_API_URL || '') + '/v1/domains';

    find(pagination: PaginationRequest): Promise<PageModel<DomainListModel>> {
        try {
            const params = new URLSearchParams({
                query: pagination.query,
                columnSort: pagination.sortColumn,
                page: pagination.page.toString(),
                sort: pagination.sort.toUpperCase(),
                size: pagination.size.toString(),
            });

            return fetch(`${this.url}?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la petición: ${response.status}`);
                    }
                    const data: PageModel<DomainListModel> = await response.json();
                    return data;
                });
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }


    delete(group: string, key: string): Promise<void> {
        try {
            return fetch(`${this.url}/groups/${group}/keys/${key}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        const text = await response.text();
                        throw new Error(`Error en la petición: ${response.status} - ${text}`);
                    }
                });
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }

    enable(group: string, key: string): Promise<DomainListModel> {
        return fetch(`${this.url}/groups/${group}/keys/${key}/enable`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                group: group,
                key: key
            }),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
                const data: DomainListModel = await response.json();
                return data;
            })
            .catch(error => Promise.reject(error));
    }

    disable(group: string, key: string): Promise<DomainListModel> {
        return fetch(`${this.url}/groups/${group}/keys/${key}/disable`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                group: group,
                key: key
            }),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
                const data: DomainListModel = await response.json();
                return data;
            })
            .catch(error => Promise.reject(error));
    }

}
