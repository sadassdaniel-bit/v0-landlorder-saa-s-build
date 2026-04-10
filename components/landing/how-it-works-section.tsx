import { FileEdit, Upload, CreditCard, CheckCircle } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: FileEdit,
    title: 'Create Your Profile',
    description: 'Sign up and choose your role. Landlords post properties, tenants build their rental profile.'
  },
  {
    number: '02',
    icon: Upload,
    title: 'Submit Application',
    description: 'Tenants fill out one application with documents. Apply to multiple properties instantly.'
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Quick Payment',
    description: 'Tenants pay $40 for 30 days of unlimited applications. Landlords get full access for $9.99/month.'
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'AI Screening & Decision',
    description: 'Our AI analyzes applications instantly. Landlords receive detailed screening reports to make informed decisions.'
  }
]

export function HowItWorksSection() {
  return (
    <section className="bg-background px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Get started in minutes. Our streamlined process makes renting simple for everyone.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border lg:block" />
              )}
              
              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/30">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <span className="mt-4 text-sm font-bold text-primary">{step.number}</span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
