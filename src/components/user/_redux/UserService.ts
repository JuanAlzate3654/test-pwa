import type { AxiosResponse } from "axios";
import axios from "axios";

import type { UserModel } from ".";

export class UserService {

    principal(): Promise<AxiosResponse<UserModel>> {
        try {
            return axios.get<UserModel>(`api/v1/principal`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    logout(): Promise<AxiosResponse<void>> {
        try {
            return axios.get<void>(`rest/v1/logout`);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    update(id: string, user: UserModel): Promise<AxiosResponse<UserModel>> {
        try {
            return axios.put<UserModel>(`rest/v1/users/update/${id}`, user);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

}
