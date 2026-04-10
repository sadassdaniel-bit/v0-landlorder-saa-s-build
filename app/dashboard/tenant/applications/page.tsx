import Link from 'next/link'
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import { requireRole } from '@/app/actions/auth'
import { getApplicationsForTenant } from '@/app/actions/applications'
import { getActiveProperties, getPropertyById } from '@/app/actions/properties'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { store } from '@/lib/store'

function getStatusIcon(status: string) {
  switch (status) {
    case 'approved':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'rejected':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-700'
    case 'rejected':
      return 'bg-red-100 text-red-700'
    case 'under_review':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-yellow-100 text-yellow-700'
  }
}

export default async function TenantApplicationsPage() {
  const user = await requireRole(['tenant'])
  const applications = await getApplicationsForTenant()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
            <p className="text-muted-foreground">Track the status of all your rental applications</p>
          </div>
          <Button asChild>
            <Link href="/properties">Browse More Rentals</Link>
          </Button>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No applications yet</h3>
              <p className="mt-2 text-muted-foreground">
                Start your rental journey by applying to properties
              </p>
              <Button asChild className="mt-4">
                <Link href="/properties">Browse Rentals</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => {
              const property = store.getProperty(app.propertyId)
              return (
                <Card key={app.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        {getStatusIcon(app.status)}
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {property?.title || 'Property'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {property?.city}, {property?.state} - ${property?.rentPrice.toLocaleString()}/mo
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span>Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getStatusBadge(app.status)}`}>
                              {app.status.replace('_', ' ')}
                            </span>
                            {app.screeningScore !== undefined && (
                              <span className="font-medium">Score: {app.screeningScore}/100</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/properties/${app.propertyId}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Property
                          </Link>
                        </Button>
                        <Button size="sm" asChild>
                          <Link href={`/dashboard/tenant/applications/${app.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="mt-6 border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className={`flex flex-col items-center ${app.paymentStatus === 'paid' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <div className={`h-3 w-3 rounded-full ${app.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-muted'}`} />
                          <span className="mt-1">Payment</span>
                        </div>
                        <div className={`h-0.5 flex-1 mx-2 ${app.backgroundCheckStatus === 'completed' ? 'bg-green-500' : 'bg-muted'}`} />
                        <div className={`flex flex-col items-center ${app.backgroundCheckStatus === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <div className={`h-3 w-3 rounded-full ${app.backgroundCheckStatus === 'completed' ? 'bg-green-500' : 'bg-muted'}`} />
                          <span className="mt-1">Screening</span>
                        </div>
                        <div className={`h-0.5 flex-1 mx-2 ${app.status === 'under_review' || app.status === 'approved' || app.status === 'rejected' ? 'bg-green-500' : 'bg-muted'}`} />
                        <div className={`flex flex-col items-center ${app.status === 'under_review' || app.status === 'approved' || app.status === 'rejected' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          <div className={`h-3 w-3 rounded-full ${app.status === 'under_review' || app.status === 'approved' || app.status === 'rejected' ? 'bg-green-500' : 'bg-muted'}`} />
                          <span className="mt-1">Review</span>
                        </div>
                        <div className={`h-0.5 flex-1 mx-2 ${app.status === 'approved' || app.status === 'rejected' ? 'bg-green-500' : 'bg-muted'}`} />
                        <div className={`flex flex-col items-center ${app.status === 'approved' ? 'text-green-600' : app.status === 'rejected' ? 'text-red-600' : 'text-muted-foreground'}`}>
                          <div className={`h-3 w-3 rounded-full ${app.status === 'approved' ? 'bg-green-500' : app.status === 'rejected' ? 'bg-red-500' : 'bg-muted'}`} />
                          <span className="mt-1">Decision</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
