'use server'

import axios from 'axios'
import { auth } from '@/auth'

const instance = axios.create({
  baseURL: process.env.API_URL,
})

instance.interceptors.request.use(
  async config => {
    if (!config.headers.Authorization) {
      const session = await auth()
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`
      }
      if (session?.user?.refreshToken) {
        config.headers.AuthorizationRefresh = `Bearer ${session.user.refreshToken}`
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

export default instance
