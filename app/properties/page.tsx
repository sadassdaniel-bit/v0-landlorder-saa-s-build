import { Suspense } from 'react'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { PropertyCard } from '@/components/properties/property-card'
import { PropertyFilters } from '@/components/properties/property-filters'
import { getActiveProperties } from '@/app/actions/properties'
import { Spinner } from '@/components/ui/spinner'

async function PropertyList({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams
  const properties = await getActiveProperties()
  
  // Apply filters
  let filteredProperties = properties

  if (params.city) {
    const city = Array.isArray(params.city) ? params.city[0] : params.city
    filteredProperties = filteredProperties.filter(p => 
      p.city.toLowerCase().includes(city.toLowerCase())
    )
  }

  if (params.minPrice) {
    const minPrice = parseInt(Array.isArray(params.minPrice) ? params.minPrice[0] : params.minPrice)
    filteredProperties = filteredProperties.filter(p => p.rentPrice >= minPrice)
  }

  if (params.maxPrice) {
    const maxPrice = parseInt(Array.isArray(params.maxPrice) ? params.maxPrice[0] : params.maxPrice)
    filteredProperties = filteredProperties.filter(p => p.rentPrice <= maxPrice)
  }

  if (params.bedrooms) {
    const bedrooms = parseInt(Array.isArray(params.bedrooms) ? params.bedrooms[0] : params.bedrooms)
    filteredProperties = filteredProperties.filter(p => p.bedrooms >= bedrooms)
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-6">
          <svg className="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No properties found</h3>
        <p className="mt-2 text-muted-foreground">Try adjusting your filters to see more results.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredProperties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

export default async function PropertiesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Browse Rentals</h1>
            <p className="mt-2 text-muted-foreground">Find your perfect home from our curated listings</p>
          </div>

          <PropertyFilters />

          <div className="mt-8">
            <Suspense fallback={
              <div className="flex items-center justify-center py-20">
                <Spinner className="h-8 w-8" />
              </div>
            }>
              <PropertyList searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
