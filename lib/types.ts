export type UserRole = 'landlord' | 'tenant' | 'admin'

export type PropertyStatus = 'active' | 'inactive' | 'rented'

export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected'

export type PaymentStatus = 'unpaid' | 'paid' | 'failed'

export type EmploymentStatus = 'employed' | 'self_employed' | 'retired' | 'student' | 'unemployed'

export type ScreeningRecommendation = 'approve' | 'conditional' | 'deny'

export type DocumentType = 'id' | 'pay_stub' | 'reference_letter' | 'bank_statement' | 'other'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Property {
  id: string
  landlordId: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  rentPrice: number
  bedrooms: number
  bathrooms: number
  squareFeet?: number
  amenities: string[]
  photoUrls: string[]
  status: PropertyStatus
  createdAt: Date
  updatedAt: Date
}

export interface ScreeningBreakdown {
  incomeToRentRatio: { score: number; maxScore: 30; details: string }
  employmentStability: { score: number; maxScore: 25; details: string }
  rentalHistory: { score: number; maxScore: 20; details: string }
  references: { score: number; maxScore: 15; details: string }
  applicationCompleteness: { score: number; maxScore: 10; details: string }
}

export interface Application {
  id: string
  propertyId: string
  tenantId: string
  // Personal Info
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  ssn: string
  // Employment
  employerName: string
  employerPhone: string
  jobTitle: string
  monthlyIncome: number
  employmentStatus: EmploymentStatus
  // Rental History
  currentAddress: string
  currentLandlord?: string
  currentLandlordPhone?: string
  reasonForMoving: string
  // References
  reference1Name: string
  reference1Phone: string
  reference1Relation: string
  reference2Name: string
  reference2Phone: string
  reference2Relation: string
  // Additional
  additionalNotes?: string
  // Status
  paymentStatus: PaymentStatus
  status: ApplicationStatus
  backgroundCheckStatus: 'pending' | 'completed' | 'failed'
  // Landlord Review
  landlordNotes?: string
  // Screening
  screeningScore?: number
  screeningRecommendation?: ScreeningRecommendation
  screeningBreakdown?: ScreeningBreakdown
  screeningCompletedAt?: Date
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  applicationId: string
  tenantId: string
  fileName: string
  fileKey: string
  fileUrl: string
  fileType: string
  documentType: DocumentType
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  status: 'active' | 'canceled' | 'past_due'
  stripeSubscriptionId: string
  currentPeriodEnd: Date
  createdAt: Date
}
