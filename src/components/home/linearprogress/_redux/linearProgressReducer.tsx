import { mergeResultWithSuccess } from "@integral-software/react-utilities";
import {createSlice} from "@reduxjs/toolkit";

type linearProgressApplyResult = "clearReducer" | "showReducer" | "hideReducer"

export interface LinearProgressStateModel {
    showIndex: number;
}

const defaultValue = (): LinearProgressStateModel => ({
    showIndex: 0,
} as LinearProgressStateModel);

export const linearProgressApplySlice = createSlice({
    name: "linearProgress",
    initialState: defaultValue(),
    reducers: {
        clearReducer: () => defaultValue(),
        showReducer: (state, action) => ({
            ...state,
            showIndex: state.showIndex + 1,
            result: {
                ...mergeResultWithSuccess<linearProgressApplyResult>(state, action, "showReducer"),
            },
        }),
        hideReducer: (state, action) => ({
            ...state,
            showIndex: (state.showIndex > 0) ? state.showIndex - 1 : 0,
            result: {
                ...mergeResultWithSuccess<linearProgressApplyResult>(state, action, "hideReducer"),
            },
        })
    },
});

export default linearProgressApplySlice.reducer;