import { domainListSlice } from "@components/domain/domainList/_redux/domainListReducer";
import type { DomainListGR } from "@components/domain/domainList/_redux/DomainListService";
import { DomainListService } from "@components/domain/domainList/_redux/DomainListService";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const domainListService = new DomainListService();

export function* pageSage(action: any) {
    try {
        const response: AxiosResponse<DomainListGR, any> = yield call(
            [domainListService, domainListService.find],
            action.payload
        )
        if (response.data?.errors) {
            yield put(domainListSlice.actions.pageErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(domainListSlice.actions.pageSuccessReducer({
            pagination: action.payload,
            page: response.data.domainPage,
        })
        );
    } catch (e) {
        yield put(domainListSlice.actions.pageErrorReducer(handleError(e)));
    }
}

export function* deleteSaga(action: PayloadAction<{ group: string, key: string }>) {
    try {
        const response: AxiosResponse<any, any> = yield call(
            [domainListService, domainListService.delete],
            action.payload.group,
            action.payload.key
        );
        if (response) {
            yield put(domainListSlice.actions.deleteErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(domainListSlice.actions.deleteSuccessReducer());
    } catch (e) {
        yield put(domainListSlice.actions.deleteErrorReducer(handleError(e)));
    }
}

export function* enableSaga(action: PayloadAction<{ group: string, key: string }>) {
    try {
        const response: AxiosResponse<any, any> = yield call(
            [domainListService, domainListService.enable],
            action.payload.group, action.payload.key
        );
        if (response.data?.errors) {
            yield put(domainListSlice.actions.enableErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(domainListSlice.actions.enableSuccessReducer(response.data));
    } catch (e) {
        yield put(domainListSlice.actions.enableErrorReducer(handleError(e)));
    }
}

export function* disableSaga(action: PayloadAction<{ group: string, key: string }>) {
    try {
        const response: AxiosResponse<any, any> = yield call(
            [domainListService, domainListService.disable],
            action.payload.group,
            action.payload.key
        );
        if (response.data?.errors) {
            yield put(domainListSlice.actions.disableErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(domainListSlice.actions.disableSuccessReducer(response.data));
    } catch (e) {
        yield put(domainListSlice.actions.disableErrorReducer(handleError(e)));
    }
}

export function* domainList_WatchAsync() {
    yield all([
        takeEvery(domainListSlice.actions.pageReducer.type, pageSage),
        takeEvery(domainListSlice.actions.deleteReducer.type, deleteSaga),
        takeEvery(domainListSlice.actions.enableReducer.type, enableSaga),
        takeEvery(domainListSlice.actions.disableReducer.type, disableSaga),
    ]);
}
