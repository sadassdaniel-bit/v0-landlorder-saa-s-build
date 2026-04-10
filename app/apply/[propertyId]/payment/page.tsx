'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Shield, Clock } from 'lucide-react'
import { Checkout } from '@/components/checkout'
import { handlePaymentSuccess } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

export default function PaymentPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const applicationId = searchParams.get('applicationId')
  const [propertyId, setPropertyId] = useState<string>('')
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    params.then(({ propertyId }) => setPropertyId(propertyId))
  }, [params])

  const handleComplete = async () => {
    if (!applicationId) return
    
    setPaymentComplete(true)
    setProcessing(true)
    
    try {
      await handlePaymentSuccess(applicationId)
      // Redirect to success after processing
      setTimeout(() => {
        router.push(`/apply/${propertyId}/success?applicationId=${applicationId}`)
      }, 2000)
    } catch (error) {
      console.error('Error processing payment:', error)
      setProcessing(false)
    }
  }

  if (!applicationId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Invalid application. Please start over.</p>
            <Button asChild className="mt-4">
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (paymentComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <Card className="max-w-md text-center">
          <CardContent className="py-12">
            {processing ? (
              <>
                <Spinner className="mx-auto h-12 w-12 text-primary" />
                <h2 className="mt-6 text-xl font-semibold text-foreground">Processing Your Application</h2>
                <p className="mt-2 text-muted-foreground">
                  Running AI-powered screening analysis...
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h2 className="mt-6 text-xl font-semibold text-foreground">Payment Successful!</h2>
                <p className="mt-2 text-muted-foreground">
                  Your application has been submitted and is now under review.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Link href={`/apply/${propertyId}`} className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Application
        </Link>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-1 items-center">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  s <= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`h-1 flex-1 ${s < 3 ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Application</span>
            <span className="text-muted-foreground">Documents</span>
            <span className="font-medium text-foreground">Payment</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Payment Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>
                  Secure payment powered by Stripe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Checkout 
                  productId="tenant-application" 
                  applicationId={applicationId}
                  onComplete={handleComplete}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Application Fee</span>
                  <span className="font-semibold">$40.00</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">$40.00</span>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium">What&apos;s included:</h4>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>30 days of unlimited applications</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>AI-powered screening analysis</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>Real-time application tracking</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    <span>Secure document storage</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span>Your payment is secured with bank-level encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
