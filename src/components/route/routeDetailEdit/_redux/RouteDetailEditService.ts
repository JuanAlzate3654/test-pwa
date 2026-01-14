import type { RouteDetailEditModel } from "@components/route/routeDetailEdit/_redux/model";
import { saveOfflineRequest } from "@openDB/openDB";
import axios from "axios";

export class RouteDetailEditService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    async find(id: string): Promise<RouteDetailEditModel> {
        const fullUrl = `${this.url}/${id}/detail-edit`;
        try {
            const res = await axios.get<RouteDetailEditModel>(fullUrl);
            const responseToCache = new Response(JSON.stringify(res.data), {
                headers: { 'Content-Type': 'application/json' }
            });
            await (await caches.open('route-detail-edit-cache')).put(fullUrl, responseToCache);
            return res.data;
        } catch (e: any) {
            if (!navigator.onLine) {
                const cachedResponse = await caches.open('route-detail-edit-cache').then(cache => cache.match(fullUrl));
                if (cachedResponse) {
                    return await cachedResponse.json() as RouteDetailEditModel;
                }
            }
            return Promise.reject(e);
        }
    }

    async update(routeDetail: RouteDetailEditModel): Promise<RouteDetailEditModel> {
        const url = `${this.url}/${routeDetail.id}/detail-edit`;
        const data = {
            id: routeDetail.id,
            ruta: routeDetail.ruta,
            cbml: routeDetail.cbml,
            matricula: routeDetail.matricula,
            direccionEncasillada: routeDetail.direccionEncasillada,
            principal: routeDetail.principal,
            estrato: routeDetail.estrato,
            descripcion: routeDetail.descripcion,
            pagina: routeDetail.pagina,
            nomenclaturaEpm: routeDetail.nomenclaturaEpm,
            observacion: routeDetail.observacion,
            estado: routeDetail.estado,
            bitacoraActividades: routeDetail.bitacoraActividades,
            latitud: routeDetail.latitud,
            longitud: routeDetail.longitud,
        };
        if (!navigator.onLine) {
            await saveOfflineRequest(url, 'PUT', data, [], []);
            return Promise.resolve(data as RouteDetailEditModel);
        }
        const res = await axios.put<RouteDetailEditModel>(url, data);
        return res.data;
    }
}
