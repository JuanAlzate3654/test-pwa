import type { DomainListModel } from "@components/domain/domainList/_redux/model";
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

type domainListStateResultType = "clearResult" | "pageResult" | "deleteResult" | "enableResult" | "disableResult";

export interface DomainListStateModel {
    page: PageModel<DomainListModel>;
    pagination: PaginationRequest;
    result: Record<domainListStateResultType, ResultModel>;
}

function defaultState(): DomainListStateModel {
    return {
        page: new PageModel<DomainListModel>(),
        pagination: defaultPaginationRequest(50, "asc", "id.group"),
        result: {
            clearResult: defaultResultModel(),
            pageResult: defaultResultModel(),
            deleteResult: defaultResultModel(),
            enableResult: defaultResultModel(),
            disableResult: defaultResultModel(),
        },
    };
}

export const domainListSlice = createSlice({
    name: "domainList",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        pageReducer: (state, action: PayloadAction<PaginationRequest>) => ({
            ...state,
            pagination: action.payload,
            result: {
                ...mergeResultWithLoading<domainListStateResultType>(state, action, "pageResult"),
            },
        }),
        pageSuccessReducer: (state, action) => ({
            ...state,
            page: action.payload.page,
            pagination: action.payload.pagination,
            result: {
                ...mergeResultWithSuccess<domainListStateResultType>(state, action, "pageResult"),
            },
        }),
        pageErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainListStateResultType>(state, action, "pageResult"),
            },
        }),
        deleteReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainListStateResultType>(state, action, "deleteResult"),
            },
        }),
        deleteSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<domainListStateResultType>(state, action, "deleteResult", t("domain_list_toast_delete_success")),
            },
        }),
        deleteErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainListStateResultType>(state, action, "deleteResult"),
            },
        }),
        enableReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainListStateResultType>(state, action, "enableResult"),
            },
        }),
        enableSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<domainListStateResultType>(state, action, "enableResult", t("domain_list_toast_enable_success")),
            },
        }),
        enableErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainListStateResultType>(state, action, "enableResult"),
            },
        }),
        disableReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainListStateResultType>(state, action, "disableResult"),
            },
        }),
        disableSuccessReducer: (state, action: PayloadAction<void>) => {
            return ({
                ...state,
                result: {
                    ...mergeResultWithSuccess<domainListStateResultType>(state, action, "disableResult", t("domain_list_toast_disable_success")),
                },
            });
        },
        disableErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainListStateResultType>(state, action, "disableResult"),
            },
        }),
    },
});

export default domainListSlice.reducer;
