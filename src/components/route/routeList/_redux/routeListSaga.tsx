import type { RouteListModel } from "@components/route/routeList/_redux/model";
import { routeListSlice } from "@components/route/routeList/_redux/routeListReducer";
import { RouteListService } from "@components/route/routeList/_redux/RouteListService";
import { handleError } from "@integral-software/react-utilities";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const routeListService = new RouteListService();

export function* pageSage(action: any) {
    try {
        const response: AxiosResponse<RouteListModel, any> = yield call(
            [routeListService, routeListService.find],
            action.payload
        )
        yield put(routeListSlice.actions.pageSuccessReducer({
            pagination: action.payload,
            page: response,
        })
        );
    } catch (e) {
        yield put(routeListSlice.actions.pageErrorReducer(handleError(e)));
    }
}

export function* deleteSaga(action: PayloadAction<{ id: string }>) {
    try {
        const response: AxiosResponse<any, any> = yield call(
            [routeListService, routeListService.delete],
            action.payload.id
        );
        if (response) {
            yield put(routeListSlice.actions.deleteErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(routeListSlice.actions.deleteSuccessReducer());
    } catch (e) {
        yield put(routeListSlice.actions.deleteErrorReducer(handleError(e)));
    }
}

export function* routeList_WatchAsync() {
    yield all([
        takeEvery(routeListSlice.actions.pageReducer.type, pageSage),
        takeEvery(routeListSlice.actions.deleteReducer.type, deleteSaga)
    ]);
}
