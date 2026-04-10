import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Check, ArrowLeft, Building } from 'lucide-react'
import { Header } from '@/components/landing/header'
import { Footer } from '@/components/landing/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPropertyById } from '@/app/actions/properties'
import { getCurrentUser } from '@/app/actions/auth'

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const property = await getPropertyById(id)
  const user = await getCurrentUser()

  if (!property) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/properties" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Property Image */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building className="h-24 w-24 text-primary/40" />
                </div>
              </div>

              {/* Property Info */}
              <div className="mt-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{property.title}</h1>
                    <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                      <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">${property.rentPrice.toLocaleString()}</p>
                    <p className="text-muted-foreground">per month</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{property.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                    </div>
                  </div>
                  {property.squareFeet && (
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Square className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{property.squareFeet.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Sq. Ft.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-foreground">About this property</h2>
                  <p className="mt-4 whitespace-pre-wrap text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Amenities */}
                {property.amenities.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-foreground">Amenities</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {property.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Apply for this rental</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Submit your application to be considered for this property. Our AI-powered screening will help the landlord make an informed decision.
                  </p>

                  {user?.role === 'tenant' ? (
                    <Button asChild className="w-full" size="lg">
                      <Link href={`/apply/${property.id}`}>Apply Now</Link>
                    </Button>
                  ) : user?.role === 'landlord' ? (
                    <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
                      You are logged in as a landlord. Switch to a tenant account to apply.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href={`/signup?role=tenant&redirect=/apply/${property.id}`}>
                          Sign Up to Apply
                        </Link>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                          Log in
                        </Link>
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-foreground">Application fee</h4>
                    <p className="mt-1 text-2xl font-bold text-foreground">$40</p>
                    <p className="text-sm text-muted-foreground">One-time fee for 30 days of unlimited applications</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
