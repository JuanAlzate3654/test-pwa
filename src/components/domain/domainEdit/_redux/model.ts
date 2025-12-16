import { t } from "i18next";
import * as yup from "yup";

export interface DomainEditModel {
    group: string;
    key: string;
    value: string;
    status?: string;
    createdAt?: string;
}
export const domainEditSchema = yup.object().shape({
    group: yup.string().required(t("domain_edit_group_required")),
    key: yup.string().required(t("domain_edit_key_required")),
    value: yup.string().required(t("domain_edit_value_required")),
});