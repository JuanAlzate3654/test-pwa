import {all, put, takeEvery} from "redux-saga/effects";

import {linearProgressApplySlice} from "./linearProgressReducer";

export function* linearProgress_ShowSaga(action: any) {
    yield put(linearProgressApplySlice.actions.showReducer(action.payload));
}

export function* linearProgress_HideSaga(action: any) {
    yield put(linearProgressApplySlice.actions.hideReducer(action.payload));
}

export function* linearProgress_WatchAsync() {
    yield all([
        takeEvery(linearProgressApplySlice.actions.showReducer, linearProgress_ShowSaga),
        takeEvery(linearProgressApplySlice.actions.hideReducer, linearProgress_HideSaga),
    ]);
}