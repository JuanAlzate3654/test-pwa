import type { RouteEditModel } from "@components/route/routeEdit/_redux/model";
import { routeEditSchema } from "@components/route/routeEdit/_redux/model";
import type { RouteEditStateModel } from "@components/route/routeEdit/_redux/routeEditReducer";
import { routeEditSlice } from "@components/route/routeEdit/_redux/routeEditReducer";
import {
    formikInputProps,
    isLoading,
    LateralDialog, LoadDiv2, useGlobalSelector,
    useLinearProgress,
    useSimpleToast
} from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import { Box, Button, FormControl, TextField, Tooltip, Typography } from "@mui/material";
import { APP_ID } from "@store/store";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
export default function RouteEdit() {
    const { t } = useTranslation();
    const globalStore = GlobalStore.Get();
    const { key, group } = useParams();
    const {
        result,
        route
    } = useGlobalSelector<RouteEditStateModel>(APP_ID, ({ routeEdit }) => routeEdit);

    useEffect(() => {
        if (group && key) {
            globalStore.DispatchAction(APP_ID, routeEditSlice.actions.findOneReducer({ group, key }));
        }
    }, [group]);

    const formik = useFormik<RouteEditModel>({
        initialValues: {
            id: '',
            bitacora: '',
            cbml: '',
            matriculaInmobiliatia: '',
            direccionInmueble: '',
            nomenclaturaPrincipal: '',
            estratoSocieconomico: '',
            descripcion: '',
            codigoInstalacionEpm: '',
            nomenclaturaEpm: '',
            observacion: '',
        },
        validationSchema: routeEditSchema,
        onSubmit: (values) => {
            globalStore.DispatchAction(APP_ID, routeEditSlice.actions.saveReducer(values))
        },
    });

    useLinearProgress("oime_shell_admin", result.saveResult);
    useLinearProgress("oime_shell_admin", result.findOneResult);
    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (route)
            void formik.setValues(route);
    }, [route]);

    useEffect(() => () => globalStore.DispatchAction(APP_ID, routeEditSlice.actions.clearReducer()), [])


    return (
        <LateralDialog width={{ xs: "100%", sm: "500px", md: "500px" }} Sticky={() => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                }}>
                <Typography variant="h6" gutterBottom>
                    {t("route_edit_title")}
                </Typography>
            </Box>
        )}
            BottomSticky={() => (
                <Tooltip title={t("route_edit_update_button_tooltip")} arrow>
                    <Button sx={{ width: "100%" }} loading={isLoading(result.saveResult)} variant="contained"
                        onClick={() => formik.handleSubmit()}>
                        {t("route_edit_update_button")}
                    </Button>
                </Tooltip>
            )}
        >
            <LoadDiv2 result={result.findOneResult}>
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Tooltip title={t("route_edit_group_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_edit_group")} disabled autoComplete={"off"} {...formikInputProps("group", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("route_edit_key_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_edit_key")} disabled autoComplete={"off"} {...formikInputProps("key", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("route_edit_value_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("route_edit_value")} autoComplete={"off"} {...formikInputProps("value", formik)} />
                        </FormControl>
                    </Tooltip>
                </Box>
            </LoadDiv2>
        </LateralDialog>
    );
}
