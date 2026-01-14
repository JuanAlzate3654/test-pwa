import type { RouteDetailEditModel } from "@components/route/routeDetailEdit/_redux/model";
import { routeDetailEditSchema } from "@components/route/routeDetailEdit/_redux/model";
import type { RouteDetailEditStateModel } from "@components/route/routeDetailEdit/_redux/routeDetailEditReducer";
import { routeDetailEditSlice } from "@components/route/routeDetailEdit/_redux/routeDetailEditReducer";
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
        { key: "VISITADA", value: "VISITADA" },
        { key: "PENDIENTE", value: "PENDIENTE" },
    ];

    const principalOptions = [
        { key: "SI", value: "si" },
        { key: "NO", value: "no" },
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

                    <Tooltip title={t("route_detail_edit_cbml_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_cbml")} disabled autoComplete={"off"} {...formikInputProps("cbml", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_matricula_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_matricula")} disabled autoComplete={"off"} {...formikInputProps("matricula", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_estrato_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_estrato")} disabled autoComplete={"off"} {...formikInputProps("estrato", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_descripcion_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_descripcion")} disabled autoComplete={"off"} {...formikInputProps("descripcion", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_direccion_encasillada_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_direccion_encasillada")} autoComplete={"off"} {...formikInputProps("direccionEncasillada", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_principal_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField
                                select
                                label={t("route_detail_edit_principal")}
                                autoComplete={"off"}
                                {...formikInputProps("principal", formik)}
                                value={formik.values.principal}
                            >
                                {principalOptions.map(option => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_pagina_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 18
                                    },
                                    input: {
                                        endAdornment:
                                            <Box>
                                                <Typography variant="caption" color="textSecondary">
                                                    {formik.values.pagina?.length || 0}/18
                                                </Typography>
                                            </Box>
                                    }
                                }}
                                label={t("route_detail_edit_pagina")}
                                autoComplete={"off"}
                                {...formikInputProps("pagina", formik)}
                            />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_nomenclatura_epm_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_nomenclatura_epm")} autoComplete={"off"} {...formikInputProps("nomenclaturaEpm", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_observacion_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_detail_edit_observacion")} autoComplete={"off"} {...formikInputProps("observacion", formik)} />
                        </FormControl>
                    </Tooltip>

                    <Tooltip title={t("route_detail_edit_estado_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField
                                select
                                label={t("route_detail_edit_estado")}
                                autoComplete={"off"}
                                {...formikInputProps("estado", formik)}
                                value={formik.values.estado}
                            >
                                {estadoOptions.map(option => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Tooltip>
                </Box>
            </LoadDiv2>
        </LateralDialog>
    );
}
