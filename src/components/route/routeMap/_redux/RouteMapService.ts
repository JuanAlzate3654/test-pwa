import type { RouteMapModel } from "@components/route/routeMap/_redux/model";
import axios from "axios";


export class RouteMapService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    async find(cbmls: string[]): Promise<RouteMapModel> {
        const params = new URLSearchParams();
        cbmls.forEach(cbml => params.append('cbmls', cbml));
        const fullUrl = `${this.url}/routes?${params.toString()}`;
        try {
            const res = await axios.get<RouteMapModel>(fullUrl);
            const responseToCache = new Response(JSON.stringify(res.data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await (await caches.open('route-map-cache')).put(fullUrl, responseToCache);
            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                const cachedResponse = await caches.open('route-map-cache').then(cache => cache.match(fullUrl));
                if (cachedResponse) {
                    return await cachedResponse.json() as RouteMapModel;
                }
            }
            return Promise.reject(e);
        }
    }

    async downloadMap(bounds: any, zoom: number): Promise<void> {
        const cache = await caches.open('map-tiles');

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

        const minTile = lonLatToTile(bounds.minLon, bounds.maxLat, zoom);
        const maxTile = lonLatToTile(bounds.maxLon, bounds.minLat, zoom);

        for (let x = minTile.x; x <= maxTile.x; x++) {
            for (let y = minTile.y; y <= maxTile.y; y++) {
                const url = `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
                if (!(await cache.match(url))) {
                    try {
                        const res = await fetch(url);
                        if (res.ok) await cache.put(url, res.clone());
                    } catch {
                        console.warn('Tile no descargado', url);
                    }
                }
            }
        }
    }

    async downloadRoutesMap(routes: any): Promise<void> {
        const cache = await caches.open('osrm-routes');
        for (const route of routes!) {
            const url =
                `https://router.project-osrm.org/route/v1/driving/` +
                `${route.start![0]},${route.start[1]};${route.end[0]},${route.end[1]}?overview=full&geometries=geojson`;

            if (!(await cache.match(url))) {
                try {
                    const res = await fetch(url, { cache: 'no-store' });
                    if (res.ok) await cache.put(url, res.clone());
                } catch (e) {
                    console.warn('No se pudo descargar la ruta', e);
                }
            }
        }
    }
}
