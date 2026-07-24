
// Lead scoring algorithm
export function calculateLeadScore(criteria: {
  hasCompany?: boolean;
  hasPhone?: boolean;
  messageLength?: number;
  source?: string;
  budget?: string;
  timeline?: string;
  servicesCount?: number;
  engagementLevel?: number;
  companySize?: string;
}): number {
  let score = 0;

  // Base score for complete contact info
  if (criteria.hasCompany) score += 15;
  if (criteria.hasPhone) score += 10;

  // Message quality scoring
  const messageLength = criteria.messageLength || 0;
  if (messageLength > 100) score += 20;
  else if (messageLength > 50) score += 15;
  else if (messageLength > 20) score += 10;
  else score += 5;

  // Source quality
  switch (criteria.source) {
    case 'referral':
      score += 25;
      break;
    case 'organic_search':
      score += 20;
      break;
    case 'direct':
      score += 15;
      break;
    case 'social_media':
      score += 10;
      break;
    case 'paid_ads':
      score += 8;
      break;
    default:
      score += 5;
  }

  // Budget indication
  if (criteria.budget) {
    const budget = criteria.budget.toLowerCase();
    if (budget.includes('50k') || budget.includes('high') || budget.includes('enterprise')) {
      score += 20;
    } else if (budget.includes('25k') || budget.includes('medium') || budget.includes('substantial')) {
      score += 15;
    } else if (budget.includes('10k') || budget.includes('moderate')) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Timeline urgency
  if (criteria.timeline) {
    const timeline = criteria.timeline.toLowerCase();
    if (timeline.includes('asap') || timeline.includes('urgent') || timeline.includes('immediate')) {
      score += 15;
    } else if (timeline.includes('month') || timeline.includes('soon')) {
      score += 12;
    } else if (timeline.includes('quarter') || timeline.includes('3 months')) {
      score += 8;
    } else {
      score += 5;
    }
  }

  // Services interest
  const servicesCount = criteria.servicesCount || 0;
  if (servicesCount >= 3) score += 15;
  else if (servicesCount >= 2) score += 10;
  else if (servicesCount >= 1) score += 5;

  // Company size (if provided)
  if (criteria.companySize) {
    const size = criteria.companySize.toLowerCase();
    if (size.includes('enterprise') || size.includes('large') || size.includes('500+')) {
      score += 15;
    } else if (size.includes('medium') || size.includes('50-500')) {
      score += 10;
    } else {
      score += 5;
    }
  }

  // Engagement level (if tracked)
  if (criteria.engagementLevel) {
    score += Math.min(criteria.engagementLevel * 2, 10);
  }

  // Ensure score is between 0 and 100
  return Math.min(Math.max(score, 0), 100);
}

// Lead status priority mapping
export function getStatusPriority(status: string): number {
  const priorities: Record<string, number> = {
    'new': 1,
    'contacted': 2,
    'qualified': 3,
    'converted': 4,
    'closed': 5,
  };
  return priorities[status] || 0;
}

// Format lead score for display
export function formatLeadScore(score: number): { score: number; level: string; color: string } {
  if (score >= 80) {
    return { score, level: 'Hot', color: '#dc3545' };
  } else if (score >= 60) {
    return { score, level: 'Warm', color: '#fd7e14' };
  } else if (score >= 40) {
    return { score, level: 'Cool', color: '#ffc107' };
  } else {
    return { score, level: 'Cold', color: '#6c757d' };
  }
}

// Generate lead insights
export function generateLeadInsights(lead: any): string[] {
  const insights: string[] = [];

  if (lead.score >= 80) {
    insights.push('High-priority lead - recommend immediate follow-up');
  }

  if (lead.company && !lead.phone) {
    insights.push('Consider looking up company phone number for direct contact');
  }

  if (lead.budget && lead.budget.toLowerCase().includes('flexible')) {
    insights.push('Budget flexibility mentioned - opportunity for upselling');
  }

  if (lead.timeline && lead.timeline.toLowerCase().includes('urgent')) {
    insights.push('Urgent timeline - prioritize quick response');
  }

  if (lead.services && lead.services.length > 2) {
    insights.push('Multiple services interest - potential for larger project');
  }

  if (lead.source === 'referral') {
    insights.push('Referral lead - typically higher conversion rate');
  }

  const daysSinceSubmission = Math.floor((Date.now() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceSubmission > 3 && lead.status === 'new') {
    insights.push(`Lead is ${daysSinceSubmission} days old - follow up needed`);
  }

  return insights;
}
