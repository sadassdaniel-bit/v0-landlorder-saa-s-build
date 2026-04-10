'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { ArrowLeft, User, Briefcase, Home, Users, FileText } from 'lucide-react'
import { createApplication } from '@/app/actions/applications'
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
import type { Property } from '@/lib/types'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? <Spinner className="mr-2 h-4 w-4" /> : null}
      {pending ? 'Submitting...' : 'Continue to Payment'}
    </Button>
  )
}

export default function ApplyPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const [propertyId, setPropertyId] = useState<string>('')
  const [property, setProperty] = useState<Property | null>(null)
  const [step, setStep] = useState(1)
  const router = useRouter()

  useEffect(() => {
    params.then(({ propertyId }) => {
      setPropertyId(propertyId)
      // Fetch property details
      fetch(`/api/properties/${propertyId}`)
        .then(res => res.json())
        .then(data => setProperty(data))
        .catch(() => router.push('/properties'))
    })
  }, [params, router])

  const handleSubmit = async (formData: FormData) => {
    await createApplication(propertyId, formData)
  }

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <Link href={`/properties/${propertyId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Property
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-1 items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`h-1 flex-1 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-foreground">Application</span>
            <span className={step >= 2 ? 'text-foreground' : 'text-muted-foreground'}>Documents</span>
            <span className={step >= 3 ? 'text-foreground' : 'text-muted-foreground'}>Payment</span>
          </div>
        </div>

        {/* Property Summary */}
        <Card className="mb-6">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <Home className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">{property.title}</h2>
              <p className="text-sm text-muted-foreground">
                {property.city}, {property.state} - ${property.rentPrice.toLocaleString()}/mo
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Rental Application
            </CardTitle>
            <CardDescription>
              Complete the form below to apply for this rental property
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                    <Input id="firstName" name="firstName" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                    <Input id="lastName" name="lastName" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                    <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="ssn" className="text-sm font-medium">Social Security Number</label>
                    <Input id="ssn" name="ssn" type="password" placeholder="XXX-XX-XXXX" required />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Employment Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="employmentStatus" className="text-sm font-medium">Employment Status</label>
                    <Select name="employmentStatus" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employed">Employed</SelectItem>
                        <SelectItem value="self_employed">Self-Employed</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="monthlyIncome" className="text-sm font-medium">Monthly Income ($)</label>
                    <Input id="monthlyIncome" name="monthlyIncome" type="number" min="0" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="employerName" className="text-sm font-medium">Employer Name</label>
                    <Input id="employerName" name="employerName" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium">Job Title</label>
                    <Input id="jobTitle" name="jobTitle" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="employerPhone" className="text-sm font-medium">Employer Phone</label>
                    <Input id="employerPhone" name="employerPhone" type="tel" />
                  </div>
                </div>
              </div>

              {/* Rental History */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-primary" />
                  Rental History
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="currentAddress" className="text-sm font-medium">Current Address</label>
                    <Input id="currentAddress" name="currentAddress" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="currentLandlord" className="text-sm font-medium">Current Landlord Name</label>
                    <Input id="currentLandlord" name="currentLandlord" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="currentLandlordPhone" className="text-sm font-medium">Landlord Phone</label>
                    <Input id="currentLandlordPhone" name="currentLandlordPhone" type="tel" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="reasonForMoving" className="text-sm font-medium">Reason for Moving</label>
                    <Textarea id="reasonForMoving" name="reasonForMoving" rows={2} required />
                  </div>
                </div>
              </div>

              {/* References */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-primary" />
                  References
                </h3>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Please provide two personal or professional references</p>
                  
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="reference1Name" className="text-sm font-medium">Reference 1 Name</label>
                      <Input id="reference1Name" name="reference1Name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reference1Phone" className="text-sm font-medium">Phone</label>
                      <Input id="reference1Phone" name="reference1Phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reference1Relation" className="text-sm font-medium">Relationship</label>
                      <Input id="reference1Relation" name="reference1Relation" placeholder="e.g., Former employer" required />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="reference2Name" className="text-sm font-medium">Reference 2 Name</label>
                      <Input id="reference2Name" name="reference2Name" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reference2Phone" className="text-sm font-medium">Phone</label>
                      <Input id="reference2Phone" name="reference2Phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reference2Relation" className="text-sm font-medium">Relationship</label>
                      <Input id="reference2Relation" name="reference2Relation" placeholder="e.g., Colleague" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Notes</h3>
                <div className="space-y-2">
                  <label htmlFor="additionalNotes" className="text-sm font-medium">
                    Anything else you&apos;d like us to know? (optional)
                  </label>
                  <Textarea 
                    id="additionalNotes" 
                    name="additionalNotes" 
                    rows={3} 
                    placeholder="Add any additional information that might help your application..."
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-between border-t pt-6">
                <Button variant="outline" asChild>
                  <Link href={`/properties/${propertyId}`}>Cancel</Link>
                </Button>
                <SubmitButton />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
