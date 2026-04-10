'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { store } from '@/lib/store'
import type { UserRole } from '@/lib/types'

// Simple password storage (in production, use a proper database)
const passwords = new Map<string, string>()

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as UserRole
  const phone = formData.get('phone') as string | undefined

  if (!email || !password || !name || !role) {
    return { error: 'All fields are required' }
  }

  // Check if user already exists
  const existingUser = store.getUserByEmail(email)
  if (existingUser) {
    return { error: 'An account with this email already exists' }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)
  passwords.set(email, hashedPassword)

  // Create user
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const user = store.createUser({
    id: userId,
    email,
    name,
    role,
    phone: phone || undefined,
    createdAt: new Date(),
    updatedAt: new Date()
  })

  // Create session
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  store.createSession(sessionId, user.id)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  // Redirect based on role
  if (role === 'landlord') {
    redirect('/dashboard/landlord')
  } else if (role === 'admin') {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/tenant')
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Find user
  const user = store.getUserByEmail(email)
  if (!user) {
    return { error: 'Invalid email or password' }
  }

  // Check password
  const storedPassword = passwords.get(email)
  if (storedPassword) {
    const isValid = await bcrypt.compare(password, storedPassword)
    if (!isValid) {
      return { error: 'Invalid email or password' }
    }
  } else {
    // Demo accounts - allow any password for demo users
    const demoEmails = ['landlord@demo.com', 'tenant@demo.com', 'admin@landlorder.com']
    if (!demoEmails.includes(email)) {
      return { error: 'Invalid email or password' }
    }
  }

  // Create session
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  store.createSession(sessionId, user.id)

  // Set cookie
  const cookieStore = await cookies()
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  // Redirect based on role
  if (user.role === 'landlord') {
    redirect('/dashboard/landlord')
  } else if (user.role === 'admin') {
    redirect('/dashboard/admin')
  } else {
    redirect('/dashboard/tenant')
  }
}

export async function signOut() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value

  if (sessionId) {
    store.deleteSession(sessionId)
    cookieStore.delete('session')
  }

  redirect('/')
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value

  if (!sessionId) {
    return null
  }

  const session = store.getSession(sessionId)
  if (!session) {
    return null
  }

  return store.getUser(session.userId) || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    redirect('/')
  }
  return user
}
