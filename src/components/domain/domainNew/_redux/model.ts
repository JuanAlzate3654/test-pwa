import { t } from "i18next";
import * as yup from "yup";

export interface DomainNewModel {
    group: string;
    key: string;
    value: string;
    status: string;
    images: any[];
    file: any;
}
export const domainNewSchema = yup.object().shape({
    group: yup.string().required(t("domain_new_group_required")),
    key: yup.string().required(t("domain_new_key_required")),
    value: yup.string().required(t("domain_new_value_required")),
});