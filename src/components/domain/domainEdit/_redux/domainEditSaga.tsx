import { domainEditSlice } from "@components/domain/domainEdit/_redux/domainEditReducer";
import type { DomainEditGR } from "@components/domain/domainEdit/_redux/DomainEditService";
import { DomainEditService } from "@components/domain/domainEdit/_redux/DomainEditService";
import type { DomainEditModel } from "@components/domain/domainEdit/_redux/model";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const domainEditService = new DomainEditService();

export function* findOneSaga(action: PayloadAction<{ group: string, key: string }>) {
    try {
        const response: AxiosResponse<DomainEditGR, any> = yield call(
            [domainEditService, domainEditService.find],
            action.payload.group,
            action.payload.key
        )
        if (response.data?.errors) {
            yield put(domainEditSlice.actions.findOneErrorReducer(handleError(response)));
            return;
        }
        yield put(
            domainEditSlice.actions.findOneSuccessReducer(response)
        );
    } catch (e) {
        yield put(domainEditSlice.actions.findOneErrorReducer(handleError(e)));
    }
}

export function* saveSaga(action: PayloadAction<DomainEditModel>) {
    try {
        const response: AxiosResponse<DomainEditGR, any> = yield call(
            [domainEditService, domainEditService.update],
            action.payload
        )
        if (response.data?.errors) {
            yield put(domainEditSlice.actions.saveErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(
            domainEditSlice.actions.saveSuccessReducer()
        );
    } catch (e) {
        yield put(domainEditSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* domainEdit_WatchAsync() {
    yield all([
        takeEvery(domainEditSlice.actions.findOneReducer.type, findOneSaga),
        takeEvery(domainEditSlice.actions.saveReducer.type, saveSaga),
    ]);
}
