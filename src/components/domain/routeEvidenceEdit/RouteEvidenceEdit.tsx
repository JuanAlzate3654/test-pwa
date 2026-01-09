import type { RouteEvidenceEditModel } from "@components/domain/routeEvidenceEdit/_redux/model";
import { routeEvidenceEditSchema } from "@components/domain/routeEvidenceEdit/_redux/model";
import type { RouteEvidenceEditStateModel } from "@components/domain/routeEvidenceEdit/_redux/routeEvidenceEditReducer";
import { routeEvidenceEditSlice } from "@components/domain/routeEvidenceEdit/_redux/routeEvidenceEditReducer";
import {
    isLoading,
    LateralDialog, LoadDiv2, useGlobalSelector,
    useLinearProgress,
    useSimpleToast
} from "@integral-software/react-utilities";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box, Button, FormControl, TextField, Tooltip, Typography } from "@mui/material";
import { APP_ID } from "@store/store";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
export default function RouteEvidenceEdit() {
    const { t } = useTranslation();
    const globalStore = GlobalStore.Get();
    const { id } = useParams();
    const {
        result,
        domain
    } = useGlobalSelector<RouteEvidenceEditStateModel>(APP_ID, ({ routeEvidenceEdit }) => routeEvidenceEdit);

    const handleDeleteEvidence = (index: number) => {
        const updatedEvidences = formik.values.evidences.filter((_, i) => i !== index);
        formik.setFieldValue("evidences", updatedEvidences);
    }

    useEffect(() => {
        if (id) {
            globalStore.DispatchAction(APP_ID, routeEvidenceEditSlice.actions.findOneReducer({ id }));
        }
    }, [id]);

    const formik = useFormik<RouteEvidenceEditModel>({
        initialValues: {
            id: "",
            evidences: [],
        },
        validationSchema: routeEvidenceEditSchema,
        onSubmit: (values) => {
            globalStore.DispatchAction(APP_ID, routeEvidenceEditSlice.actions.saveReducer(values))
        },
    });

    useLinearProgress("oime_shell_admin", result.saveResult);
    useLinearProgress("oime_shell_admin", result.findOneResult);
    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (domain)
            void formik.setValues(domain);
    }, [domain]);

    useEffect(() => () => globalStore.DispatchAction(APP_ID, routeEvidenceEditSlice.actions.clearReducer()), [])


    return (
        <LateralDialog width={{ xs: "100%", sm: "500px", md: "500px" }} Sticky={() => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                }}>
                <Typography variant="h6" gutterBottom>
                    {t("route_evidence_edit_title")}
                </Typography>
            </Box>
        )}
            BottomSticky={() => (
                <Tooltip title={t("route_evidence_edit_update_button_tooltip")} arrow>
                    <Button sx={{ width: "100%" }} loading={isLoading(result.saveResult)} variant="contained"
                        onClick={() => formik.handleSubmit()}>
                        {t("route_evidence_edit_update_button")}
                    </Button>
                </Tooltip>
            )}
        >
            <LoadDiv2 result={result.findOneResult}>
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "16px" }}>
                    <Typography variant="h6" gutterBottom>
                        {t("route_evidence_edit_evidences_title")}
                    </Typography>
                    {!formik.values.evidences || formik.values.evidences.length === 0 ?
                        (
                            <Box
                                sx={{
                                    display: "flex",
                                    border: '1px solid',
                                    borderColor: 'primary.main',
                                    borderRadius: 0.8,
                                    color: 'primary.main',
                                    textAlign: 'center',
                                    height: "50px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                {t("route_evidence_edit_no_evidences_message")}
                            </Box>
                        )
                        :
                        (
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1
                            }}>
                                {formik.values.evidences.map((evidence, index) => (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        gap: 1
                                    }}>
                                        <FormControl sx={{ flex: 1 }} variant="outlined" fullWidth>
                                            <TextField label={evidence.applicationRequestForm.name} disabled autoComplete={"off"} />
                                        </FormControl>
                                        <Button variant="outlined" onClick={() => handleDeleteEvidence(index)}>
                                            <DeleteIcon />
                                        </Button>
                                    </Box>
                                ))}
                            </Box>
                        )
                    }

                    <Tooltip title={t("route_evidence_edit_add_evidence_button_tooltip")} arrow>
                        <Box sx={{ width: "100%" }}>
                            <input
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                type="file"
                                style={{ display: "none" }}
                                id="evidence-file-input-hidden"
                                onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                    const file = event.currentTarget.files?.[0] ?? null;
                                    if (file) {
                                        const newEvidence = { applicationRequestForm: file };
                                        const currentEvidences = Array.isArray(formik.values.evidences) ? formik.values.evidences : [];
                                        await formik.setFieldValue("evidences", [...currentEvidences, newEvidence]);
                                    }
                                    event.target.value = "";
                                }}
                            />
                            <Button sx={{ width: "100%" }} variant="outlined"
                                color="primary"
                                aria-label={t("route_evidence_edit_add_evidence_button")}
                                onClick={() => {
                                    document.getElementById("evidence-file-input-hidden")?.click();
                                }}
                            >
                                {t("route_evidence_edit_add_evidence_button")}
                                <UploadFileIcon />
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
            </LoadDiv2>
        </LateralDialog>
    );
}
