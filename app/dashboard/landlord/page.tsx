import Link from 'next/link'
import { Building2, FileText, DollarSign, TrendingUp, Plus } from 'lucide-react'
import { requireRole } from '@/app/actions/auth'
import { getLandlordProperties } from '@/app/actions/properties'
import { getApplicationsForLandlord } from '@/app/actions/applications'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/properties/property-card'

export default async function LandlordDashboardPage() {
  const user = await requireRole(['landlord'])
  const properties = await getLandlordProperties()
  const applications = await getApplicationsForLandlord()

  const stats = [
    {
      title: 'Total Properties',
      value: properties.length,
      icon: Building2,
      description: `${properties.filter(p => p.status === 'active').length} active`
    },
    {
      title: 'Total Applications',
      value: applications.length,
      icon: FileText,
      description: `${applications.filter(a => a.status === 'pending').length} pending`
    },
    {
      title: 'Potential Revenue',
      value: `$${properties.reduce((sum, p) => sum + p.rentPrice, 0).toLocaleString()}`,
      icon: DollarSign,
      description: 'Monthly total'
    },
    {
      title: 'Approval Rate',
      value: applications.length > 0 
        ? `${Math.round((applications.filter(a => a.status === 'approved').length / applications.length) * 100)}%`
        : '0%',
      icon: TrendingUp,
      description: 'All time'
    }
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your properties</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
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

        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest tenant applications for your properties</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/landlord/applications">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No applications yet. Once tenants apply to your properties, they&apos;ll appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.slice(0, 5).map((app) => {
                  const property = properties.find(p => p.id === app.propertyId)
                  return (
                    <div key={app.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium text-foreground">{app.firstName} {app.lastName}</p>
                        <p className="text-sm text-muted-foreground">{property?.title || 'Unknown property'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          app.status === 'approved' ? 'bg-green-100 text-green-700' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          app.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/landlord/applications/${app.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Properties */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Your Properties</h2>
            <Button variant="outline" asChild>
              <Link href="/dashboard/landlord/properties">Manage All</Link>
            </Button>
          </div>
          {properties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No properties yet</h3>
                <p className="mt-2 text-muted-foreground">Add your first property to start receiving applications</p>
                <Button asChild className="mt-4">
                  <Link href="/dashboard/landlord/properties/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Property
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} property={property} showActions={false} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
