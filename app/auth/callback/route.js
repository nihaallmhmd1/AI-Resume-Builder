import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/builder'

  if (code) {
    const supabase = await createClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url))
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/', request.url))
}
