import axios from '@/lib/axios';
import apiEndpoints from '@/context/apiEndpoints'
import {TUserSignUpPayload, TUserSignUpResponse} from "@/types/user";
export class UserRepository {
    static async signUp(signUpPayload: TUserSignUpPayload): Promise<TUserSignUpResponse> {
        const { data } = await axios.post<TUserSignUpResponse>(`${apiEndpoints.user.signUp}`, signUpPayload);
        return data;
    }
}
