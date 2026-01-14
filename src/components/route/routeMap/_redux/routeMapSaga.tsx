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
            routeMapSlice.actions.findOneSuccessReducer(response.data)
        );
    } catch (e) {
        yield put(routeMapSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* routeMap_WatchAsync() {
    yield all([
        takeEvery(routeMapSlice.actions.findOneReducer.type, findOneSaga),
    ]);
}
