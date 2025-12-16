import {
    defaultResultModel,
    mergeResultWithError,
    mergeResultWithLoading,
    mergeResultWithSuccess,
    type ResultModel,
} from "@integral-software/react-utilities";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

import type { UserModel } from ".";

type UserStateModelType = 'findUserReducer' | 'updateUserReducer' | 'logoutUserReducer'

export interface UserStateModel {
    user: UserModel | undefined;
    result: Record<UserStateModelType, ResultModel>;
}

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: {
            name: "",
            mode: "dark",
            roles: new Array<string>()
        },
        result: {
            findUserReducer: defaultResultModel(),
            updateUserReducer: defaultResultModel(),
            logoutUserReducer: defaultResultModel()
        },
    } as UserStateModel,
    reducers: {
        findUserReducer: (state, action: PayloadAction) => ({
            ...state,
            result: {
                ...mergeResultWithLoading<UserStateModelType>(state, action, "findUserReducer")
            },
        } as UserStateModel),
        findUserSuccessReducer: (state, action) => ({
            ...state,
            user: {...action.payload},
            result: {
                ...mergeResultWithSuccess<UserStateModelType>(state, action, "findUserReducer")
            },
        } as UserStateModel),
        findUserErrorReducer: (state, action) => ({
            ...state,
            result: {
                ...mergeResultWithError<UserStateModelType>(state, action, "findUserReducer")
            },
        } as UserStateModel),
    },
});