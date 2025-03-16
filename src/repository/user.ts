import axios from '@/lib/axios';
import apiEndpoints from '@/context/apiEndpoints'
import {
    TUserPaginatedSearchResponse,
    TUserPaginatedSearchPayload,
    TUserSignUpPayload,
    TUserSignUpResponse, MaybeUserModel, TUserGetByIdPayload
} from "@/types/user";
export class UserRepository {
    static async signUp(signUpPayload: TUserSignUpPayload): Promise<TUserSignUpResponse> {
        const { data } = await axios.post<TUserSignUpResponse>(`${apiEndpoints.user.signUp}`, signUpPayload);
        return data;
    }

    static async paginatedSearch(searchPayload: TUserPaginatedSearchPayload): Promise<TUserPaginatedSearchResponse> {
        const { data } = await axios.get<TUserPaginatedSearchResponse>(`${apiEndpoints.user.paginatedSearch}`, {
            params: {
                searchQuery: searchPayload.searchQuery,
                offset: searchPayload.offset,
                limit: searchPayload.limit,
            }
        });
        return data;
    }

    static async getById(payload: TUserGetByIdPayload): Promise<MaybeUserModel> {
        const { data } = await axios.get<MaybeUserModel>(`${apiEndpoints.user.getById}/${payload.userId}`);
        return data;
    }
}
