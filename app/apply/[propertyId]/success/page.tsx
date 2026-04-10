import Link from 'next/link'
import { CheckCircle, ArrowRight, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default async function ApplicationSuccessPage({ params }: { params: Promise<{ propertyId: string }> }) {
  const { propertyId } = await params

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="max-w-lg text-center">
        <CardContent className="py-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground">Application Submitted!</h1>
          
          <p className="mt-4 text-muted-foreground">
            Your application has been submitted and our AI has completed the initial screening. 
            The landlord will review your application and make a decision.
          </p>

          <div className="mt-8 space-y-4 text-left">
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">Application Received</p>
                <p className="text-sm text-muted-foreground">Your application and documents have been securely stored.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
              <div>
                <p className="font-medium text-foreground">AI Screening Complete</p>
                <p className="text-sm text-muted-foreground">Our AI has analyzed your application and generated a screening report.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
              <div>
                <p className="font-medium text-foreground">Under Review</p>
                <p className="text-sm text-muted-foreground">The landlord is reviewing your application. You&apos;ll be notified of their decision.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/dashboard/tenant/applications">
                View My Applications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/properties">
                Apply to More Rentals
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Remember, your $40 fee covers unlimited applications for 30 days!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
