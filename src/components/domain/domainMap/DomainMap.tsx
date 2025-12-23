import { LateralDialog } from '@integral-software/react-utilities';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Tooltip } from '@mui/material';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Bounds = {
    minLon: number;
    minLat: number;
    maxLon: number;
    maxLat: number;
};

type DomainMapProps = {
    start?: [number, number];
    end?: [number, number];
    // ...otros props si necesitas
};

export default function MapView({ start, end }: DomainMapProps) {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const userMarker = useRef<maplibregl.Marker | null>(null);
    const watchId = useRef<number | null>(null);
    const { t } = useTranslation();


    async function getRoute(
        start: [number, number],
        end: [number, number]
    ) {
        const url = `https://router.project-osrm.org/route/v1/driving/` +
            `${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;
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
        if (start && end && mapInstance.current) {
            const geometry = await getRoute(start, end);
            if (geometry) {
                drawRoute(geometry);
            } else {
                console.warn('No se pudo dibujar la ruta: datos no válidos');
            }
        }
    };

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
                const lngLat: [number, number] = [
                    pos.coords.longitude,
                    pos.coords.latitude,
                ];

                if (!userMarker.current) {
                    userMarker.current = new maplibregl.Marker({
                        element: createUserMarkerElement(),
                    })
                        .setLngLat(lngLat)
                        .addTo(mapInstance.current!);
                } else {
                    userMarker.current.setLngLat(lngLat);
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
            recenterMap();
            fetchRoute();
        });
    };

    const recenterMap = async () => {
        if (!mapInstance.current) return;

        try {
            const center = await getUserLocation();
            mapInstance.current.easeTo({ center, zoom: 16, duration: 1000 });
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
        destroyMap();
        const timeoutId = setTimeout(() => {
            loadMap();
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            destroyMap();
        };
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
                                await downloadRoute(start!, end!);
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
                        <Button variant="outlined" onClick={recenterMap}>
                            <MyLocationIcon />
                        </Button>
                    </Tooltip>
                </Box>
            }
        >
            <Box ref={mapRef} style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                padding: 0
            }} />
        </LateralDialog>
    );
}