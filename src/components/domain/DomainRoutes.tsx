import DomainEdit from "@components/domain/domainEdit/DomainEdit";
import DomainList from "@components/domain/domainList/DomainList";
import MapView from "@components/domain/domainMap/DomainMap";
import DomainNew from "@components/domain/domainNew/DomainNew";
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
                <Route path="map"
                    element={
                        <Suspense fallback={"🌀 Loading"}>
                            <MapView />
                        </Suspense>
                    } />
            </Route>
        </Routes>
    );
}