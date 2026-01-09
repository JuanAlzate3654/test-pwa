import type { RouteDetailEditModel } from "@components/domain/routeDetailEdit/_redux/model";
import axios from "axios";

export class RouteDetailEditService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/domains';

    find(id: string): Promise<RouteDetailEditModel> {
        return axios.get(`${this.url}/${id}`)
    }

    update(routeDetail: RouteDetailEditModel): Promise<RouteDetailEditModel> {
        return axios.put(`${this.url}/${routeDetail.id}`,
            {
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
            },
        )
    }
}
