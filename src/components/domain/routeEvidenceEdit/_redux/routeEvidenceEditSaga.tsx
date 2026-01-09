import { RouteEvidenceEditService } from "@components/domain/routeEvidenceEdit/_redux/RouteEvidenceEditService";
import type { RouteEvidenceEditModel } from "@components/domain/routeEvidenceEdit/_redux/model";
import { routeEvidenceEditSlice } from "@components/domain/routeEvidenceEdit/_redux/routeEvidenceEditReducer";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeEvidenceEditService = new RouteEvidenceEditService();

export function* findOneSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<RouteEvidenceEditModel, any> = yield call(
            [routeEvidenceEditService, routeEvidenceEditService.find],
            action.payload.id
        )
        yield put(
            routeEvidenceEditSlice.actions.findOneSuccessReducer(response)
        );
    } catch (e) {
        yield put(routeEvidenceEditSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<RouteEvidenceEditModel>) {
    try {
        const response: AxiosResponse<RouteEvidenceEditModel, any> = yield call(
            [routeEvidenceEditService, routeEvidenceEditService.update],
            action.payload
        )
        yield put(
            routeEvidenceEditSlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(routeEvidenceEditSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* deleteSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<any, any> = yield call(
            [routeEvidenceEditService, routeEvidenceEditService.delete],
            action.payload.id
        );
        if (response) {
            yield put(routeEvidenceEditSlice.actions.deleteErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(routeEvidenceEditSlice.actions.deleteSuccessReducer());
    } catch (e) {
        yield put(routeEvidenceEditSlice.actions.deleteErrorReducer(handleError(e)));
    }
}

export function* routeEvidenceEdit_WatchAsync() {
    yield all([
        takeEvery(routeEvidenceEditSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(routeEvidenceEditSlice.actions.saveReducer.type, saveSaga),
    ]);
}
