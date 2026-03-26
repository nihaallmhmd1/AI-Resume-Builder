import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BuilderContent from '@/components/BuilderContent'

export default async function BuilderPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <BuilderContent user={user} />
}
