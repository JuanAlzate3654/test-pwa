import type { RouteMapModel } from "@components/domain/routeMap/_redux/model";
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

type routeMapResultType = "clearResult" | "findOneResult" | "saveResult";

export interface RouteMapStateModel {
    domain?: RouteMapModel;
    result: Record<routeMapResultType, ResultModel>;
}

function defaultState(): RouteMapStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const routeMapSlice = createSlice({
    name: "routeMap",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ id: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeMapResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            domain: action.payload,
            result: {
                ...mergeResultWithSuccess<routeMapResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeMapResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<RouteMapModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeMapResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeMapResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeMapResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default routeMapSlice.reducer;
