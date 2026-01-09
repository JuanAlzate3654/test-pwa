import { RouteMapService } from "@components/domain/routeMap/_redux/RouteMapService";
import type { RouteMapModel } from "@components/domain/routeMap/_redux/model";
import { routeMapSlice } from "@components/domain/routeMap/_redux/routeMapReducer";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeMapService = new RouteMapService();

export function* findOneSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<RouteMapModel, any> = yield call(
            [routeMapService, routeMapService.find],
            action.payload.id
        )
        yield put(
            routeMapSlice.actions.findOneSuccessReducer(response.data)
        );
    } catch (e) {
        yield put(routeMapSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<RouteMapModel>) {
    try {
        yield call(
            [routeMapService, routeMapService.update],
            action.payload
        )
        yield put(
            routeMapSlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(routeMapSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* routeMap_WatchAsync() {
    yield all([
        takeEvery(routeMapSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(routeMapSlice.actions.saveReducer.type, saveSaga),
    ]);
}
