'use client'

import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createProperty } from '@/app/actions/properties'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? <Spinner className="mr-2 h-4 w-4" /> : null}
      {pending ? 'Creating...' : 'Create Property'}
    </Button>
  )
}

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/dashboard/landlord" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Property</CardTitle>
          <CardDescription>
            Fill out the details below to list your property for rent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createProperty} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
              
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Property Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Modern Downtown Loft"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your property, its features, and neighborhood..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="rentPrice" className="text-sm font-medium">
                  Monthly Rent ($)
                </label>
                <Input
                  id="rentPrice"
                  name="rentPrice"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="2000"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Location</h3>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  Street Address
                </label>
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, Unit 4B"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City
                  </label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Austin"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="state" className="text-sm font-medium">
                    State
                  </label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="TX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="zipCode" className="text-sm font-medium">
                    ZIP Code
                  </label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="78701"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Property Details</h3>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label htmlFor="bedrooms" className="text-sm font-medium">
                    Bedrooms
                  </label>
                  <Select name="bedrooms" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Studio</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bathrooms" className="text-sm font-medium">
                    Bathrooms
                  </label>
                  <Select name="bathrooms" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="3.5">3.5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="squareFeet" className="text-sm font-medium">
                    Square Feet (optional)
                  </label>
                  <Input
                    id="squareFeet"
                    name="squareFeet"
                    type="number"
                    min="0"
                    placeholder="1200"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Amenities</h3>
              <div className="space-y-2">
                <label htmlFor="amenities" className="text-sm font-medium">
                  Amenities (comma-separated)
                </label>
                <Input
                  id="amenities"
                  name="amenities"
                  placeholder="In-unit laundry, Central AC, Pet-friendly, Gym access"
                />
                <p className="text-xs text-muted-foreground">
                  Enter amenities separated by commas
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
              <Button variant="outline" asChild>
                <Link href="/dashboard/landlord">Cancel</Link>
              </Button>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
