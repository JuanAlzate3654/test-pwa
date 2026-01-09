import { routeMapSlice, type RouteMapStateModel } from '@components/domain/routeMap/_redux/routeMapReducer';
import { globalStore, isSuccess, LateralDialog, LoadDiv2, useGlobalSelector } from '@integral-software/react-utilities';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Tooltip } from '@mui/material';
import { APP_ID } from '@store/store';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import PopupContent from './PopupContent';
import './RouteMap.css';
type Bounds = {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
};

export default function MapView() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const userMarker = useRef<maplibregl.Marker | null>(null);
    const watchId = useRef<number | null>(null);
    const { t } = useTranslation();
    const { id } = useParams();
    const { result, domain } = useGlobalSelector<RouteMapStateModel>(APP_ID, ({ routeMap }) => routeMap);
    const lastUserLocation = useRef<{ lng: number; lat: number } | null>(null);
    const navigate = useNavigate();

    const goToDetailEdit = () => {
        void navigate(`${id}/detail-edit`, { relative: "route" });
    };

    const goToEditRouteEvidence = () => {
        void navigate(`${id}/evidence-edit`, { relative: "route" });
    };

    const goToSurvey = () => {
        void navigate(`${id}/survey`, { relative: "route" });
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

    const drawRoute = (geometry: GeoJSON.LineString) => {
        if (!mapInstance.current) return;

        const map = mapInstance.current;

        if (map.getSource('route')) {
            (map.getSource('route') as maplibregl.GeoJSONSource)
                .setData({
                    type: 'Feature',
                    geometry,
                    properties: {}
                });
            return;
        }

        map.addSource('route', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry,
                properties: {}
            }
        });

        map.addLayer({
            id: 'route-layer',
            type: 'line',
            source: 'route',
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

    const fetchRoute = async () => {
        if (domain?.start && domain?.end && mapInstance.current) {
            const geometry = await getRoute(domain.start, domain.end);
            if (geometry) {
                drawRoute(geometry);
            } else {
                console.warn('No se pudo dibujar la ruta: datos no válidos');
            }
        }
    };

    const drawGeoJson = async () => {
        if (!mapInstance.current) return;
        const map = mapInstance.current;

        if (map.getLayer('geojson-polygon')) {
            map.removeLayer('geojson-polygon');
        }
        if (map.getLayer('geojson-polygon-outline')) {
            map.removeLayer('geojson-polygon-outline');
        }
        if (map.getSource('geojson-polygon')) {
            map.removeSource('geojson-polygon');
        }

        map.addSource('geojson-polygon', {
            type: 'geojson',
            data: domain!.geojson
        });

        map.addLayer({
            id: 'geojson-polygon',
            type: 'fill',
            source: 'geojson-polygon',
            layout: {},
            paint: {
                'fill-color': '#ff9800',
                'fill-opacity': 0.4
            }
        });

        map.addLayer({
            id: 'geojson-polygon-outline',
            type: 'line',
            source: 'geojson-polygon',
            layout: {},
            paint: {
                'line-color': '#ff9800',
                'line-width': 2
            }
        });

        map.on('click', 'geojson-polygon', (e) => {
            const feature = e.features && e.features[0];
            if (!feature) return;
            const coordinates = e.lngLat;
            const props = feature.properties;
            const popupContainer = document.createElement('div');
            const root = ReactDOM.createRoot(popupContainer);
            goToInMap([coordinates.lng, coordinates.lat], 14);
            root.render(<PopupContent properties={props} goToDetailEdit={goToDetailEdit} goToSurvey={goToSurvey} goToEditRouteEvidence={goToEditRouteEvidence} />);

            new maplibregl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupContainer)
                .addTo(map);
        });

        map.on('mouseenter', 'geojson-polygon', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'geojson-polygon', () => {
            map.getCanvas().style.cursor = '';
        });
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

    const getUserLocation = (): Promise<{ lng: number; lat: number }> =>
        new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocalización no soportada');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                pos =>
                    resolve({
                        lng: pos.coords.longitude,
                        lat: pos.coords.latitude,
                    }),
                err => reject(err),
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });

    const lonLatToTile = (lon: number, lat: number, zoom: number) => {
        const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
        const y = Math.floor(
            ((1 -
                Math.log(
                    Math.tan((lat * Math.PI) / 180) +
                    1 / Math.cos((lat * Math.PI) / 180)
                ) /
                Math.PI) /
                2) *
            Math.pow(2, zoom)
        );
        return { x, y };
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
            fetchRoute();
            drawGeoJson();
        });
    };

    const goToInMap = async (center: any, zoom: number) => {
        if (!mapInstance.current) return;

        try {
            mapInstance.current.easeTo({ center, zoom, duration: 1000 });
        } catch {
            console.warn('No se pudo recentrar');
        }
    };

    async function downloadTiles(bounds: Bounds, zoom: number) {
        const cache = await caches.open('map-tiles');

        const minTile = lonLatToTile(bounds.minLon, bounds.maxLat, zoom);
        const maxTile = lonLatToTile(bounds.maxLon, bounds.minLat, zoom);

        for (let x = minTile.x; x <= maxTile.x; x++) {
            for (let y = minTile.y; y <= maxTile.y; y++) {
                const url = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                if (!(await cache.match(url))) {
                    try {
                        const res = await fetch(url);
                        if (res.ok) await cache.put(url, res.clone());
                    } catch (e) {
                        console.warn('Tile no descargado', url);
                    }
                }
            }
        }
    }

    async function downloadRoute(
        start: [number, number],
        end: [number, number]
    ) {
        const url =
            `https://router.project-osrm.org/route/v1/driving/` +
            `${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

        try {
            await fetch(url, { cache: 'no-store' });
        } catch (e) {
            console.warn('No se pudo descargar la ruta', e);
        }
    }

    useEffect(() => {
        if (id) {
            globalStore.DispatchAction(APP_ID, routeMapSlice.actions.findOneReducer({ id }));
        }
    }, [id]);

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
            Sticky={
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        onClick={async () => {
                            const bounds = getCurrentBounds();
                            if (!bounds || !mapInstance.current) return;

                            const z = Math.floor(mapInstance.current.getZoom());
                            for (let zoom = z - 1; zoom <= z + 1; zoom++) {
                                await downloadTiles(bounds, zoom);
                                await downloadRoute(domain!.start, domain!.end);
                            }
                        }}
                    >
                        {t('domain_map_download_tiles_button')}
                    </Button>

                    <Tooltip title={t('domain_map_refresh_button_tooltip')} arrow>
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

                    <Tooltip title={t('domain_map_recenter_button_tooltip')} arrow>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (!lastUserLocation.current) {
                                    console.warn('Ubicación aún no disponible');
                                    return;
                                }

                                goToInMap([
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
            <Outlet />
        </LateralDialog>
    );
}