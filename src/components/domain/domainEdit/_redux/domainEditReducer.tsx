import type { DomainEditModel } from "@components/domain/domainEdit/_redux/model";
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

type domainEditResultType = "clearResult" | "findOneResult" | "saveResult";

export interface DomainEditStateModel {
    domain?: DomainEditModel;
    result: Record<domainEditResultType, ResultModel>;
}

function defaultState(): DomainEditStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            findOneResult: defaultResultModel(),
            saveResult: defaultResultModel()
        },
    };
}

export const domainEditSlice = createSlice({
    name: "domainEdit",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        findOneReducer: (state, action: PayloadAction<{ group: string, key: string }>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainEditResultType>(state, action, "findOneResult")
            },
        }),
        findOneSuccessReducer: (state, action) => ({
            ...state,
            domain: action.payload,
            result: {
                ...mergeResultWithSuccess<domainEditResultType>(state, action, "findOneResult"),
            },
        }),
        findOneErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainEditResultType>(state, action, "findOneResult"),
            },
        }),
        saveReducer: (state, action: PayloadAction<DomainEditModel>) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainEditResultType>(state, action, "saveResult"),
            },
        }),
        saveSuccessReducer: (state, action: PayloadAction<void>) => ({
            ...state,
            result: {
                ...mergeResultWithSuccess<domainEditResultType>(state, action, "saveResult", t("domain_edit_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainEditResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default domainEditSlice.reducer;
