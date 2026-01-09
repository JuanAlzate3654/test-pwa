import { domainEditSlice } from "@components/domain/domainEdit/_redux/domainEditReducer";
import { domainEdit_WatchAsync } from "@components/domain/domainEdit/_redux/domainEditSaga";
import { domainListSlice } from "@components/domain/domainList/_redux/domainListReducer";
import { domainList_WatchAsync } from "@components/domain/domainList/_redux/domainListSaga";
import { domainNewSlice } from "@components/domain/domainNew/_redux/domainNewReducer";
import { domainNew_WatchAsync } from "@components/domain/domainNew/_redux/domainNewSaga";
import { routeDetailEditSlice } from "@components/domain/routeDetailEdit/_redux/routeDetailEditReducer";
import { routeDetailEdit_WatchAsync } from "@components/domain/routeDetailEdit/_redux/routeDetailEditSaga";
import { routeEvidenceEditSlice } from "@components/domain/routeEvidenceEdit/_redux/routeEvidenceEditReducer";
import { routeEvidenceEdit_WatchAsync } from "@components/domain/routeEvidenceEdit/_redux/routeEvidenceEditSaga";
import { routeMapSlice } from "@components/domain/routeMap/_redux/routeMapReducer";
import { routeMap_WatchAsync } from "@components/domain/routeMap/_redux/routeMapSaga";
import { routeSurveySlice } from "@components/domain/routeSurvey/_redux/routeSurveyReducer";
import { routeSurvey_WatchAsync } from "@components/domain/routeSurvey/_redux/routeSurveySaga";
import { linearProgressApplySlice } from "@components/home/linearprogress/_redux/linearProgressReducer";
import { linearProgress_WatchAsync } from "@components/home/linearprogress/_redux/linearProgressSaga";
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
    domainList: domainListSlice.reducer,
    domainNew: domainNewSlice.reducer,
    domainEdit: domainEditSlice.reducer,
    routeMap: routeMapSlice.reducer,
    routeDetailEdit: routeDetailEditSlice.reducer,
    routeEvidenceEdit: routeEvidenceEditSlice.reducer,
    routeSurvey: routeSurveySlice.reducer,
}

const localWatchSaga = [
    user_WatchAsync,
    linearProgress_WatchAsync,
    domainList_WatchAsync,
    domainNew_WatchAsync,
    domainEdit_WatchAsync,
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