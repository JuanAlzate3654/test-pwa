import * as yup from "yup";

export interface RouteEvidenceEditModel {
    id: string
    evidences: any[]
}
export const routeEvidenceEditSchema = yup.object().shape({});