import type { RouteMapModel } from "@components/domain/routeMap/_redux/model";
import axios from "axios";


export class RouteMapService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/domains';

    find(id: string): Promise<RouteMapModel> {
        return axios.get(`${this.url}/${id}`)
    }

    update(domain: RouteMapModel): Promise<RouteMapModel> {
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
