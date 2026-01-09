import type { RouteSurveyModel } from "@components/domain/routeSurvey/_redux/model";
import { routeSurveySlice } from "@components/domain/routeSurvey/_redux/routeSurveyReducer";
import { RouteSurveyService } from "@components/domain/routeSurvey/_redux/RouteSurveyService";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeSurveyService = new RouteSurveyService();

export function* findOneSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<RouteSurveyModel, any> = yield call(
            [routeSurveyService, routeSurveyService.find],
            action.payload.id
        )
        yield put(
            routeSurveySlice.actions.findOneSuccessReducer(response.data)
        );
    } catch (e) {
        yield put(routeSurveySlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<RouteSurveyModel>) {
    try {
        const response: AxiosResponse<RouteSurveyModel, any> = yield call(
            [routeSurveyService, routeSurveyService.update],
            action.payload
        )
        yield put(
            routeSurveySlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(routeSurveySlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* routeSurvey_WatchAsync() {
    yield all([
        takeEvery(routeSurveySlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(routeSurveySlice.actions.saveReducer.type, saveSaga),
    ]);
}
