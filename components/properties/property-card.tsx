import Link from 'next/link'
import { MapPin, Bed, Bath, Square, Building } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Property } from '@/lib/types'

interface PropertyCardProps {
  property: Property
  showActions?: boolean
}

export function PropertyCard({ property, showActions = true }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      {/* Property Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-primary/20 to-secondary/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <Building className="h-16 w-16 text-primary/40" />
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-sm font-semibold text-foreground backdrop-blur-sm">
          ${property.rentPrice.toLocaleString()}/mo
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">
          {property.title}
        </h3>
        
        <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{property.city}, {property.state}</span>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          {property.squareFeet && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.squareFeet.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {property.amenities.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>

      {showActions && (
        <CardFooter className="border-t bg-muted/30 p-4">
          <Button asChild className="w-full">
            <Link href={`/properties/${property.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
