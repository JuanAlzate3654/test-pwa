import type { RouteMapModel } from "@components/route/routeMap/_redux/model";
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

type routeMapResultType = "clearResult" | "findOneResult" | "downloadMapResult" | "downloadRoutesMapResult" | "loadMapResult";

export interface RouteMapStateModel {
    routes?: RouteMapModel[];
    result: Record<routeMapResultType, ResultModel>;
}

function defaultState(): RouteMapStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            downloadMapResult: defaultResultModel(),
            downloadRoutesMapResult: defaultResultModel(),
            loadMapResult: defaultResultModel(),
        },
    };
}

export const routeMapSlice = createSlice({
    name: "routeMap",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ cbmls: string[] }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeMapResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            routes: action.payload,
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
        downloadMapReducer: (state, action: PayloadAction<{ bounds: any, zoom: number }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeMapResultType>(state, action, "downloadMapResult")
            },
        }),
        downloadMapSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeMapResultType>(state, action, "downloadMapResult"),
            },
        }),
        downloadMapErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeMapResultType>(state, action, "downloadMapResult"),
            },
        }),
        downloadRoutesMapReducer: (state, action: PayloadAction<{ routes: any }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeMapResultType>(state, action, "downloadRoutesMapResult")
            },
        }),
        downloadRoutesMapSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeMapResultType>(state, action, "downloadRoutesMapResult"),
            },
        }),
        downloadRoutesMapErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeMapResultType>(state, action, "downloadRoutesMapResult"),
            },
        }),
        loadMapReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeMapResultType>(state, action, "loadMapResult")
            },
        }),
        loadMapSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeMapResultType>(state, action, "loadMapResult"),
            },
        }),
        loadMapErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeMapResultType>(state, action, "loadMapResult"),
            },
        }),
    },
});

export default routeMapSlice.reducer;
