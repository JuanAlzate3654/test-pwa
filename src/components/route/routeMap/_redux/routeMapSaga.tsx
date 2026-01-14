import type { RouteMapModel } from "@components/route/routeMap/_redux/model";
import { routeMapSlice } from "@components/route/routeMap/_redux/routeMapReducer";
import { RouteMapService } from "@components/route/routeMap/_redux/RouteMapService";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeMapService = new RouteMapService();

export function* findOneSaga(action: PayloadAction<{ cbmls: string[] }>) {
    try {
        const response: AxiosResponse<RouteMapModel, any> = yield call(
            [routeMapService, routeMapService.find],
            action.payload.cbmls
        )
        yield put(
            routeMapSlice.actions.findOneSuccessReducer(response)
        );
    } catch (e) {
        yield put(routeMapSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* loadMapSaga() {
    try {
        yield call(
            [routeMapService, routeMapService.loadMap]
        )
        yield put(
            routeMapSlice.actions.loadMapSuccessReducer()
        );
    } catch (e) {
        yield put(routeMapSlice.actions.loadMapErrorReducer(handleError(e)));
    }
}

export function* downloadMapSaga(action: PayloadAction<{ bounds: any, zoom: number }>) {
    try {
        yield call(
            [routeMapService, routeMapService.downloadMap],
            action.payload.bounds, action.payload.zoom
        )
        yield put(
            routeMapSlice.actions.downloadMapSuccessReducer()
        );
    } catch (e) {
        yield put(routeMapSlice.actions.downloadMapErrorReducer(handleError(e)));
    }
}

export function* downloadRoutesMapSaga(action: PayloadAction<{ routes: any }>) {
    try {
        yield call(
            [routeMapService, routeMapService.downloadRoutesMap],
            action.payload.routes
        )
        yield put(
            routeMapSlice.actions.downloadRoutesMapSuccessReducer()
        );
    } catch (e) {
        yield put(routeMapSlice.actions.downloadRoutesMapErrorReducer(handleError(e)));
    }
}

export function* routeMap_WatchAsync() {
    yield all([
        takeEvery(routeMapSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(routeMapSlice.actions.downloadMapReducer.type, downloadMapSaga),
        takeEvery(routeMapSlice.actions.downloadRoutesMapReducer.type, downloadRoutesMapSaga),
    ]);
}
