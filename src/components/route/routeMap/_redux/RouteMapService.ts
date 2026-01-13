import type { RouteMapModel } from "@components/route/routeMap/_redux/model";
import axios from "axios";


export class RouteMapService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    find(id: string): Promise<RouteMapModel> {
        return axios.get(`${this.url}/${id}`)
    }
}
