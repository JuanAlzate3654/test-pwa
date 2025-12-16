import type { DomainEditStateModel } from "@components/domain/domainEdit/_redux/domainEditReducer";
import { domainEditSlice } from "@components/domain/domainEdit/_redux/domainEditReducer";
import type { DomainEditModel } from "@components/domain/domainEdit/_redux/model";
import { domainEditSchema } from "@components/domain/domainEdit/_redux/model";
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
export default function DomainEdit() {
    const { t } = useTranslation();
    const globalStore = GlobalStore.Get();
    const { key, group } = useParams();
    const {
        result,
        domain
    } = useGlobalSelector<DomainEditStateModel>(APP_ID, ({ domainEdit }) => domainEdit);

    useEffect(() => {
        if (group && key) {
            globalStore.DispatchAction(APP_ID, domainEditSlice.actions.findOneReducer({ group, key }));
        }
    }, [group]);

    const formik = useFormik<DomainEditModel>({
        initialValues: {
            value: "",
            key: "",
            group: ""
        },
        validationSchema: domainEditSchema,
        onSubmit: (values) => {
            globalStore.DispatchAction(APP_ID, domainEditSlice.actions.saveReducer(values))
        },
    });

    useLinearProgress("oime_shell_admin", result.saveResult);
    useLinearProgress("oime_shell_admin", result.findOneResult);
    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (domain)
            void formik.setValues(domain);
    }, [domain]);

    useEffect(() => () => globalStore.DispatchAction(APP_ID, domainEditSlice.actions.clearReducer()), [])


    return (
        <LateralDialog width={{ xs: "100%", sm: "500px", md: "500px" }} Sticky={() => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                }}>
                <Typography variant="h6" gutterBottom>
                    {t("domain_edit_title")}
                </Typography>
            </Box>
        )}
            BottomSticky={() => (
                <Tooltip title={t("domain_edit_update_button_tooltip")} arrow>
                    <Button sx={{ width: "100%" }} loading={isLoading(result.saveResult)} variant="contained"
                        onClick={() => formik.handleSubmit()}>
                        {t("domain_edit_update_button")}
                    </Button>
                </Tooltip>
            )}
        >
            <LoadDiv2 result={result.findOneResult}>
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <Tooltip title={t("domain_edit_group_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("domain_edit_group")} disabled autoComplete={"off"} {...formikInputProps("group", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("domain_edit_key_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("domain_edit_key")} disabled autoComplete={"off"} {...formikInputProps("key", formik)} />
                        </FormControl>
                    </Tooltip>
                    <Tooltip title={t("domain_edit_value_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField label={t("domain_edit_value")} autoComplete={"off"} {...formikInputProps("value", formik)} />
                        </FormControl>
                    </Tooltip>
                </Box>
            </LoadDiv2>
        </LateralDialog>
    );
}
