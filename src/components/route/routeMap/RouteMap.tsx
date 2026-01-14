import 'maplibre-gl/dist/maplibre-gl.css';
import './RouteMap.css';

import { routeMapSlice, type RouteMapStateModel } from '@components/route/routeMap/_redux/routeMapReducer';
import { globalStore, isLoading, isSuccess, LateralDialog, LoadDiv2, useGlobalSelector } from '@integral-software/react-utilities';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Tooltip } from '@mui/material';
import { APP_ID } from '@store/store';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PopupContent from './PopupContent';

export interface MapViewProps {
    cbmls: string[];
    setMapIsActive: (isActive: boolean) => void;
}

export default function MapView({ cbmls, setMapIsActive }: MapViewProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const userMarker = useRef<maplibregl.Marker | null>(null);
    const watchId = useRef<number | null>(null);
    const { t } = useTranslation();
    const { result, routes } = useGlobalSelector<RouteMapStateModel>(APP_ID, ({ routeMap }) => routeMap);
    const lastUserLocation = useRef<{ lng: number; lat: number } | null>(null);
    const navigate = useNavigate();
    type Bounds = {
        minLon: number;
        minLat: number;
        maxLon: number;
        maxLat: number;
    };
    const goToDetailEdit = (id: string) => {
        void navigate(`${id}/detail-edit`, { relative: "route" });
    };

    const goToEditRouteEvidence = (id: string) => {
        void navigate(`${id}/evidence-edit`, { relative: "route" });
    };

    const goToSurvey = (id: string) => {
        void navigate(`${id}/survey`, { relative: "route" });
    };

    const drawRoute = (cbml: string, geometry: GeoJSON.LineString) => {
        if (!mapInstance.current) return;

        const map = mapInstance.current;

        if (map.getSource(`route-${cbml}`)) {
            (map.getSource(`route-${cbml}`) as maplibregl.GeoJSONSource)
                .setData({
                    type: 'Feature',
                    geometry,
                    properties: {}
                });
            return;
        }

        map.addSource(`route-${cbml}`, {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry,
                properties: {}
            }
        });

        map.addLayer({
            id: `route-layer-${cbml}`,
            type: 'line',
            source: `route-${cbml}`,
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#1976d2',
                'line-width': 5
            }
        });
    };

    const getPolygonColor = (route: any) => {
        if (route.geojson.properties.bitacoraActividades.length == 0) {
            return "#b700ff"
        }
        else if (route.geojson.properties.bitacoraActividades.length <= 2) {
            return "#ff9800"
        }
        return "#00ff40"
    }

    const drawGeoJson = async () => {
        if (!mapInstance.current) return;
        const map = mapInstance.current;

        for (const route of routes!) {

            if (map.getLayer(`geojson-polygon-${route.cbml}`)) {
                map.removeLayer(`geojson-polygon-${route.cbml}`);
            }
            if (map.getLayer(`geojson-polygon-outline-${route.cbml}`)) {
                map.removeLayer(`geojson-polygon-outline-${route.cbml}`);
            }
            if (map.getSource(`geojson-polygon-${route.cbml}`)) {
                map.removeSource(`geojson-polygon-${route.cbml}`);
            }

            map.addSource(`geojson-polygon-${route.cbml}`, {
                type: 'geojson',
                data: route.geojson
            });
            map.addLayer({
                id: `geojson-polygon-${route.cbml}`,
                type: 'fill',
                source: `geojson-polygon-${route.cbml}`,
                layout: {},
                paint: {
                    'fill-color': getPolygonColor(route),
                    'fill-opacity': 0.4
                }
            });

            map.addLayer({
                id: `geojson-polygon-outline-${route.cbml}`,
                type: 'line',
                source: `geojson-polygon-${route.cbml}`,
                layout: {},
                paint: {
                    'line-color': getPolygonColor(route),
                    'line-width': 2
                }
            });

            map.on('click', `geojson-polygon-${route.cbml}`, (e) => {
                const feature = e.features && e.features[0];
                if (!feature) return;
                const coordinates = e.lngLat;
                const props = feature.properties;
                const popupContainer = document.createElement('div');
                const root = ReactDOM.createRoot(popupContainer);
                void goToInMap([coordinates.lng, coordinates.lat], 14);
                root.render(<PopupContent properties={props} goToDetailEdit={goToDetailEdit} goToSurvey={goToSurvey} goToEditRouteEvidence={goToEditRouteEvidence} />);

                new maplibregl.Popup()
                    .setLngLat(coordinates)
                    .setDOMContent(popupContainer)
                    .addTo(map);
            });

            map.on('mouseenter', `geojson-polygon-${route.cbml}`, () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', `geojson-polygon-${route.cbml}`, () => {
                map.getCanvas().style.cursor = '';
            });
        }
    }

    const getCurrentBounds = (): Bounds | null => {
        if (!mapInstance.current) return null;
        const b = mapInstance.current.getBounds();

        return {
            minLon: b.getWest(),
            minLat: b.getSouth(),
            maxLon: b.getEast(),
            maxLat: b.getNorth(),
        };
    };

    const createUserMarkerElement = () => {
        const el = document.createElement('div');
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.style.background = '#1976d2';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 6px rgba(0,0,0,0.4)';
        return el;
    };

    const startTrackingUser = () => {
        if (!navigator.geolocation || !mapInstance.current) return;

        watchId.current = navigator.geolocation.watchPosition(
            pos => {
                const lngLat = {
                    lng: pos.coords.longitude,
                    lat: pos.coords.latitude,
                };

                lastUserLocation.current = lngLat;

                if (!userMarker.current) {
                    userMarker.current = new maplibregl.Marker({
                        element: createUserMarkerElement(),
                    })
                        .setLngLat([lngLat.lng, lngLat.lat])
                        .addTo(mapInstance.current!);
                } else {
                    userMarker.current.setLngLat([lngLat.lng, lngLat.lat]);
                }
            },
            err => console.error('GPS error', err),
            { enableHighAccuracy: true, maximumAge: 2000 }
        );

    };

    const stopTrackingUser = () => {
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
    };

    const destroyMap = () => {
        stopTrackingUser();
        userMarker.current?.remove();
        userMarker.current = null;

        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };

    const loadMap = () => {
        if (!mapRef.current || mapInstance.current) return;

        mapInstance.current = new maplibregl.Map({
            container: mapRef.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: 'raster',
                        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                        tileSize: 256,
                    },
                },
                layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
            },
            center: [-75.5812, 6.2442],
            zoom: 12,
        });

        mapInstance.current.on('load', () => {
            startTrackingUser();
            void fetchRoute();
            void drawGeoJson();
        });
    };

    const fetchRoute = async () => {
        if (mapInstance.current) {

            for (const route of routes!) {
                const geometry = await getRoute(route.start!, route.end!);
                if (geometry) {
                    drawRoute(route.cbml, geometry);
                } else {
                    console.warn('No se pudo dibujar la ruta: datos no válidos');
                }
            }
        }
    };

    async function getRoute(
        start: [number, number],
        end: [number, number]
    ) {
        const url = `https://router.project-osrm.org/route/v1/driving/` +
            `${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (!data.routes || !data.routes.length) {
                console.warn('No se encontró ruta OSRM', data);
                return null;
            }
            return data.routes[0].geometry;
        } catch (err) {
            console.error('Error obteniendo ruta OSRM', err);
            return null;
        }
    }

    const goToInMap = async (center: any, zoom: number) => {
        if (!mapInstance.current) return;

        try {
            mapInstance.current.easeTo({ center, zoom, duration: 1000 });
        } catch {
            console.warn('No se pudo recentrar');
        }
    };

    async function downloadTiles(bounds: Bounds, zoom: number) {
        globalStore.DispatchAction(APP_ID, routeMapSlice.actions.downloadMapReducer({ bounds, zoom }));
    }

    async function downloadRoutes() {
        globalStore.DispatchAction(APP_ID, routeMapSlice.actions.downloadRoutesMapReducer({ routes }));
    }

    useEffect(() => {
        if (isSuccess(result.downloadMapResult)) {
            toast.success(t('route_map_download_tiles_success_toast'));
        }
    }, [result.downloadMapResult]);

    useEffect(() => {
        if (isSuccess(result.downloadRoutesMapResult)) {
            toast.success(t('route_map_download_routes_success_toast'));
        }
    }, [result.downloadRoutesMapResult]);

    useEffect(() => {
        if (cbmls) {
            globalStore.DispatchAction(APP_ID, routeMapSlice.actions.findOneReducer({ cbmls: cbmls }));
        }
    }, [cbmls]);

    useEffect(() => {
        if (isSuccess(result.findOneResult)) {
            const timeoutId = setTimeout(() => {
                loadMap();
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                destroyMap();
            };
        }
    }, [result.findOneResult]);

    useEffect(() => {
        globalStore.DispatchAction(APP_ID, routeMapSlice.actions.clearReducer());
    }, []);

    return (
        <LateralDialog
            width={{ xs: '100%', sm: '100%', md: '100%' }}
            sx={{ overflow: 'hidden', padding: 0 }}
            onClose={() => {
                setMapIsActive(false);
            }}
            Sticky={
                <Box sx={{ display: 'flex', gap: 1 }}>

                    <Button loading={isLoading(result.downloadMapResult)}
                        onClick={async () => {
                            const bounds = getCurrentBounds();
                            if (!bounds || !mapInstance.current) return;

                            const z = Math.floor(mapInstance.current.getZoom());
                            for (let zoom = z - 1; zoom <= z + 1; zoom++) {
                                await downloadTiles(bounds, zoom);
                                await downloadRoutes();
                            }
                        }}
                    >
                        {t('route_map_download_tiles_button')}
                    </Button>

                    <Tooltip title={t('route_map_refresh_button_tooltip')} arrow>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                destroyMap();
                                loadMap();
                            }}
                        >
                            <RefreshIcon />
                        </Button>
                    </Tooltip>

                    <Tooltip title={t('route_map_recenter_button_tooltip')} arrow>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (!lastUserLocation.current) {
                                    console.warn('Ubicación aún no disponible');
                                    return;
                                }

                                void goToInMap([
                                    lastUserLocation.current.lng,
                                    lastUserLocation.current.lat
                                ], 16);
                            }}
                        >
                            <MyLocationIcon />
                        </Button>
                    </Tooltip>
                </Box>
            }
        >
            <LoadDiv2 result={result.findOneResult}>
                <Box ref={mapRef} style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    padding: 0
                }} />
            </LoadDiv2>
        </LateralDialog>
    );
}