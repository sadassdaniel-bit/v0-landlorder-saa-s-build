'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Building2, 
  FileText, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  MoreHorizontal,
  Trash2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getAdminStats, getAllUsers, getAllPropertiesAdmin, getAllApplicationsAdmin, deleteProperty, suspendUser } from '@/app/actions/admin'
import type { User, Property, Application } from '@/lib/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<{
    totalUsers: number
    totalLandlords: number
    totalTenants: number
    totalProperties: number
    totalApplications: number
    pendingApplications: number
    totalRevenue: number
  } | null>(null)
  const [users, setUsers] = useState<Omit<User, 'passwordHash'>[]>([])
  const [properties, setProperties] = useState<(Property & { landlordName: string })[]>([])
  const [applications, setApplications] = useState<(Application & { tenantName: string; propertyTitle: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, usersData, propertiesData, applicationsData] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getAllPropertiesAdmin(),
          getAllApplicationsAdmin()
        ])
        setStats(statsData)
        setUsers(usersData)
        setProperties(propertiesData)
        setApplications(applicationsData)
      } catch (error) {
        console.error('Failed to fetch admin data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      await deleteProperty(propertyId)
      setProperties(prev => prev.filter(p => p.id !== propertyId))
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      await suspendUser(userId)
      // In a real app, update the UI to show suspended status
    } catch (error) {
      console.error('Failed to suspend user:', error)
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="admin">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage the entire Landlorder platform.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalLandlords || 0} landlords, {stats?.totalTenants || 0} tenants
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pendingApplications || 0} pending review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">From application fees</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different management sections */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users.</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users registered yet.</p>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email</th>
                          <th className="px-4 py-3">Role</th>
                          <th className="px-4 py-3">Joined</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="px-4 py-3 font-medium">{user.name}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">
                              <Badge variant={user.role === 'landlord' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleSuspendUser(user.id)}>
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Suspend User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
                <CardDescription>View and moderate all property listings.</CardDescription>
              </CardHeader>
              <CardContent>
                {properties.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No properties listed yet.</p>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3">Property</th>
                          <th className="px-4 py-3">Landlord</th>
                          <th className="px-4 py-3">Price</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((property) => (
                          <tr key={property.id} className="border-b">
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-medium">{property.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {property.city}, {property.state}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">{property.landlordName}</td>
                            <td className="px-4 py-3">${property.price}/mo</td>
                            <td className="px-4 py-3">
                              <Badge variant={property.available ? 'default' : 'secondary'}>
                                {property.available ? 'Available' : 'Rented'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteProperty(property.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Property
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Application Overview</CardTitle>
                <CardDescription>Monitor all rental applications on the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No applications submitted yet.</p>
                ) : (
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs uppercase bg-muted/50">
                        <tr>
                          <th className="px-4 py-3">Applicant</th>
                          <th className="px-4 py-3">Property</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Payment</th>
                          <th className="px-4 py-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((application) => (
                          <tr key={application.id} className="border-b">
                            <td className="px-4 py-3 font-medium">{application.tenantName}</td>
                            <td className="px-4 py-3">{application.propertyTitle}</td>
                            <td className="px-4 py-3">
                              <Badge variant={
                                application.status === 'approved' ? 'default' :
                                application.status === 'pending' ? 'secondary' :
                                'destructive'
                              }>
                                {application.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant={application.paymentStatus === 'paid' ? 'default' : 'outline'}>
                                {application.paymentStatus}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              {new Date(application.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
