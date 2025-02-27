import axios from '@/lib/axios';
import {TUserLoginPayload, TUserLoginResponse} from '@/types/auth';
import apiEndpoints from '@/context/apiEndpoints'
export class AuthRepository {
  static async signIn(loginPayload: TUserLoginPayload): Promise<TUserLoginResponse> {
    const { data } = await axios.post<TUserLoginResponse>(`${apiEndpoints.auth.login}`, loginPayload);
    return data;
  }
}
