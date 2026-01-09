import type { RouteEvidenceEditModel } from "@components/domain/routeEvidenceEdit/_redux/model";
import axios from "axios";

export class RouteEvidenceEditService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/domains';

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
