import type { RouteEvidenceEditModel } from "@components/route/routeEvidenceEdit/_redux/model";
import axios from "axios";

export class RouteEvidenceEditService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    find(id: string): Promise<RouteEvidenceEditModel> {
        return axios.get(`${this.url}/${id}/evidence`)
    }

    update(routeEvidence: RouteEvidenceEditModel): Promise<RouteEvidenceEditModel> {
        return axios.put(`${this.url}/${routeEvidence.id}`,
            {

            },
        )
    }

    delete(id: string): Promise<void> {
        return axios.delete(`${this.url}/${id}`)
    }
}
