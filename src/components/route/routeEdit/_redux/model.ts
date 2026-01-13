import { t } from "i18next";
import * as yup from "yup";

export interface RouteEditModel {
    id: string;
    bitacora: string;
    cbml: string;
    matriculaInmobiliatia: string;
    direccionInmueble: string;
    nomenclaturaPrincipal: string;
    estratoSocieconomico: string;
    descripcion: string;
    codigoInstalacionEpm: string;
    nomenclaturaEpm: string;
    observacion: string;
}
export const routeEditSchema = yup.object().shape({
    bitacora: yup.string().required(t("route_edit_bitacora_required")),
    cbml: yup.string().required(t("route_edit_cbml_required")),
    matriculaInmobiliatia: yup.string().required(t("route_edit_matricula_inmobiliatia_required")),
    direccionInmueble: yup.string().required(t("route_edit_direccion_inmueble_required")),
    nomenclaturaPrincipal: yup.string().required(t("route_edit_nomenclatura_principal_required")),
    estratoSocieconomico: yup.string().required(t("route_edit_estrato_socieconomico_required")),
    descripcion: yup.string().required(t("route_edit_descripcion_required")),
    codigoInstalacionEpm: yup.string().required(t("route_edit_codigo_instalacion_epm_required")),
    nomenclaturaEpm: yup.string().required(t("route_edit_nomenclatura_epm_required")),
    observacion: yup.string().required(t("route_edit_observacion_required")),
});