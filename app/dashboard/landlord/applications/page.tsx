import Link from 'next/link'
import { FileText } from 'lucide-react'
import { requireRole } from '@/app/actions/auth'
import { getApplicationsForLandlord } from '@/app/actions/applications'
import { getLandlordProperties } from '@/app/actions/properties'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function getStatusColor(status: string) {
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

function getRecommendationColor(rec?: string) {
  switch (rec) {
    case 'approve':
      return 'bg-green-100 text-green-700'
    case 'conditional':
      return 'bg-yellow-100 text-yellow-700'
    case 'deny':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default async function LandlordApplicationsPage() {
  const user = await requireRole(['landlord'])
  const applications = await getApplicationsForLandlord()
  const properties = await getLandlordProperties()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications</h1>
          <p className="text-muted-foreground">Review and manage tenant applications</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No applications yet</h3>
              <p className="mt-2 text-muted-foreground">
                When tenants apply to your properties, their applications will appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>{applications.length} total applications</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Recommendation</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => {
                    const property = properties.find(p => p.id === app.propertyId)
                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">
                              {app.firstName} {app.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">{app.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {property?.title || 'Unknown'}
                        </TableCell>
                        <TableCell className="font-medium">
                          ${app.monthlyIncome.toLocaleString()}/mo
                        </TableCell>
                        <TableCell>
                          {app.screeningScore !== undefined ? (
                            <span className="font-semibold">{app.screeningScore}/100</span>
                          ) : (
                            <span className="text-muted-foreground">Pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {app.screeningRecommendation ? (
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getRecommendationColor(app.screeningRecommendation)}`}>
                              {app.screeningRecommendation}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(app.status)}`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/landlord/applications/${app.id}`}>
                              Review
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
