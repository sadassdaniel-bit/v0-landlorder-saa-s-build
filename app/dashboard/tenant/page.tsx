import Link from 'next/link'
import { FileText, Building2, Clock, CheckCircle, XCircle, Search } from 'lucide-react'
import { requireRole } from '@/app/actions/auth'
import { getApplicationsForTenant } from '@/app/actions/applications'
import { getActiveProperties } from '@/app/actions/properties'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'

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

export default async function TenantDashboardPage() {
  const user = await requireRole(['tenant'])
  const applications = await getApplicationsForTenant()
  const properties = await getActiveProperties()

  const stats = [
    {
      title: 'Total Applications',
      value: applications.length,
      icon: FileText,
      description: 'All time'
    },
    {
      title: 'Pending',
      value: applications.filter(a => a.status === 'pending' || a.status === 'under_review').length,
      icon: Clock,
      description: 'Awaiting decision'
    },
    {
      title: 'Approved',
      value: applications.filter(a => a.status === 'approved').length,
      icon: CheckCircle,
      description: 'Congratulations!'
    },
    {
      title: 'Available Rentals',
      value: properties.length,
      icon: Building2,
      description: 'Properties to apply'
    }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Track your rental applications and find your next home</p>
          </div>
          <Button asChild>
            <Link href="/properties">
              <Search className="mr-2 h-4 w-4" />
              Browse Rentals
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>Track the status of your rental applications</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/tenant/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No applications yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Start your rental journey by applying to properties
                </p>
                <Button asChild className="mt-4">
                  <Link href="/properties">Browse Rentals</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => {
                  const property = properties.find(p => p.id === app.propertyId)
                  return (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(app.status)}
                        <div>
                          <p className="font-medium text-foreground">
                            {property?.title || 'Property'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/tenant/applications/${app.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Featured Properties */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Featured Rentals</h2>
            <Button variant="outline" asChild>
              <Link href="/properties">View All</Link>
            </Button>
          </div>
          {properties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No properties available</h3>
                <p className="mt-2 text-muted-foreground">Check back later for new listings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
