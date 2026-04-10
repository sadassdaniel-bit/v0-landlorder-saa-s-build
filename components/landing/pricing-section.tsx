import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const plans = [
  {
    name: 'Tenant',
    price: '$40',
    period: 'one-time',
    description: '30 days of unlimited applications',
    features: [
      'Apply to unlimited properties',
      'Single application profile',
      'Document storage',
      'Real-time status tracking',
      'Email notifications',
      'Mobile-friendly experience'
    ],
    cta: 'Start Applying',
    href: '/signup?role=tenant',
    popular: false
  },
  {
    name: 'Landlord Pro',
    price: '$9.99',
    period: '/month',
    description: 'Full access to all tenant applications',
    features: [
      'Unlimited property listings',
      'AI-powered screening reports',
      'Full application access',
      'Document downloads',
      'Applicant communication',
      'Priority support',
      'Analytics dashboard'
    ],
    cta: 'Start Free Trial',
    href: '/signup?role=landlord',
    popular: true
  },
  {
    name: 'Landlord Free',
    price: '$0',
    period: '/month',
    description: 'Get started with basic features',
    features: [
      '1 property listing',
      'Basic application notifications',
      'Limited screening preview',
      'Email support'
    ],
    cta: 'Get Started',
    href: '/signup?role=landlord',
    popular: false
  }
]

export function PricingSection() {
  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            No hidden fees. No surprises. Just straightforward pricing for landlords and tenants.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
