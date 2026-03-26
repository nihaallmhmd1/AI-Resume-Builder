import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isRootPage = request.nextUrl.pathname === '/'

  // If not logged in and explicitly trying to access /dashboard or /builder, redirect to /
  if (!user && (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/builder'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    const redirectResponse = NextResponse.redirect(url)
    // Transfer any cookies set during this middleware run
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  // If logged in and trying to go to root, redirect to dashboard
  if (user && isRootPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/builder'
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Exclude static assets and AUTH paths to avoid infinite loops/PKCE issues
    '/((?!_next/static|_next/image|api|auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
