import {LinearProgress} from "@mui/material";
import React from "react";
import {useSelector} from "react-redux";

import type {LinearProgressStateModel} from "./_redux/linearProgressReducer";

export default function LinearProgressBar() {

    const {showIndex} = useSelector(({linearProgress}: any) => linearProgress) as LinearProgressStateModel;

    if (showIndex === 0)
        return <></>;

    return (
        <div style={{width: '100%', zIndex: 10001, position: "absolute"}}>
            <LinearProgress/>
        </div>
    );
}