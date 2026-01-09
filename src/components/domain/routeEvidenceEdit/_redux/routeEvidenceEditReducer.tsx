import type { RouteEvidenceEditModel } from "@components/domain/routeEvidenceEdit/_redux/model";
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

type routeEvidenceEditResultType = "clearResult" | "findOneResult" | "saveResult";

export interface RouteEvidenceEditStateModel {
    domain?: RouteEvidenceEditModel;
    result: Record<routeEvidenceEditResultType, ResultModel>;
}

function defaultState(): RouteEvidenceEditStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const routeEvidenceEditSlice = createSlice({
    name: "routeEvidenceEdit",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ id: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeEvidenceEditResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            domain: action.payload,
            result: {
                ...mergeResultWithSuccess<routeEvidenceEditResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeEvidenceEditResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<RouteEvidenceEditModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeEvidenceEditResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeEvidenceEditResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeEvidenceEditResultType>(state, action, "saveResult"),
            },
        }),
        deleteReducer: (state, action: PayloadAction<RouteEvidenceEditModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeEvidenceEditResultType>(state, action, "saveResult"),
            },
        }),
        deleteSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeEvidenceEditResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        deleteErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeEvidenceEditResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default routeEvidenceEditSlice.reducer;
