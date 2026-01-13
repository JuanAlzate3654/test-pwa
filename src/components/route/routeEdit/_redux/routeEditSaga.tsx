import type { RouteEditModel } from "@components/route/routeEdit/_redux/model";
import { routeEditSlice } from "@components/route/routeEdit/_redux/routeEditReducer";
import type { RouteEditGR } from "@components/route/routeEdit/_redux/RouteEditService";
import { RouteEditService } from "@components/route/routeEdit/_redux/RouteEditService";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeEditService = new RouteEditService();

export function* findOneSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<RouteEditGR, any> = yield call(
            [routeEditService, routeEditService.find],
            action.payload.id
        )
        if (response.data?.errors) {
            yield put(routeEditSlice.actions.findOneErrorReducer(handleError(response)));
            return;
        }
        yield put(
            routeEditSlice.actions.findOneSuccessReducer(response)
        );
    } catch (e) {
        yield put(routeEditSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<RouteEditModel>) {
    try {
        const response: AxiosResponse<RouteEditGR, any> = yield call(
            [routeEditService, routeEditService.update],
            action.payload
        )
        if (response.data?.errors) {
            yield put(routeEditSlice.actions.saveErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(
            routeEditSlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(routeEditSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* routeEdit_WatchAsync() {
    yield all([
        takeEvery(routeEditSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(routeEditSlice.actions.saveReducer.type, saveSaga),
    ]);
}
