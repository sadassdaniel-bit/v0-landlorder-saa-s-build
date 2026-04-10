import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Briefcase, Home, Users, FileCheck, Check, X, AlertCircle } from 'lucide-react'
import { requireRole } from '@/app/actions/auth'
import { getApplicationById, updateApplicationStatus } from '@/app/actions/applications'
import { getPropertyById } from '@/app/actions/properties'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

function ScoreBar({ score, maxScore, label }: { score: number; maxScore: number; label: string }) {
  const percentage = (score / maxScore) * 100
  const color = percentage >= 70 ? 'bg-green-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{score}/{maxScore}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await requireRole(['landlord'])
  const application = await getApplicationById(id)
  
  if (!application) {
    notFound()
  }

  const property = await getPropertyById(application.propertyId)
  if (!property) {
    notFound()
  }

  const handleApprove = async (formData: FormData) => {
    'use server'
    const notes = formData.get('landlordNotes') as string
    await updateApplicationStatus(id, 'approved', notes)
    redirect('/dashboard/landlord/applications')
  }

  const handleReject = async (formData: FormData) => {
    'use server'
    const notes = formData.get('landlordNotes') as string
    await updateApplicationStatus(id, 'rejected', notes)
    redirect('/dashboard/landlord/applications')
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <Link href="/dashboard/landlord/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {application.firstName} {application.lastName}
            </h1>
            <p className="text-muted-foreground">
              Application for {property.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${
              application.status === 'approved' ? 'bg-green-100 text-green-700' :
              application.status === 'rejected' ? 'bg-red-100 text-red-700' :
              application.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {application.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* AI Screening Report */}
            {application.screeningScore !== undefined && application.screeningBreakdown && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    AI Screening Report
                  </CardTitle>
                  <CardDescription>
                    Automated screening completed {application.screeningCompletedAt && new Date(application.screeningCompletedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="flex items-center gap-6 rounded-lg bg-muted/50 p-4">
                    <div className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white ${
                      application.screeningScore >= 70 ? 'bg-green-500' :
                      application.screeningScore >= 45 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {application.screeningScore}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        Overall Score: {application.screeningScore}/100
                      </p>
                      <p className={`text-sm font-medium capitalize ${
                        application.screeningRecommendation === 'approve' ? 'text-green-600' :
                        application.screeningRecommendation === 'conditional' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Recommendation: {application.screeningRecommendation}
                      </p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="space-y-4">
                    <ScoreBar 
                      score={application.screeningBreakdown.incomeToRentRatio.score} 
                      maxScore={30} 
                      label="Income to Rent Ratio" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {application.screeningBreakdown.incomeToRentRatio.details}
                    </p>

                    <ScoreBar 
                      score={application.screeningBreakdown.employmentStability.score} 
                      maxScore={25} 
                      label="Employment Stability" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {application.screeningBreakdown.employmentStability.details}
                    </p>

                    <ScoreBar 
                      score={application.screeningBreakdown.rentalHistory.score} 
                      maxScore={20} 
                      label="Rental History" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {application.screeningBreakdown.rentalHistory.details}
                    </p>

                    <ScoreBar 
                      score={application.screeningBreakdown.references.score} 
                      maxScore={15} 
                      label="References" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {application.screeningBreakdown.references.details}
                    </p>

                    <ScoreBar 
                      score={application.screeningBreakdown.applicationCompleteness.score} 
                      maxScore={10} 
                      label="Application Completeness" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {application.screeningBreakdown.applicationCompleteness.details}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{application.firstName} {application.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{application.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SSN (Last 4)</p>
                  <p className="font-medium">***-**-{application.ssn.slice(-4)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Employment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Employment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Employment Status</p>
                  <p className="font-medium capitalize">{application.employmentStatus.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Income</p>
                  <p className="font-medium">${application.monthlyIncome.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employer</p>
                  <p className="font-medium">{application.employerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Job Title</p>
                  <p className="font-medium">{application.jobTitle || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employer Phone</p>
                  <p className="font-medium">{application.employerPhone || 'N/A'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Rental History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5 text-primary" />
                  Rental History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Address</p>
                  <p className="font-medium">{application.currentAddress}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Landlord</p>
                    <p className="font-medium">{application.currentLandlord || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Landlord Phone</p>
                    <p className="font-medium">{application.currentLandlordPhone || 'Not provided'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reason for Moving</p>
                  <p className="font-medium">{application.reasonForMoving}</p>
                </div>
              </CardContent>
            </Card>

            {/* References */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  References
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference 1 Name</p>
                    <p className="font-medium">{application.reference1Name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{application.reference1Phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{application.reference1Relation}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference 2 Name</p>
                    <p className="font-medium">{application.reference2Name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{application.reference2Phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium">{application.reference2Relation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Notes */}
            {application.additionalNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Additional Notes from Applicant</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{application.additionalNotes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Property</p>
                  <p className="font-medium">{property.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{property.city}, {property.state}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="font-medium">${property.rentPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Income Ratio</p>
                  <p className="font-medium">
                    {(application.monthlyIncome / property.rentPrice).toFixed(1)}x rent
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Decision Form */}
            {application.status === 'under_review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Make Decision</CardTitle>
                  <CardDescription>Review complete. Make your decision.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (optional)</label>
                    <form id="approve-form" action={handleApprove}>
                      <Textarea 
                        name="landlordNotes" 
                        placeholder="Add any notes about your decision..."
                        rows={3}
                      />
                    </form>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button type="submit" form="approve-form" className="w-full bg-green-600 hover:bg-green-700">
                      <Check className="mr-2 h-4 w-4" />
                      Approve Application
                    </Button>
                    <form action={handleReject}>
                      <input type="hidden" name="landlordNotes" value="" />
                      <Button type="submit" variant="destructive" className="w-full">
                        <X className="mr-2 h-4 w-4" />
                        Reject Application
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status Info */}
            {application.status !== 'under_review' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Decision Made</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`flex items-center gap-3 rounded-lg p-4 ${
                    application.status === 'approved' ? 'bg-green-50 text-green-700' :
                    application.status === 'rejected' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  }`}>
                    {application.status === 'approved' ? (
                      <Check className="h-5 w-5" />
                    ) : application.status === 'rejected' ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium capitalize">
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                  {application.landlordNotes && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Your notes:</p>
                      <p className="mt-1 text-sm">{application.landlordNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
