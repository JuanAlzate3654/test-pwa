import type { DomainNewModel } from "@components/domain/domainNew/_redux/model";
import { saveOfflineRequest } from "@openDB/openDB";
import type { AxiosResponse } from "axios";
import axios from "axios";

export interface DomainNewGR {
    data: DomainNewModel;
    errors: any;
}

export class DomainNewService {

    url = (import.meta.env.VITE_API_URL || '') + '/api/v1/domains';

    async save(domain: DomainNewModel): Promise<AxiosResponse<DomainNewGR>> {
        try {
            const postData = {
                group: domain.group,
                key: domain.key,
                value: domain.value,
                status: domain.status,
                images: domain.images,
                file: domain.file
            };

            if (!navigator.onLine) {
                await saveOfflineRequest(
                    '/api/v1/domains',
                    'POST',
                    {
                        group: postData.group,
                        key: postData.key,
                        value: postData.value,
                        status: postData.status
                    },
                    domain.images.map(img => ({ field: 'images', image: img })),
                    domain.file ? [{ field: 'file', file: domain.file }] : []
                );
                return Promise.resolve({
                    data: {
                        data: {
                            id: 'offline-temp-id',
                            ...postData
                        } as DomainNewModel,
                        errors: null
                    } as DomainNewGR,
                    status: 400,
                    statusText: 'Offline',
                    headers: {},
                    config: {},
                } as AxiosResponse<DomainNewGR>);
            }

            return axios.post<DomainNewGR>(this.url, postData);
        } catch (error) {
            console.error(error);
            return Promise.reject(error);
        }
    }
}