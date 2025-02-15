'use server'

import { signIn, signOut as authSignOut } from '@/auth'
import {InvalidLoginError} from "@/utils/exceptions";

export async function authenticate(username: string, password: string) {
  try {
    const res = await signIn('credentials', {
      username: username,
      password: password,
      redirect: false,
    })

    if (res.error) {
      return { error: res.error }
    }

    return res
  } catch (error: any) {
    if (error instanceof InvalidLoginError) {
      return { error: error.code }
    }
    // return {error: "An error occurred while trying to authenticate"}
    return { error: JSON.stringify(error) }
  }
}

export async function signOut() {
  await authSignOut()
}
