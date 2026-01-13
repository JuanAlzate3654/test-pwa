import type { RouteSurveyModel } from "@components/route/routeSurvey/_redux/model";
import axios from "axios";

export class RouteSurveyService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    find(id: string): Promise<RouteSurveyModel> {
        return axios.get(`${this.url}/${id}/survey`)
    }


    update(routeSurvey: RouteSurveyModel): Promise<RouteSurveyModel> {
        return axios.put(`${this.url}/${routeSurvey.id}`,
            {

            },
        )
    }

}
