import RouteDetailEdit from "@components/route/routeDetailEdit/RouteDetailEdit";
import RouteEdit from "@components/route/routeEdit/RouteEdit";
import RouteEvidenceEdit from "@components/route/routeEvidenceEdit/RouteEvidenceEdit";
import RouteList from "@components/route/routeList/RouteList";
import MapView from "@components/route/routeMap/RouteMap";
import RouteSurvey from "@components/route/routeSurvey/RouteSurvey";
import { RouterWithDialog } from "@integral-software/react-utilities";
import { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";

export default function RouteRoutes() {

    return (
        <Routes>
            <Route path="/" element={
                <Suspense fallback={"🌀 Loading"}>
                    <RouterWithDialog component={<RouteList />} />
                </Suspense>
            }>
                <Route path=":id/edit"
                    element={
                        <Suspense fallback={"🌀 Loading"}>
                            <RouteEdit />
                        </Suspense>
                    } />
                <Route path=":id/map"
                    element={
                        <Suspense fallback={"🌀 Loading"}>
                            <MapView />
                        </Suspense>
                    }>
                    <Route path=":id/detail-edit"
                        element={
                            <Suspense fallback={"🌀 Loading"}>
                                <RouteDetailEdit />
                            </Suspense>
                        } />
                    <Route path=":id/evidence-edit"
                        element={
                            <Suspense fallback={"🌀 Loading"}>
                                <RouteEvidenceEdit />
                            </Suspense>
                        } />
                    <Route path=":id/survey"
                        element={
                            <Suspense fallback={"🌀 Loading"}>
                                <RouteSurvey />
                            </Suspense>
                        } />
                </Route>
            </Route>
        </Routes>
    );
}