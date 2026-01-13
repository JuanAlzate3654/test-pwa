import type { RouteEditModel } from "@components/route/routeEdit/_redux/model";

export interface RouteEditGR {
    data: {
        routeFindOne: RouteEditModel;
        routeUpdate: RouteEditModel;
    };
    errors: any;
}

export class RouteEditService {

    url = (import.meta.env.VITE_API_URL || '') + 'api/v1/routes';

    find(id: string): Promise<RouteEditModel> {
        try {
            return fetch(`${this.url}/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la petición: ${response.status}`);
                    }
                    const data: RouteEditModel = await response.json();
                    return data;
                });
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }


    update(route: RouteEditModel): Promise<RouteEditGR> {
        return fetch(`${this.url}/${route.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                bitacora: route.bitacora,
                cbml: route.cbml,
                matriculaInmobiliatia: route.matriculaInmobiliatia,
                direccionInmueble: route.direccionInmueble,
                nomenclaturaPrincipal: route.nomenclaturaPrincipal,
                estratoSocieconomico: route.estratoSocieconomico,
                descripcion: route.descripcion,
                codigoInstalacionEpm: route.codigoInstalacionEpm,
                nomenclaturaEpm: route.nomenclaturaEpm,
                observacion: route.observacion,
            }),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
                const data: RouteEditGR = await response.json();
                return data;
            })
            .catch(error => Promise.reject(error));
    }

}
