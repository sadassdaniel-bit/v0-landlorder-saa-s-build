'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'
import { getCurrentUser } from './auth'
import { processPaymentAndScreening } from './applications'

export async function startCheckoutSession(productId: string, metadata?: { applicationId?: string }) {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Not authenticated')
  }

  const product = PRODUCTS.find((p) => p.id === productId)
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const sessionConfig: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    customer_email: user.email,
    metadata: {
      userId: user.id,
      productId: product.id,
      ...metadata
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          ...(product.mode === 'subscription' ? { recurring: { interval: 'month' } } : {})
        },
        quantity: 1,
      },
    ],
    mode: product.mode,
  }

  const session = await stripe.checkout.sessions.create(sessionConfig)
  return session.client_secret
}

export async function handlePaymentSuccess(applicationId: string) {
  return processPaymentAndScreening(applicationId)
}

export async function getSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email
  }
}
