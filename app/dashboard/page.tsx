import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { store } from '@/lib/store'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    redirect('/login')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    redirect('/login')
  }
  
  const user = store.users.find(u => u.id === session.userId)
  if (!user) {
    redirect('/login')
  }
  
  // Redirect based on user role
  switch (user.role) {
    case 'landlord':
      redirect('/dashboard/landlord')
    case 'tenant':
      redirect('/dashboard/tenant')
    case 'admin':
      redirect('/dashboard/admin')
    default:
      redirect('/login')
  }
}
