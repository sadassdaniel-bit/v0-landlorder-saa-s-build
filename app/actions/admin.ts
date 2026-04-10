'use server'

import { cookies } from 'next/headers'
import { store } from '@/lib/store'
import type { User, Property, Application } from '@/lib/types'

export async function getAdminStats(): Promise<{
  totalUsers: number
  totalLandlords: number
  totalTenants: number
  totalProperties: number
  totalApplications: number
  pendingApplications: number
  totalRevenue: number
}> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    throw new Error('Invalid session')
  }
  
  const user = store.users.find(u => u.id === session.userId)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }
  
  const users = store.users.filter(u => u.role !== 'admin')
  const landlords = users.filter(u => u.role === 'landlord')
  const tenants = users.filter(u => u.role === 'tenant')
  const applications = store.applications
  const pendingApplications = applications.filter(a => a.status === 'pending')
  
  // Calculate total revenue from completed applications
  const totalRevenue = applications
    .filter(a => a.status === 'approved' && a.paymentStatus === 'paid')
    .length * 35 // $35 per application fee
  
  return {
    totalUsers: users.length,
    totalLandlords: landlords.length,
    totalTenants: tenants.length,
    totalProperties: store.properties.length,
    totalApplications: applications.length,
    pendingApplications: pendingApplications.length,
    totalRevenue
  }
}

export async function getAllUsers(): Promise<Omit<User, 'passwordHash'>[]> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    throw new Error('Invalid session')
  }
  
  const user = store.users.find(u => u.id === session.userId)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }
  
  return store.users
    .filter(u => u.role !== 'admin')
    .map(({ passwordHash: _, ...user }) => user)
}

export async function getAllPropertiesAdmin(): Promise<(Property & { landlordName: string })[]> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    throw new Error('Invalid session')
  }
  
  const user = store.users.find(u => u.id === session.userId)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }
  
  return store.properties.map(property => {
    const landlord = store.users.find(u => u.id === property.landlordId)
    return {
      ...property,
      landlordName: landlord?.name || 'Unknown'
    }
  })
}

export async function getAllApplicationsAdmin(): Promise<(Application & { 
  tenantName: string
  propertyTitle: string 
})[]> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    throw new Error('Invalid session')
  }
  
  const user = store.users.find(u => u.id === session.userId)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }
  
  return store.applications.map(application => {
    const tenant = store.users.find(u => u.id === application.tenantId)
    const property = store.properties.find(p => p.id === application.propertyId)
    return {
      ...application,
      tenantName: tenant?.name || 'Unknown',
      propertyTitle: property?.title || 'Unknown'
    }
  })
}

export async function deleteProperty(propertyId: string): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    throw new Error('Invalid session')
  }
  
  const user = store.users.find(u => u.id === session.userId)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }
  
  const propertyIndex = store.properties.findIndex(p => p.id === propertyId)
  if (propertyIndex === -1) {
    throw new Error('Property not found')
  }
  
  store.properties.splice(propertyIndex, 1)
  
  // Also delete related applications
  store.applications = store.applications.filter(a => a.propertyId !== propertyId)
  
  return { success: true }
}

export async function suspendUser(userId: string): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('session')?.value
  
  if (!sessionId) {
    throw new Error('Unauthorized')
  }
  
  const session = store.sessions.get(sessionId)
  if (!session) {
    throw new Error('Invalid session')
  }
  
  const adminUser = store.users.find(u => u.id === session.userId)
  if (!adminUser || adminUser.role !== 'admin') {
    throw new Error('Unauthorized - Admin access required')
  }
  
  const userIndex = store.users.findIndex(u => u.id === userId)
  if (userIndex === -1) {
    throw new Error('User not found')
  }
  
  // In a real app, this would set a suspended flag
  // For now, we'll just return success
  return { success: true }
}
