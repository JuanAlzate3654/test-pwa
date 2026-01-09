import DomainEdit from "@components/domain/domainEdit/DomainEdit";
import DomainList from "@components/domain/domainList/DomainList";
import DomainNew from "@components/domain/domainNew/DomainNew";
import RouteDetailEdit from "@components/domain/routeDetailEdit/RouteDetailEdit";
import RouteEvidenceEdit from "@components/domain/routeEvidenceEdit/RouteEvidenceEdit";
import MapView from "@components/domain/routeMap/RouteMap";
import RouteSurvey from "@components/domain/routeSurvey/RouteSurvey";
import { RouterWithDialog } from "@integral-software/react-utilities";
import { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";

export default function DomainRoutes() {

    return (
        <Routes>
            <Route path="/" element={
                <Suspense fallback={"🌀 Loading"}>
                    <RouterWithDialog component={<DomainList />} />
                </Suspense>
            }>
                <Route path="new"
                    element={
                        <Suspense fallback={"🌀 Loading"}>
                            <DomainNew />
                        </Suspense>
                    } />
                <Route path=":group/:key/edit"
                    element={
                        <Suspense fallback={"🌀 Loading"}>
                            <DomainEdit />
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