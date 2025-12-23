import DomainEdit from "@components/domain/domainEdit/DomainEdit";
import DomainList from "@components/domain/domainList/DomainList";
import MapView from "@components/domain/domainMap/DomainMap";
import DomainNew from "@components/domain/domainNew/DomainNew";
import { RouterWithDialog } from "@integral-software/react-utilities";
import { Suspense } from 'react';
import { Route, Routes, useLocation } from "react-router-dom";

export default function DomainRoutes() {

    const location = useLocation();
    // Espera que start y end estén en location.state si se navega con navigate('/map', { state: { start, end } })
    const mapProps = location.state && (location.state.start || location.state.end)
        ? { start: location.state.start, end: location.state.end }
        : {};


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
                            <MapView {...mapProps} />
                        </Suspense>
                    } />
            </Route>
        </Routes>
    );
}