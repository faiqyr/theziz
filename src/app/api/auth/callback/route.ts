import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Ambil parameter 'next' atau default ke '/dashboard'
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      "https://jyzvurrhpxtlegsvuabf.supabase.co",
      "sb_publishable_XU_67a7VLmiAdZi5yEcyQg_T2bAejpk",
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // PENTING: Gunakan URL lengkap untuk redirect
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika error, balikkan ke login dengan pesan error
  return NextResponse.redirect(`${origin}/auth/login?error=auth-code-error`)
}