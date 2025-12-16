import type { DomainNewModel } from "@components/domain/domainNew/_redux/model";
import type {
    ResultModel
} from "@integral-software/react-utilities";
import {
    defaultResultModel, mergeResultWithError,
    mergeResultWithLoading,
    mergeResultWithSuccess
} from "@integral-software/react-utilities";
import { createSlice } from "@reduxjs/toolkit";
import { t } from "i18next";

type domainNewResultType = "clearResult" | "saveResult";

export interface DomainNewStateModel {
    domain?: DomainNewModel;
    result: Record<domainNewResultType, ResultModel>;
}

function defaultState(): DomainNewStateModel {
    return {
        result: {
            clearResult: defaultResultModel(),
            saveResult: defaultResultModel(),
        },
    };
}

export const domainNewSlice = createSlice({
    name: "domainNew",
    initialState: defaultState(),
    reducers: {
        clearReducer: () => defaultState(),
        saveReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<domainNewResultType>(state, action, "saveResult")
            },
        }),
        saveSuccessReducer: (state, action) => ({
            ...state,
            domain: action.payload,
            result: {
                ...mergeResultWithSuccess<domainNewResultType>(state, action, "saveResult", t("domain_new_save_success_message")),
            },
        }),
        saveErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<domainNewResultType>(state, action, "saveResult"),
            },
        }),
    },
});

export default domainNewSlice.reducer;
