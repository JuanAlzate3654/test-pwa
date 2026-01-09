import type { RouteSurveyModel } from "@components/domain/routeSurvey/_redux/model";
import type {
    ResultModel
} from "@integral-software/react-utilities";
import {
    defaultResultModel, mergeResultWithError,
    mergeResultWithLoading,
    mergeResultWithSuccess
} from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";

type routeSurveyResultType = "clearResult" | "findOneResult" | "saveResult";

export interface RouteSurveyStateModel {
    survey?: RouteSurveyModel;
    result: Record<routeSurveyResultType, ResultModel>;
}

function defaultState(): RouteSurveyStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const routeSurveySlice = createSlice({
    name: "routeSurvey",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ id: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeSurveyResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            survey: action.payload,
            result: {
                ...mergeResultWithSuccess<routeSurveyResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeSurveyResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<RouteSurveyModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeSurveyResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeSurveyResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeSurveyResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default routeSurveySlice.reducer;
