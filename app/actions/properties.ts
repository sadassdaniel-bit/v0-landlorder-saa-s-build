'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { store } from '@/lib/store'
import { getCurrentUser, requireRole } from './auth'
import type { Property, PropertyStatus } from '@/lib/types'

export async function getActiveProperties() {
  return store.getActiveProperties()
}

export async function getPropertyById(id: string) {
  return store.getProperty(id)
}

export async function getLandlordProperties() {
  const user = await requireRole(['landlord'])
  return store.getPropertiesByLandlord(user.id)
}

export async function createProperty(formData: FormData) {
  const user = await requireRole(['landlord'])

  const amenitiesStr = formData.get('amenities') as string
  const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()).filter(Boolean) : []

  const property: Property = {
    id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    landlordId: user.id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zipCode: formData.get('zipCode') as string,
    rentPrice: parseFloat(formData.get('rentPrice') as string),
    bedrooms: parseInt(formData.get('bedrooms') as string),
    bathrooms: parseFloat(formData.get('bathrooms') as string),
    squareFeet: formData.get('squareFeet') ? parseInt(formData.get('squareFeet') as string) : undefined,
    amenities,
    photoUrls: [],
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  store.createProperty(property)
  revalidatePath('/dashboard/landlord')
  revalidatePath('/properties')
  redirect('/dashboard/landlord')
}

export async function updateProperty(id: string, formData: FormData) {
  const user = await requireRole(['landlord'])
  
  const property = store.getProperty(id)
  if (!property || property.landlordId !== user.id) {
    return { error: 'Property not found or unauthorized' }
  }

  const amenitiesStr = formData.get('amenities') as string
  const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()).filter(Boolean) : []

  store.updateProperty(id, {
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zipCode: formData.get('zipCode') as string,
    rentPrice: parseFloat(formData.get('rentPrice') as string),
    bedrooms: parseInt(formData.get('bedrooms') as string),
    bathrooms: parseFloat(formData.get('bathrooms') as string),
    squareFeet: formData.get('squareFeet') ? parseInt(formData.get('squareFeet') as string) : undefined,
    amenities,
    status: formData.get('status') as PropertyStatus
  })

  revalidatePath('/dashboard/landlord')
  revalidatePath('/properties')
  revalidatePath(`/properties/${id}`)
  redirect('/dashboard/landlord')
}

export async function deleteProperty(id: string) {
  const user = await requireRole(['landlord'])
  
  const property = store.getProperty(id)
  if (!property || property.landlordId !== user.id) {
    return { error: 'Property not found or unauthorized' }
  }

  store.deleteProperty(id)
  revalidatePath('/dashboard/landlord')
  revalidatePath('/properties')
}

export async function togglePropertyStatus(id: string) {
  const user = await requireRole(['landlord'])
  
  const property = store.getProperty(id)
  if (!property || property.landlordId !== user.id) {
    return { error: 'Property not found or unauthorized' }
  }

  const newStatus: PropertyStatus = property.status === 'active' ? 'inactive' : 'active'
  store.updateProperty(id, { status: newStatus })
  
  revalidatePath('/dashboard/landlord')
  revalidatePath('/properties')
}

export async function searchProperties(filters: {
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
}) {
  let properties = store.getActiveProperties()

  if (filters.city) {
    properties = properties.filter(p => 
      p.city.toLowerCase().includes(filters.city!.toLowerCase())
    )
  }

  if (filters.minPrice) {
    properties = properties.filter(p => p.rentPrice >= filters.minPrice!)
  }

  if (filters.maxPrice) {
    properties = properties.filter(p => p.rentPrice <= filters.maxPrice!)
  }

  if (filters.bedrooms) {
    properties = properties.filter(p => p.bedrooms >= filters.bedrooms!)
  }

  if (filters.bathrooms) {
    properties = properties.filter(p => p.bathrooms >= filters.bathrooms!)
  }

  return properties
}
