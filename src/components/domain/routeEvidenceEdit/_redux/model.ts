import { t } from "i18next";
import * as yup from "yup";

export interface RouteEvidenceEditModel {
    id: string
    evidences: any[]
}
export const routeEvidenceEditSchema = yup.object().shape({
    group: yup.string().required(t("domain_edit_group_required")),
    key: yup.string().required(t("domain_edit_key_required")),
    value: yup.string().required(t("domain_edit_value_required")),
});