import axios from '@/lib/axios';
import apiEndpoints from '@/context/apiEndpoints'
import {
    TUserPaginatedSearchResponse,
    TUserPaginatedSearchPayload,
    TUserSignUpPayload,
    TUserSignUpResponse,
    TUserGetByIdPayload
} from "@/types/user";
import {Maybe} from "@/types/type-constructor";
import {UserModel} from "@/types/user";
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

    static async getById(payload: TUserGetByIdPayload): Promise<Maybe<UserModel>> {
        const { data } = await axios.get<Maybe<UserModel>>(`${apiEndpoints.user.getById(payload.userId)}`);
        return data;
    }
}
