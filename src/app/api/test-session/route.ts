import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
    const session = await auth()
    console.log('Session inside API route:', session) // Debugging
    return NextResponse.json({ session })
}
