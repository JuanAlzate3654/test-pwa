
import type { DomainListModel } from "@components/domain/domainList/_redux/model";
import type { PageModel, PaginationRequest } from "@integral-software/react-utilities";
import axios from "axios";

export class DomainListService {

    url = (import.meta.env.VITE_API_URL || '') + '/v1/domains';

    find(pagination: PaginationRequest): Promise<PageModel<DomainListModel>> {
        const params = {
            query: pagination.query,
            columnSort: pagination.sortColumn,
            page: pagination.page,
            sort: pagination.sort.toUpperCase(),
            size: pagination.size,
        };
        return axios.get(`${this.url}?${params.toString()}`);
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
