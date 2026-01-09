import { t } from "i18next";
import * as yup from "yup";

export interface RouteSurveyModel {
    id: string;
    survey: RouteSurveyQuestion[];
    observations: string;
}

interface RouteSurveyQuestion {
    title: string;
    answer: string[];
    selectedAnswer: string;
}

export const routeSurveySchema = yup.object().shape({
    survey: yup.array().of(
        yup.object().shape({
            title: yup.string().required(t("route_survey_question_title_required")),
            answer: yup.array().of(yup.string().required()).min(1, t("route_survey_answer_required")),
            selectedAnswer: yup.string().required(t("route_survey_selected_answer_required")),
        })
    ).min(1, t("route_survey_question_required")),
    observations: yup.string().required(t("route_survey_observations_required")),
});