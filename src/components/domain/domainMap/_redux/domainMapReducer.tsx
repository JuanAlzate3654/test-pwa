import type { DomainMapModel } from "@components/domain/domainMap/_redux/model";
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

type domainMapResultType = "clearResult" | "findOneResult" | "saveResult";

export interface DomainMapStateModel {
    domain?: DomainMapModel;
    result: Record<domainMapResultType, ResultModel>;
}

function defaultState(): DomainMapStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const domainMapSlice = createSlice({
    name: "domainMap",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ id: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainMapResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            domain: action.payload,
            result: {
                ...mergeResultWithSuccess<domainMapResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainMapResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<DomainMapModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainMapResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<domainMapResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainMapResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default domainMapSlice.reducer;
