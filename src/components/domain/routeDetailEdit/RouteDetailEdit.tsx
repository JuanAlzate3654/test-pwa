const estadoOptions = [
    { value: "PENDIENTE", labelKey: "route_detail_edit_estado_pendiente" },
    { value: "VISITADA", labelKey: "route_detail_edit_estado_visitada" },
];
import type { RouteDetailEditModel } from "@components/domain/routeDetailEdit/_redux/model";
import { routeDetailEditSchema } from "@components/domain/routeDetailEdit/_redux/model";
import type { RouteDetailEditStateModel } from "@components/domain/routeDetailEdit/_redux/routeDetailEditReducer";
import { routeDetailEditSlice } from "@components/domain/routeDetailEdit/_redux/routeDetailEditReducer";
import {
    formikInputProps,
    isLoading,
    LateralDialog, LoadDiv2, useGlobalSelector,
    useLinearProgress,
    useSimpleToast
} from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import { Box, Button, FormControl, MenuItem, TextField, Tooltip, Typography } from "@mui/material";
import { APP_ID } from "@store/store";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
export default function RouteDetailEdit() {
    const { t } = useTranslation();
    const globalStore = GlobalStore.Get();
    const { id } = useParams();
    const {
        result,
        routeDetail
    } = useGlobalSelector<RouteDetailEditStateModel>(APP_ID, ({ routeDetailEdit }) => routeDetailEdit);

    useEffect(() => {
        if (id) {
            globalStore.DispatchAction(APP_ID, routeDetailEditSlice.actions.findOneReducer({ id }));
        }
    }, [id]);

    const estadoOptions = [
        { key: "PENDIENTE", value: "PENDIENTE" },
        { key: "VISITADA", value: "VISITADA" },
    ];

    const formik = useFormik<RouteDetailEditModel>({
        initialValues: {
            id: '',
            ruta: '',
            cbml: '',
            matricula: '',
            direccionEncasillada: '',
            principal: '',
            estrato: '',
            descripcion: '',
            pagina: '',
            nomenclaturaEpm: '',
            observacion: '',
            estado: '',
            bitacoraActividades: [],
            latitud: null,
            longitud: null,
        },
        validationSchema: routeDetailEditSchema,
        onSubmit: (values) => {
            globalStore.DispatchAction(APP_ID, routeDetailEditSlice.actions.saveReducer(values))
        },
    });

    useLinearProgress("oime_shell_admin", result.saveResult);
    useLinearProgress("oime_shell_admin", result.findOneResult);
    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (routeDetail)
            void formik.setValues(routeDetail);
    }, [routeDetail]);

    useEffect(() => () => globalStore.DispatchAction(APP_ID, routeDetailEditSlice.actions.clearReducer()), [])


    return (
        <LateralDialog width={{ xs: "100%", sm: "500px", md: "500px" }} Sticky={() => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                }}>
                <Typography variant="h6" gutterBottom>
                    {t("route_detail_edit_title")}
                </Typography>
            </Box>
        )}
            BottomSticky={() => (
                <Tooltip title={t("route_detail_edit_update_button_tooltip")} arrow>
                    <Button sx={{ width: "100%" }} loading={isLoading(result.saveResult)} variant="contained"
                        onClick={() => formik.handleSubmit()}>
                        {t("route_detail_edit_update_button")}
                    </Button>
                </Tooltip>
            )}
        >
            <LoadDiv2 result={result.findOneResult}>
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "16px" }}>

                    <Tooltip title={t("route_detail_edit_ruta_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_ruta")} autoComplete={"off"} {...formikInputProps("ruta", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_matricula_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_matricula")} autoComplete={"off"} {...formikInputProps("matricula", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_estrato_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_estrato")} autoComplete={"off"} {...formikInputProps("estrato", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_descripcion_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_descripcion")} autoComplete={"off"} {...formikInputProps("descripcion", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_direccionEncasillada_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_direccionEncasillada")} autoComplete={"off"} {...formikInputProps("direccionEncasillada", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_nomenclaturaEpm_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_nomenclaturaEpm")} autoComplete={"off"} {...formikInputProps("nomenclaturaEpm", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_observacion_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_observacion")} autoComplete={"off"} {...formikInputProps("observacion", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("tramites_edit_procedure_type_tooltip")} arrow>
                        <TextField
                            select
                            label={t("tramites_edit_procedure_type")}
                            {...formikInputProps("estado", formik)}
                            value={formik.values.estado}
                            autoComplete="off"
                        >
                            {estadoOptions.map(estadoOption => (
                                <MenuItem key={estadoOption.key} value={estadoOption.key}>{estadoOption.value}</MenuItem>
                            ))}
                        </TextField>
                    </Tooltip>
                </Box>
            </LoadDiv2>
        </LateralDialog>
    );
}
