import { DomainMapService } from "@components/domain/domainMap/_redux/DomainMapService";
import { domainMapSlice } from "@components/domain/domainMap/_redux/domainMapReducer";
import type { DomainMapModel } from "@components/domain/domainMap/_redux/model";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const domainMapService = new DomainMapService();

export function* findOneSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<DomainMapModel, any> = yield call(
            [domainMapService, domainMapService.find],
            action.payload.id
        )
        yield put(
            domainMapSlice.actions.findOneSuccessReducer(response.data)
        );
    } catch (e) {
        yield put(domainMapSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<DomainMapModel>) {
    try {
        yield call(
            [domainMapService, domainMapService.update],
            action.payload
        )
        yield put(
            domainMapSlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(domainMapSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* domainMap_WatchAsync() {
    yield all([
        takeEvery(domainMapSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(domainMapSlice.actions.saveReducer.type, saveSaga),
    ]);
}
