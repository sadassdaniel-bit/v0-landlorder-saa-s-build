import type { User, Property, Application, Document, Subscription } from './types'

// In-memory store for demo purposes
// In production, this would be replaced with a database

class Store {
  private users: Map<string, User> = new Map()
  private properties: Map<string, Property> = new Map()
  private applications: Map<string, Application> = new Map()
  private documents: Map<string, Document> = new Map()
  private subscriptions: Map<string, Subscription> = new Map()
  private sessions: Map<string, { userId: string; expiresAt: Date }> = new Map()

  // User methods
  createUser(user: User): User {
    this.users.set(user.id, user)
    return user
  }

  getUser(id: string): User | undefined {
    return this.users.get(id)
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email)
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.users.get(id)
    if (!user) return undefined
    const updated = { ...user, ...updates, updatedAt: new Date() }
    this.users.set(id, updated)
    return updated
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  // Property methods
  createProperty(property: Property): Property {
    this.properties.set(property.id, property)
    return property
  }

  getProperty(id: string): Property | undefined {
    return this.properties.get(id)
  }

  getPropertiesByLandlord(landlordId: string): Property[] {
    return Array.from(this.properties.values()).filter(p => p.landlordId === landlordId)
  }

  getActiveProperties(): Property[] {
    return Array.from(this.properties.values()).filter(p => p.status === 'active')
  }

  updateProperty(id: string, updates: Partial<Property>): Property | undefined {
    const property = this.properties.get(id)
    if (!property) return undefined
    const updated = { ...property, ...updates, updatedAt: new Date() }
    this.properties.set(id, updated)
    return updated
  }

  deleteProperty(id: string): boolean {
    return this.properties.delete(id)
  }

  getAllProperties(): Property[] {
    return Array.from(this.properties.values())
  }

  // Application methods
  createApplication(application: Application): Application {
    this.applications.set(application.id, application)
    return application
  }

  getApplication(id: string): Application | undefined {
    return this.applications.get(id)
  }

  getApplicationsByProperty(propertyId: string): Application[] {
    return Array.from(this.applications.values()).filter(a => a.propertyId === propertyId)
  }

  getApplicationsByTenant(tenantId: string): Application[] {
    return Array.from(this.applications.values()).filter(a => a.tenantId === tenantId)
  }

  updateApplication(id: string, updates: Partial<Application>): Application | undefined {
    const application = this.applications.get(id)
    if (!application) return undefined
    const updated = { ...application, ...updates, updatedAt: new Date() }
    this.applications.set(id, updated)
    return updated
  }

  getAllApplications(): Application[] {
    return Array.from(this.applications.values())
  }

  // Document methods
  createDocument(document: Document): Document {
    this.documents.set(document.id, document)
    return document
  }

  getDocumentsByApplication(applicationId: string): Document[] {
    return Array.from(this.documents.values()).filter(d => d.applicationId === applicationId)
  }

  // Subscription methods
  createSubscription(subscription: Subscription): Subscription {
    this.subscriptions.set(subscription.id, subscription)
    return subscription
  }

  getSubscriptionByUser(userId: string): Subscription | undefined {
    return Array.from(this.subscriptions.values()).find(s => s.userId === userId)
  }

  updateSubscription(id: string, updates: Partial<Subscription>): Subscription | undefined {
    const subscription = this.subscriptions.get(id)
    if (!subscription) return undefined
    const updated = { ...subscription, ...updates }
    this.subscriptions.set(id, updated)
    return updated
  }

  // Session methods
  createSession(sessionId: string, userId: string): void {
    this.sessions.set(sessionId, {
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    })
  }

  getSession(sessionId: string): { userId: string; expiresAt: Date } | undefined {
    const session = this.sessions.get(sessionId)
    if (!session) return undefined
    if (session.expiresAt < new Date()) {
      this.sessions.delete(sessionId)
      return undefined
    }
    return session
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }

  // Seed demo data
  seedDemoData() {
    // Demo landlord
    const landlord: User = {
      id: 'demo-landlord',
      email: 'landlord@demo.com',
      name: 'John Smith',
      role: 'landlord',
      phone: '555-123-4567',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.createUser(landlord)

    // Demo tenant
    const tenant: User = {
      id: 'demo-tenant',
      email: 'tenant@demo.com',
      name: 'Jane Doe',
      role: 'tenant',
      phone: '555-987-6543',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.createUser(tenant)

    // Demo admin
    const admin: User = {
      id: 'demo-admin',
      email: 'admin@landlorder.com',
      name: 'Admin User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.createUser(admin)

    // Demo properties
    const properties: Property[] = [
      {
        id: 'prop-1',
        landlordId: 'demo-landlord',
        title: 'Modern Downtown Loft',
        description: 'Beautiful open-concept loft in the heart of downtown. Features exposed brick, high ceilings, and stunning city views. Walking distance to restaurants, shops, and public transit.',
        address: '123 Main St, Unit 4B',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        rentPrice: 2500,
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        amenities: ['In-unit laundry', 'Central AC', 'Gym access', 'Rooftop deck', 'Pet-friendly'],
        photoUrls: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prop-2',
        landlordId: 'demo-landlord',
        title: 'Cozy Suburban Home',
        description: 'Charming 3-bedroom home in a quiet neighborhood. Large backyard, updated kitchen, and 2-car garage. Great schools nearby.',
        address: '456 Oak Avenue',
        city: 'Round Rock',
        state: 'TX',
        zipCode: '78664',
        rentPrice: 2200,
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        amenities: ['Backyard', 'Garage', 'Dishwasher', 'Central AC', 'Pet-friendly'],
        photoUrls: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'prop-3',
        landlordId: 'demo-landlord',
        title: 'Luxury High-Rise Apartment',
        description: 'Premium 1-bedroom apartment with floor-to-ceiling windows and panoramic views. Building amenities include pool, fitness center, and concierge service.',
        address: '789 Skyline Blvd, Unit 2201',
        city: 'Austin',
        state: 'TX',
        zipCode: '78702',
        rentPrice: 3200,
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 850,
        amenities: ['Pool', 'Gym', 'Concierge', 'Parking included', 'In-unit laundry'],
        photoUrls: [],
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    properties.forEach(p => this.createProperty(p))
  }
}

// Create singleton instance
const globalStore = globalThis as typeof globalThis & { store?: Store }
export const store = globalStore.store ?? new Store()
if (process.env.NODE_ENV !== 'production') globalStore.store = store

// Seed demo data on first load
store.seedDemoData()
