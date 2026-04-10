import { Building2, Shield, FileText, CreditCard, Users, Zap } from 'lucide-react'

const landlordFeatures = [
  {
    icon: Building2,
    title: 'Free Property Listings',
    description: 'Post unlimited properties for free. Get exposure to qualified tenants instantly.'
  },
  {
    icon: Shield,
    title: 'AI Screening Reports',
    description: 'Automatic tenant screening with detailed scorecards. Income, employment, and reference verification.'
  },
  {
    icon: FileText,
    title: 'Document Management',
    description: 'Secure cloud storage for tenant documents. Access IDs, pay stubs, and references anytime.'
  }
]

const tenantFeatures = [
  {
    icon: CreditCard,
    title: 'One Fee, Unlimited Apps',
    description: 'Pay $40 once and apply to unlimited rentals for 30 days. No more per-application fees.'
  },
  {
    icon: Users,
    title: 'Single Profile',
    description: 'Create your profile once. Auto-fill applications with your saved information.'
  },
  {
    icon: Zap,
    title: 'Instant Applications',
    description: 'Apply in minutes, not hours. Track your application status in real-time.'
  }
]

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to rent smarter
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Whether you&apos;re a landlord or tenant, Landlorder streamlines the entire rental process.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Landlord Features */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              For Landlords
            </div>
            <div className="space-y-8">
              {landlordFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tenant Features */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-2 text-sm font-semibold text-secondary-foreground">
              For Tenants
            </div>
            <div className="space-y-8">
              {tenantFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/50">
                    <feature.icon className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
