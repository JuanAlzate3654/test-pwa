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

export default function MapView() {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<maplibregl.Map | null>(null);
    const { t } = useTranslation();
    const userMarker = useRef<maplibregl.Marker | null>(null);
    const watchId = useRef<number | null>(null);
    const getCurrentBounds = (): Bounds | null => {
        if (!mapInstance.current) return null;

        const b = mapInstance.current.getBounds();

        return {
            minLon: b.getWest(),
            minLat: b.getSouth(),
            maxLon: b.getEast(),
            maxLat: b.getNorth(),
        };
    }

    const getUserLocation = (): Promise<{ lng: number; lat: number }> => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocalización no soportada');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    resolve({
                        lng: pos.coords.longitude,
                        lat: pos.coords.latitude,
                    });
                },
                (err) => reject(err),
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        });
    }


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
    }

    const createUserMarkerElement = () => {
        const el = document.createElement('div');
        el.style.width = '16px';
        el.style.height = '16px';
        el.style.borderRadius = '50%';
        el.style.background = '#1976d2';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 6px rgba(0,0,0,0.4)';
        return el;
    }

    const startTrackingUser = () => {
        if (!navigator.geolocation || !mapInstance.current) return;

        watchId.current = navigator.geolocation.watchPosition(
            (pos) => {
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
            (err) => console.error('GPS error', err),
            {
                enableHighAccuracy: true,
                maximumAge: 2000,
                timeout: 10000,
            }
        );
    };

    const stopTrackingUser = () => {
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
    };

    const loadMap = async () => {
        if (!mapRef.current || mapInstance.current) return;

        let center: [number, number] = [-74.08175, 4.60971]; // fallback Bogotá
        let zoom = 12;

        try {
            const userLocation = await getUserLocation();
            center = [userLocation.lng, userLocation.lat];
            zoom = 15;
        } catch (e) {
            console.warn('No se pudo obtener la ubicación del usuario');
        }

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
                layers: [
                    {
                        id: 'osm',
                        type: 'raster',
                        source: 'osm',
                    },
                ],
            },
            center,
            zoom,
        });

        new maplibregl.Marker({ color: '#ff0000ff' })
            .setLngLat(center)
            .addTo(mapInstance.current);
    };

    const recenterMap = async () => {
        if (!mapInstance.current) return;

        try {
            const center = await getUserLocation();

            mapInstance.current.easeTo({
                center,
                zoom: 16,
                duration: 1000,
            });
        } catch (e) {
            console.warn('No se pudo obtener la ubicación');
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
                    const res = await fetch(url);
                    if (res.ok) {
                        await cache.put(url, res.clone());
                    }
                }
            }
        }

        console.log(`Tiles descargados para zoom ${zoom}`);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            loadMap();

            mapInstance.current?.on('load', () => {
                startTrackingUser();
            });

            return () => {
                stopTrackingUser();
                userMarker.current?.remove();
                userMarker.current = null;
                clearTimeout(timer);
            };
        }, 100);
    }, []);

    return (
        <LateralDialog width={{ xs: "100%", sm: "100%", md: "100%" }} sx={{
            overflow: 'hidden',
            padding: 0,
        }}
            Sticky={
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    padding: 0
                }}>
                    <Button
                        onClick={async () => {
                            const bounds = getCurrentBounds();
                            if (!bounds) return;

                            for (let z = 12; z <= 14; z++) {
                                await downloadTiles(bounds, z);
                            }
                        }}
                    >
                        {t("domain_map_download_tiles_button")}
                    </Button>
                    <Tooltip title={t("domain_map_refresh_button_tooltip")} arrow>
                        <Button variant='outlined'
                            onClick={() => {
                                loadMap()
                            }}>
                            <RefreshIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={t("domain_map_recenter_button_tooltip")} arrow>
                        <Button variant='outlined'
                            onClick={() => {
                                recenterMap()
                            }}>
                            <MyLocationIcon />
                        </Button>
                    </Tooltip>
                </Box>
            }>
            <Box ref={mapRef} style={{
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                padding: 0
            }} />
        </LateralDialog>
    );
}
