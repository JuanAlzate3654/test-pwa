import DomainRoutes from "@components/domain/DomainRoutes";
import Dashboard from "@components/home/dashboard/Dashboard";
import { ThemeProvider } from "@mui/material";
import type { OfflineFile } from "@openDB/model";
import { dbPromise } from "@openDB/openDB";
import { PWAProvider, usePWA } from "@pwa/PWAProvider";
import { Suspense, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Home from "./components/home/Home";
import LinearProgressBar from "./components/home/linearprogress/LinearProgressBar";
import Code404 from "./core/libraries/httpstatuscodes/Code404";
import "./index.css";
import { store } from "./store/store";
import { darkTheme, lightTheme } from "./theme/customPalette";
const App = () => {
    const [actualTheme, setActualTheme] = useState<"light" | "dark">("dark");
    const { offlineReady, needRefresh } = usePWA()
    const theme = useMemo(
        () => {
            return (actualTheme === "light" ? lightTheme : darkTheme);
        },
        [actualTheme]
    );
    const themeModeHandler = (mode?: "light" | "dark") => {
        mode ? setActualTheme(mode) : setActualTheme(actualTheme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        if (offlineReady && !localStorage.getItem('pwa-offline-ready')) {
            localStorage.setItem('pwa-offline-ready', 'true')
            toast.info('App lista para usarse offline')
        }
    }, [offlineReady])

    useEffect(() => {
        if (needRefresh && !sessionStorage.getItem('pwa-update-toast')) {
            sessionStorage.setItem('pwa-update-toast', 'true')
            toast.info('Nueva versión disponible')
        }
    }, [needRefresh])

    async function handleOnline() {
        const db = await dbPromise;
        const requests = await db.getAll('offlineQueue');

        for (const req of requests) {
            try {
                const formData = new FormData();

                Object.entries(req.data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                req.files?.forEach((file: OfflineFile) => {
                    const blob = new Blob([file.data], { type: file.type });
                    formData.append(file.field, blob, file.name);
                });

                req.images?.forEach((image: OfflineFile) => {
                    const blob = new Blob([image.data], { type: image.type });
                    formData.append(image.field, blob, image.name);
                });

                const url = (import.meta.env.VITE_API_URL || '/api') + '/v1/domains';

                await fetch(url, {
                    method: req.method,
                    body: formData
                });

                await db.delete('offlineQueue', req.id!);
            } catch (err) {
                console.error('Error reenviando request offline', err);
            }
        }
    }

    const handleOffline = () => {
        console.log('Se perdió la conexión');
    };

    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
    }, []);

    return (
        <Provider store={store}>
            <HashRouter>
                <ThemeProvider theme={theme}>
                    <LinearProgressBar />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Home mode={actualTheme} switchMode={themeModeHandler} />
                            }
                        >
                            <Route path="" element={<Dashboard />} />
                            <Route
                                path="/config/*"
                                element={
                                    <Suspense fallback={"🌀 Loading"}>
                                        <DomainRoutes />
                                    </Suspense>
                                }
                            />
                        </Route>
                        <Route path="*" element={<Code404 />} />
                    </Routes>
                    <ToastContainer theme={actualTheme} />
                </ThemeProvider>
            </HashRouter>
        </Provider>
    );
};

const container = document.getElementById("app");
const root = createRoot(container!);
root.render(
    <PWAProvider>
        <App />
    </PWAProvider>
)
