import type { RouteSurveyModel } from "@components/domain/routeSurvey/_redux/model";
import { routeSurveySchema } from "@components/domain/routeSurvey/_redux/model";
import type { RouteSurveyStateModel } from "@components/domain/routeSurvey/_redux/routeSurveyReducer";
import { routeSurveySlice } from "@components/domain/routeSurvey/_redux/routeSurveyReducer";
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
export default function RouteSurvey() {
    const { t } = useTranslation();
    const globalStore = GlobalStore.Get();
    const { id } = useParams();
    const {
        result,
        survey
    } = useGlobalSelector<RouteSurveyStateModel>(APP_ID, ({ routeSurvey }) => routeSurvey);

    useEffect(() => {
        if (id) {
            globalStore.DispatchAction(APP_ID, routeSurveySlice.actions.findOneReducer({ id }));
        }
    }, [id]);

    const formik = useFormik<RouteSurveyModel>({
        initialValues: {
            id: "",
            survey: [],
            observations: ""
        },
        validationSchema: routeSurveySchema,
        onSubmit: (values) => {
            globalStore.DispatchAction(APP_ID, routeSurveySlice.actions.saveReducer(values))
        },
    });

    useLinearProgress("oime_shell_admin", result.saveResult);
    useLinearProgress("oime_shell_admin", result.findOneResult);
    useSimpleToast(Object.values(result));

    useEffect(() => {
        if (survey) {
            void formik.setFieldValue('survey', survey);
        }
    }, [survey]);

    useEffect(() => () => globalStore.DispatchAction(APP_ID, routeSurveySlice.actions.clearReducer()), [])


    return (
        <LateralDialog width={{ xs: "100%", sm: "500px", md: "500px" }} Sticky={() => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: 2,
                }}>
                <Typography variant="h6" gutterBottom>
                    {t("route_survey_title")}
                </Typography>
            </Box>
        )}
            BottomSticky={() => (
                <Tooltip title={t("route_survey_button_update_tooltip")} arrow>
                    <Button sx={{ width: "100%" }} loading={isLoading(result.saveResult)} variant="contained"
                        onClick={() => formik.handleSubmit()}>
                        {t("route_survey_update_button")}
                    </Button>
                </Tooltip>
            )}
        >
            <LoadDiv2 result={result.findOneResult}>
                <Box style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "16px" }}>
                    {formik.values.survey && formik.values.survey.length > 0 ? (
                        formik.values.survey.map((question, qIdx) => {
                            const questionError =
                                formik.touched.survey && Array.isArray(formik.touched.survey) && formik.touched.survey[qIdx] &&
                                    formik.errors.survey && Array.isArray(formik.errors.survey) && formik.errors.survey[qIdx] &&
                                    typeof formik.errors.survey[qIdx] === 'object' && formik.errors.survey[qIdx]?.selectedAnswer
                                    ? formik.errors.survey[qIdx].selectedAnswer
                                    : undefined;
                            return (
                                <Box key={qIdx} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                    <Typography variant="subtitle1" sx={{ mb: 1 }}>{question.title}</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {question.answer.map((option, oIdx) => (
                                            <FormControl key={oIdx} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={question.selectedAnswer === option}
                                                    onChange={() => {
                                                        const updatedSurvey = [...formik.values.survey];
                                                        updatedSurvey[qIdx] = {
                                                            ...question,
                                                            selectedAnswer: question.selectedAnswer === option ? "" : option
                                                        };
                                                        formik.setFieldValue('survey', updatedSurvey);
                                                    }}
                                                    style={{ marginRight: 8 }}
                                                />
                                                <Typography variant="body2">{option}</Typography>
                                            </FormControl>
                                        ))}
                                    </Box>
                                    {questionError && (
                                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>{questionError}</Typography>
                                    )}
                                </Box>
                            );
                        })
                    ) : (
                        <Typography variant="body2" color="text.secondary">{t("route_survey_no_questions")}</Typography>
                    )}
                    <Tooltip title={t("route_survey_observations_tooltip")} arrow>
                        <FormControl variant="filled">
                            <TextField multiline rows={4} label={t("route_survey_observations")} autoComplete={"off"} {...formikInputProps("observations", formik)} />
                        </FormControl>
                    </Tooltip>
                </Box>
            </LoadDiv2>
        </LateralDialog>
    );
}
