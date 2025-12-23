import type { DomainEditModel } from "@components/domain/domainEdit/_redux/model";

export interface DomainEditGR {
    data: {
        domainFindOne: DomainEditModel;
        domainUpdate: DomainEditModel;
    };
    errors: any;
}

export class DomainEditService {

    url = (import.meta.env.VITE_API_URL || '') + '/v1/domains';

    find(group: string, key: string): Promise<DomainEditModel> {
        try {
            return fetch(`${this.url}/groups/${group}/keys/${key}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(`Error en la petición: ${response.status}`);
                    }
                    const data: DomainEditModel = await response.json();
                    return data;
                });
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }


    update(domain: DomainEditModel): Promise<DomainEditGR> {
        return fetch(`/api/v1/domains/groups/${domain.group}/keys/${domain.key}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                group: domain.group,
                key: domain.key,
                value: domain.value,
                status: domain.status
            }),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(`Error en la petición: ${response.status}`);
                const data: DomainEditGR = await response.json();
                return data;
            })
            .catch(error => Promise.reject(error));
    }

}
