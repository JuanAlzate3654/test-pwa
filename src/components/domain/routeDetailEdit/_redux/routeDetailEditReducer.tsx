import type { RouteDetailEditModel } from "@components/domain/routeDetailEdit/_redux/model";
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

type routeDetailEditResultType = "clearResult" | "findOneResult" | "saveResult";

export interface RouteDetailEditStateModel {
    routeDetail?: RouteDetailEditModel;
    result: Record<routeDetailEditResultType, ResultModel>;
}

function defaultState(): RouteDetailEditStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const routeDetailEditSlice = createSlice({
    name: "routeDetailEdit",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ id: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeDetailEditResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            routeDetail: action.payload,
            result: {
                ...mergeResultWithSuccess<routeDetailEditResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeDetailEditResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<RouteDetailEditModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeDetailEditResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeDetailEditResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeDetailEditResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default routeDetailEditSlice.reducer;
