import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardContent from '@/components/DashboardContent'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  if (!supabase) {
    redirect('/')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return <DashboardContent user={user} />
}
