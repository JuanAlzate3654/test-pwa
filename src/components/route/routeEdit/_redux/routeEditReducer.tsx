import type { RouteEditModel } from "@components/route/routeEdit/_redux/model";
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

type routeEditResultType = "clearResult" | "findOneResult" | "saveResult";

export interface RouteEditStateModel {
    route?: RouteEditModel;
    result: Record<routeEditResultType, ResultModel>;
}

function defaultState(): RouteEditStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const routeEditSlice = createSlice({
    name: "routeEdit",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ group: string, key: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeEditResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            route: action.payload,
            result: {
                ...mergeResultWithSuccess<routeEditResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeEditResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<RouteEditModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeEditResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeEditResultType>(state, action, "saveResult", t("route_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeEditResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default routeEditSlice.reducer;
