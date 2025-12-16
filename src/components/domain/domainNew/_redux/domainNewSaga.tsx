import { domainNewSlice } from "@components/domain/domainNew/_redux/domainNewReducer";
import type { DomainNewGR } from "@components/domain/domainNew/_redux/DomainNewService";
import { DomainNewService } from "@components/domain/domainNew/_redux/DomainNewService";
import { handleError } from "@integral-software/react-utilities";
import type { AxiosResponse } from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";

const domainService = new DomainNewService();

export function* saveSaga(action: any) {
    try {
        const response: AxiosResponse<DomainNewGR, any> = yield call(
            [domainService, domainService.save],
            action.payload
        )
        if (response.data?.errors) {
            yield put(domainNewSlice.actions.saveErrorReducer(handleError(response.data.errors)));
            return;
        }
        yield put(domainNewSlice.actions.saveSuccessReducer(response.data));
    } catch (e) {
        yield put(domainNewSlice.actions.saveErrorReducer(handleError(e)));
    }
}

export function* domainNew_WatchAsync() {
    yield all([
        takeEvery(domainNewSlice.actions.saveReducer.type, saveSaga),
    ]);
}
