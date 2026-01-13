import { linearProgressApplySlice } from "@components/home/linearprogress/_redux/linearProgressReducer";
import { linearProgress_WatchAsync } from "@components/home/linearprogress/_redux/linearProgressSaga";
import { routeDetailEditSlice } from "@components/route/routeDetailEdit/_redux/routeDetailEditReducer";
import { routeDetailEdit_WatchAsync } from "@components/route/routeDetailEdit/_redux/routeDetailEditSaga";
import { routeEditSlice } from "@components/route/routeEdit/_redux/routeEditReducer";
import { routeEdit_WatchAsync } from "@components/route/routeEdit/_redux/routeEditSaga";
import { routeEvidenceEditSlice } from "@components/route/routeEvidenceEdit/_redux/routeEvidenceEditReducer";
import { routeEvidenceEdit_WatchAsync } from "@components/route/routeEvidenceEdit/_redux/routeEvidenceEditSaga";
import { routeListSlice } from "@components/route/routeList/_redux/routeListReducer";
import { routeList_WatchAsync } from "@components/route/routeList/_redux/routeListSaga";
import { routeMapSlice } from "@components/route/routeMap/_redux/routeMapReducer";
import { routeMap_WatchAsync } from "@components/route/routeMap/_redux/routeMapSaga";
import { routeSurveySlice } from "@components/route/routeSurvey/_redux/routeSurveyReducer";
import { routeSurvey_WatchAsync } from "@components/route/routeSurvey/_redux/routeSurveySaga";
import { userSlice } from "@components/user/_redux/userReducer";
import { user_WatchAsync } from "@components/user/_redux/userSaga";
import { GlobalStore } from '@integral-software/redux-micro-frontend';
import createSagaMiddleware from "@redux-saga/core";
import { configureStore } from "@reduxjs/toolkit";
import { all, spawn } from "redux-saga/effects";

export const APP_ID = "oime_shell_admin";

export const globalStore = GlobalStore.Get();

const sagaMiddleware = createSagaMiddleware();

const localReducer = {
    user: userSlice.reducer,
    linearProgress: linearProgressApplySlice.reducer,
    routeList: routeListSlice.reducer,
    routeEdit: routeEditSlice.reducer,
    routeMap: routeMapSlice.reducer,
    routeDetailEdit: routeDetailEditSlice.reducer,
    routeEvidenceEdit: routeEvidenceEditSlice.reducer,
    routeSurvey: routeSurveySlice.reducer,
}

const localWatchSaga = [
    user_WatchAsync,
    linearProgress_WatchAsync,
    routeList_WatchAsync,
    routeEdit_WatchAsync,
    routeMap_WatchAsync,
    routeDetailEdit_WatchAsync,
    routeEvidenceEdit_WatchAsync,
    routeSurvey_WatchAsync,
]

export const store = configureStore({
    reducer: {
        ...localReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: false,
            serializableCheck: false
        }).concat(sagaMiddleware)
})

globalStore.RegisterStore(APP_ID, store)

export default function* rootSaga() {
    yield all([
        ...localWatchSaga,
    ].map((item: any) => spawn(item)))
}

sagaMiddleware.run(rootSaga);

([
    ...Object.keys(localReducer),
]).forEach(storeName => globalStore.RegisterStore(storeName, store))