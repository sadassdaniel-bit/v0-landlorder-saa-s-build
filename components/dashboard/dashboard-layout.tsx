'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { 
  Building2, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  BarChart3,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import type { User } from '@/lib/types'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

const landlordLinks = [
  { href: '/dashboard/landlord', label: 'Overview', icon: Home },
  { href: '/dashboard/landlord/properties', label: 'Properties', icon: Building2 },
  { href: '/dashboard/landlord/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/landlord/settings', label: 'Settings', icon: Settings },
]

const tenantLinks = [
  { href: '/dashboard/tenant', label: 'Overview', icon: Home },
  { href: '/dashboard/tenant/applications', label: 'My Applications', icon: FileText },
  { href: '/dashboard/tenant/saved', label: 'Saved Properties', icon: Building2 },
  { href: '/dashboard/tenant/settings', label: 'Settings', icon: Settings },
]

const adminLinks = [
  { href: '/dashboard/admin', label: 'Overview', icon: Home },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/properties', label: 'Properties', icon: Building2 },
  { href: '/dashboard/admin/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
]

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const links = user.role === 'admin' 
    ? adminLinks 
    : user.role === 'landlord' 
      ? landlordLinks 
      : tenantLinks

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card border-r border-border transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.jpeg"
              alt="Landlorder"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-foreground">Landlorder</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
          <form action={handleSignOut}>
            <Button variant="ghost" className="mt-3 w-full justify-start" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
          <Link href="/properties">
            <Button variant="outline" size="sm">
              Browse Rentals
            </Button>
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
