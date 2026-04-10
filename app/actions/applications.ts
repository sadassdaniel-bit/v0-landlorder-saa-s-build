'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { store } from '@/lib/store'
import { getCurrentUser, requireRole } from './auth'
import type { Application, ApplicationStatus, ScreeningBreakdown, ScreeningRecommendation } from '@/lib/types'

// AI Screening calculation
function calculateScreeningScore(application: Application, rentPrice: number): {
  score: number
  recommendation: ScreeningRecommendation
  breakdown: ScreeningBreakdown
} {
  const breakdown: ScreeningBreakdown = {
    incomeToRentRatio: { score: 0, maxScore: 30, details: '' },
    employmentStability: { score: 0, maxScore: 25, details: '' },
    rentalHistory: { score: 0, maxScore: 20, details: '' },
    references: { score: 0, maxScore: 15, details: '' },
    applicationCompleteness: { score: 0, maxScore: 10, details: '' }
  }

  // Income to Rent Ratio (30 points) - must be 3x monthly rent
  const incomeRatio = application.monthlyIncome / rentPrice
  if (incomeRatio >= 3) {
    breakdown.incomeToRentRatio.score = 30
    breakdown.incomeToRentRatio.details = `Excellent: Income is ${incomeRatio.toFixed(1)}x rent (${incomeRatio >= 4 ? 'exceeds' : 'meets'} 3x requirement)`
  } else if (incomeRatio >= 2.5) {
    breakdown.incomeToRentRatio.score = 22
    breakdown.incomeToRentRatio.details = `Good: Income is ${incomeRatio.toFixed(1)}x rent (slightly below 3x)`
  } else if (incomeRatio >= 2) {
    breakdown.incomeToRentRatio.score = 15
    breakdown.incomeToRentRatio.details = `Fair: Income is ${incomeRatio.toFixed(1)}x rent (below recommended 3x)`
  } else {
    breakdown.incomeToRentRatio.score = 5
    breakdown.incomeToRentRatio.details = `Poor: Income is ${incomeRatio.toFixed(1)}x rent (significantly below 3x)`
  }

  // Employment Stability (25 points)
  switch (application.employmentStatus) {
    case 'employed':
      breakdown.employmentStability.score = 25
      breakdown.employmentStability.details = `Employed at ${application.employerName} as ${application.jobTitle}`
      break
    case 'self_employed':
      breakdown.employmentStability.score = 20
      breakdown.employmentStability.details = 'Self-employed - verify income documentation'
      break
    case 'retired':
      breakdown.employmentStability.score = 22
      breakdown.employmentStability.details = 'Retired - fixed income likely stable'
      break
    case 'student':
      breakdown.employmentStability.score = 12
      breakdown.employmentStability.details = 'Student - may require co-signer'
      break
    case 'unemployed':
      breakdown.employmentStability.score = 0
      breakdown.employmentStability.details = 'Currently unemployed - high risk'
      break
  }

  // Rental History (20 points)
  let rentalScore = 0
  const rentalDetails: string[] = []
  
  if (application.currentAddress) {
    rentalScore += 8
    rentalDetails.push('Current address provided')
  }
  if (application.currentLandlord && application.currentLandlordPhone) {
    rentalScore += 8
    rentalDetails.push('Landlord reference available')
  }
  if (application.reasonForMoving) {
    rentalScore += 4
    rentalDetails.push(`Reason for moving: ${application.reasonForMoving}`)
  }
  
  breakdown.rentalHistory.score = Math.min(rentalScore, 20)
  breakdown.rentalHistory.details = rentalDetails.join('. ') || 'Incomplete rental history'

  // References (15 points)
  let refScore = 0
  const refDetails: string[] = []
  
  if (application.reference1Name && application.reference1Phone && application.reference1Relation) {
    refScore += 7.5
    refDetails.push(`Reference 1: ${application.reference1Name} (${application.reference1Relation})`)
  }
  if (application.reference2Name && application.reference2Phone && application.reference2Relation) {
    refScore += 7.5
    refDetails.push(`Reference 2: ${application.reference2Name} (${application.reference2Relation})`)
  }
  
  breakdown.references.score = refScore
  breakdown.references.details = refDetails.join('. ') || 'No references provided'

  // Application Completeness (10 points)
  let completenessScore = 0
  const missingFields: string[] = []
  
  if (application.ssn) completenessScore += 3
  else missingFields.push('SSN')
  
  if (application.dateOfBirth) completenessScore += 2
  else missingFields.push('DOB')
  
  if (application.phone) completenessScore += 2
  else missingFields.push('Phone')
  
  if (application.additionalNotes) completenessScore += 3
  
  breakdown.applicationCompleteness.score = completenessScore
  breakdown.applicationCompleteness.details = missingFields.length > 0 
    ? `Missing: ${missingFields.join(', ')}`
    : 'All required fields complete'

  // Calculate total score
  const totalScore = 
    breakdown.incomeToRentRatio.score +
    breakdown.employmentStability.score +
    breakdown.rentalHistory.score +
    breakdown.references.score +
    breakdown.applicationCompleteness.score

  // Determine recommendation
  let recommendation: ScreeningRecommendation
  if (totalScore >= 70) {
    recommendation = 'approve'
  } else if (totalScore >= 45) {
    recommendation = 'conditional'
  } else {
    recommendation = 'deny'
  }

  return { score: totalScore, recommendation, breakdown }
}

export async function createApplication(propertyId: string, formData: FormData) {
  const user = await requireRole(['tenant'])
  
  const property = store.getProperty(propertyId)
  if (!property) {
    return { error: 'Property not found' }
  }

  const application: Application = {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    propertyId,
    tenantId: user.id,
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    dateOfBirth: formData.get('dateOfBirth') as string,
    ssn: formData.get('ssn') as string,
    employerName: formData.get('employerName') as string,
    employerPhone: formData.get('employerPhone') as string,
    jobTitle: formData.get('jobTitle') as string,
    monthlyIncome: parseFloat(formData.get('monthlyIncome') as string),
    employmentStatus: formData.get('employmentStatus') as Application['employmentStatus'],
    currentAddress: formData.get('currentAddress') as string,
    currentLandlord: formData.get('currentLandlord') as string || undefined,
    currentLandlordPhone: formData.get('currentLandlordPhone') as string || undefined,
    reasonForMoving: formData.get('reasonForMoving') as string,
    reference1Name: formData.get('reference1Name') as string,
    reference1Phone: formData.get('reference1Phone') as string,
    reference1Relation: formData.get('reference1Relation') as string,
    reference2Name: formData.get('reference2Name') as string,
    reference2Phone: formData.get('reference2Phone') as string,
    reference2Relation: formData.get('reference2Relation') as string,
    additionalNotes: formData.get('additionalNotes') as string || undefined,
    paymentStatus: 'unpaid',
    status: 'pending',
    backgroundCheckStatus: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  store.createApplication(application)
  
  revalidatePath('/dashboard/tenant')
  revalidatePath('/dashboard/landlord')
  
  // Redirect to payment
  redirect(`/apply/${propertyId}/payment?applicationId=${application.id}`)
}

export async function processPaymentAndScreening(applicationId: string) {
  const application = store.getApplication(applicationId)
  if (!application) {
    return { error: 'Application not found' }
  }

  const property = store.getProperty(application.propertyId)
  if (!property) {
    return { error: 'Property not found' }
  }

  // Calculate AI screening score
  const { score, recommendation, breakdown } = calculateScreeningScore(application, property.rentPrice)

  // Update application with screening results
  store.updateApplication(applicationId, {
    paymentStatus: 'paid',
    status: 'under_review',
    backgroundCheckStatus: 'completed',
    screeningScore: score,
    screeningRecommendation: recommendation,
    screeningBreakdown: breakdown,
    screeningCompletedAt: new Date()
  })

  revalidatePath('/dashboard/tenant')
  revalidatePath('/dashboard/landlord')

  return { success: true, score, recommendation }
}

export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus, landlordNotes?: string) {
  const user = await requireRole(['landlord', 'admin'])
  
  const application = store.getApplication(applicationId)
  if (!application) {
    return { error: 'Application not found' }
  }

  // Verify landlord owns the property
  if (user.role === 'landlord') {
    const property = store.getProperty(application.propertyId)
    if (!property || property.landlordId !== user.id) {
      return { error: 'Unauthorized' }
    }
  }

  store.updateApplication(applicationId, { 
    status,
    landlordNotes: landlordNotes || application.landlordNotes 
  })

  revalidatePath('/dashboard/landlord')
  revalidatePath('/dashboard/tenant')
  revalidatePath('/dashboard/admin')

  return { success: true }
}

export async function getApplicationsForLandlord() {
  const user = await requireRole(['landlord'])
  const properties = store.getPropertiesByLandlord(user.id)
  
  const applications: Application[] = []
  for (const property of properties) {
    applications.push(...store.getApplicationsByProperty(property.id))
  }
  
  return applications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getApplicationsForTenant() {
  const user = await requireRole(['tenant'])
  return store.getApplicationsByTenant(user.id).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getApplicationById(id: string) {
  const user = await getCurrentUser()
  if (!user) return null
  
  const application = store.getApplication(id)
  if (!application) return null

  // Check authorization
  if (user.role === 'tenant' && application.tenantId !== user.id) {
    return null
  }
  
  if (user.role === 'landlord') {
    const property = store.getProperty(application.propertyId)
    if (!property || property.landlordId !== user.id) {
      return null
    }
  }

  return application
}

export async function getAllApplications() {
  await requireRole(['admin'])
  return store.getAllApplications().sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
