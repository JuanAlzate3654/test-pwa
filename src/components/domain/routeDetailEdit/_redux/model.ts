import { t } from "i18next";
import * as yup from "yup";

export interface RouteDetailEditModel {
    id: string
    ruta: string
    cbml: string
    matricula: string
    direccionEncasillada: string
    principal: string
    estrato: string
    descripcion: string
    pagina: string
    nomenclaturaEpm: string
    observacion: string
    estado: string
    bitacoraActividades: BitacoraActividad[]
    latitud?: number | null
    longitud?: number | null
}

type BitacoraActividad = "VISITADA" | "EVIDENCIA" | "ENCUESTA"

export const routeDetailEditSchema = yup.object().shape({
    id: yup.string().required(t("route_detail_edit_id_required")),
    ruta: yup.string().required(t("route_detail_edit_ruta_required")),
    cbml: yup.string().required(t("route_detail_edit_cbml_required")),
    matricula: yup.string().required(t("route_detail_edit_matricula_required")),
    direccionEncasillada: yup.string().required(t("route_detail_edit_direccionEncasillada_required")),
    principal: yup.string().required(t("route_detail_edit_principal_required")),
    estrato: yup.string().required(t("route_detail_edit_estrato_required")),
    descripcion: yup.string().required(t("route_detail_edit_descripcion_required")),
    pagina: yup.string().required(t("route_detail_edit_pagina_required")),
    nomenclaturaEpm: yup.string().required(t("route_detail_edit_nomenclaturaEpm_required")),
    observacion: yup.string().required(t("route_detail_edit_observacion_required")),
    estado: yup.string().required(t("route_detail_edit_estado_required")),
    bitacoraActividades: yup.array().of(yup.string().oneOf(["VISITADA", "EVIDENCIA", "ENCUESTA"])).required(t("route_detail_edit_bitacoraActividades_required")),
    latitud: yup.number().nullable(),
    longitud: yup.number().nullable(),
});