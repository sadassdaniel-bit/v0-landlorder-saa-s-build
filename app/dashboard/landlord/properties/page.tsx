import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Building2 } from 'lucide-react'
import { requireRole } from '@/app/actions/auth'
import { getLandlordProperties, deleteProperty, togglePropertyStatus } from '@/app/actions/properties'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default async function LandlordPropertiesPage() {
  const user = await requireRole(['landlord'])
  const properties = await getLandlordProperties()

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Properties</h1>
            <p className="text-muted-foreground">Manage your rental property listings</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        </div>

        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
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
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Rent</TableHead>
                    <TableHead>Beds/Baths</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{property.title}</div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {property.city}, {property.state}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${property.rentPrice.toLocaleString()}/mo
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {property.bedrooms} bed / {property.bathrooms} bath
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          property.status === 'active' ? 'bg-green-100 text-green-700' :
                          property.status === 'rented' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {property.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/properties/${property.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Listing
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <form action={togglePropertyStatus.bind(null, property.id)}>
                              <DropdownMenuItem asChild>
                                <button type="submit" className="w-full cursor-pointer">
                                  {property.status === 'active' ? (
                                    <>
                                      <ToggleLeft className="mr-2 h-4 w-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <ToggleRight className="mr-2 h-4 w-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                              </DropdownMenuItem>
                            </form>
                            <DropdownMenuSeparator />
                            <form action={deleteProperty.bind(null, property.id)}>
                              <DropdownMenuItem asChild>
                                <button type="submit" className="w-full cursor-pointer text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </DropdownMenuItem>
                            </form>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
