import type { RouteDetailEditModel } from "@components/domain/routeDetailEdit/_redux/model";
import { routeDetailEditSlice } from "@components/domain/routeDetailEdit/_redux/routeDetailEditReducer";
import { RouteDetailEditService } from "@components/domain/routeDetailEdit/_redux/RouteDetailEditService";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeDetailEditService = new RouteDetailEditService();

export function* findOneSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<RouteDetailEditModel, any> = yield call(
            [routeDetailEditService, routeDetailEditService.find],
            action.payload.id
        )
        yield put(
            routeDetailEditSlice.actions.findOneSuccessReducer(response)
        );
    } catch (e) {
        yield put(routeDetailEditSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<RouteDetailEditModel>) {
    try {
        const response: AxiosResponse<RouteDetailEditModel, any> = yield call(
            [routeDetailEditService, routeDetailEditService.update],
            action.payload
        )
        yield put(
            routeDetailEditSlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(routeDetailEditSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* routeDetailEdit_WatchAsync() {
    yield all([
        takeEvery(routeDetailEditSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(routeDetailEditSlice.actions.saveReducer.type, saveSaga),
    ]);
}
