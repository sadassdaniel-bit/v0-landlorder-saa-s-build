export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  type: 'one_time' | 'subscription'
  mode: 'payment' | 'subscription'
}

export const PRODUCTS: Product[] = [
  {
    id: 'tenant-application',
    name: 'Tenant Application Fee',
    description: '30 days of unlimited rental applications with AI-powered screening',
    priceInCents: 4000, // $40
    type: 'one_time',
    mode: 'payment'
  },
  {
    id: 'landlord-subscription',
    name: 'Landlord Pro Subscription',
    description: 'Full access to tenant applications, screening reports, and property management',
    priceInCents: 999, // $9.99/month
    type: 'subscription',
    mode: 'subscription'
  }
]
