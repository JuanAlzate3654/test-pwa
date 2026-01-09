import type { DomainMapModel } from "@components/domain/domainMap/_redux/model";
import axios from "axios";


export class DomainMapService {

    url = (import.meta.env.VITE_API_URL || '') + '/v1/domains';

    find(id: string): Promise<DomainMapModel> {
        return axios.get(`${this.url}/${id}`)
    }

    update(domain: DomainMapModel): Promise<DomainMapModel> {
        return axios.put(`${this.url}/${domain.id}`,
            {
                group: domain.group,
                key: domain.key,
                value: domain.value,
                status: domain.status
            },
        )
    }

}
