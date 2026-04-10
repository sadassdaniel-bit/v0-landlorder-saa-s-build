'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Bed, Bath, Square, MapPin } from 'lucide-react'
import { getProperties } from '@/app/actions/properties'
import type { Property } from '@/lib/types'

export default function SavedPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProperties() {
      try {
        // In a real app, this would fetch only saved properties
        const data = await getProperties()
        // For demo, show first 3 properties as "saved"
        setProperties(data.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch saved properties:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  if (loading) {
    return (
      <DashboardLayout role="tenant">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="tenant">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Properties</h1>
          <p className="text-muted-foreground">
            Properties you&apos;ve saved for later.
          </p>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven&apos;t saved any properties yet. Browse listings and save properties you&apos;re interested in.
              </p>
              <Button asChild>
                <Link href="/properties">Browse Properties</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground">Property Image</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                  >
                    <Heart className="h-4 w-4 fill-primary text-primary" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">${property.price}/mo</CardTitle>
                    <Badge variant={property.available ? 'default' : 'secondary'}>
                      {property.available ? 'Available' : 'Rented'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {property.city}, {property.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2 line-clamp-1">{property.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms} bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms} bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4" />
                      {property.squareFeet} sqft
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" asChild>
                      <Link href={`/properties/${property.id}`}>View Details</Link>
                    </Button>
                    <Button className="flex-1" asChild>
                      <Link href={`/apply/${property.id}`}>Apply Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
