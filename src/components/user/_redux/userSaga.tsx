import type { AxiosResponse } from "axios";
import {all, put, takeEvery} from "redux-saga/effects";

import type { UserModel } from ".";
import {userSlice} from "./userReducer";
import {UserService} from "./UserService";

const userService = new UserService();

export function* findUserSaga() {
    try {
        const response: AxiosResponse<UserModel, any> = yield userService.principal();
        yield put(userSlice.actions.findUserSuccessReducer(response.data));
    } catch (e) {
        yield put(userSlice.actions.findUserErrorReducer(e));
    }
}

export function* user_WatchAsync() {
    yield all([
        takeEvery(userSlice.actions.findUserReducer, findUserSaga),
    ]);
}
