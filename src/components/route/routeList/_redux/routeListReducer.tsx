import type { RouteListModel } from "@components/route/routeList/_redux/model";
import type {
    PaginationRequest,
    ResultModel
} from "@integral-software/react-utilities";
import {
    defaultPaginationRequest, defaultResultModel, mergeResultWithError, mergeResultWithLoading, mergeResultWithSuccess,
    PageModel
} from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";

type routeListStateResultType = "clearResult" | "pageResult" | "deleteResult";

export interface RouteListStateModel {
    page: PageModel<RouteListModel>;
    pagination: PaginationRequest;
    result: Record<routeListStateResultType, ResultModel>;
}

function defaultState(): RouteListStateModel {
    return {
        page: new PageModel<RouteListModel>(),
        pagination: defaultPaginationRequest(50, "asc", "id.group"),
        result: {
            clearResult: defaultResultModel(),
            pageResult: defaultResultModel(),
            deleteResult: defaultResultModel()
        },
    };
}

export const routeListSlice = createSlice({
    name: "routeList",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        pageReducer: (state, action: PayloadAction<PaginationRequest>) => ({
            ...state,
            pagination: action.payload,
            result: {
                ...mergeResultWithLoading<routeListStateResultType>(state, action, "pageResult"),
            },
        }),
        pageSuccessReducer: (state, action) => ({
            ...state,
            page: action.payload.page,
            pagination: action.payload.pagination,
            result: {
                ...mergeResultWithSuccess<routeListStateResultType>(state, action, "pageResult"),
            },
        }),
        pageErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeListStateResultType>(state, action, "pageResult"),
            },
        }),
        deleteReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<routeListStateResultType>(state, action, "deleteResult"),
            },
        }),
        deleteSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<routeListStateResultType>(state, action, "deleteResult", t("route_list_toast_delete_success")),
            },
        }),
        deleteErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<routeListStateResultType>(state, action, "deleteResult"),
            },
        })
    },
});

export default routeListSlice.reducer;
