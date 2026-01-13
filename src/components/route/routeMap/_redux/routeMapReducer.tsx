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

type routeMapResultType = "clearResult" | "findOneResult";

export interface RouteMapStateModel {
    route?: RouteMapModel;
    result: Record<routeMapResultType, ResultModel>;
}

function defaultState(): RouteMapStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel()
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
            route: action.payload,
            result: {
                ...mergeResultWithSuccess<routeMapResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeMapResultType>(state, action, "findOneResult"),
            },
        })
    },
});

export default routeMapSlice.reducer;
