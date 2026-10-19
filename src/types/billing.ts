export type SubscriptionTier = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export type BillingInterval = 'MONTHLY' | 'ANNUAL';

export type SubscriptionStatus =
  | 'ACTIVE'
  | 'TRIALING'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'PAUSED';

export interface UsageQuota {
  tokensUsed: number;
  tokenLimit: number;
  agentRunsUsed: number;
  agentRunsLimit: number;
  storageMbUsed: number;
  storageMbLimit: number;
}

export interface UserSubscription {
  subscriptionId: string;
  userId: string;
  tenantId: string;
  tier: SubscriptionTier;
  interval: BillingInterval;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
}

export interface InvoiceRecord {
  invoiceId: string;
  userId: string;
  amountDueUsd: number;
  currency: string;
  status: string;
  issuedAt: string;
  hostedInvoiceUrl: string;
  pdfUrl?: string;
}

export interface ApiCreditBalance {
  userId: string;
  remainingCreditsUsd: number;
  totalPurchasedUsd: number;
  lastRefillAt: string;
}

export interface StripeCheckoutSession {
  sessionId: string;
  checkoutUrl: string;
  tier: SubscriptionTier;
  interval: BillingInterval;
}

export interface UpgradeSubscriptionRequest {
  userId?: string;
  tier: SubscriptionTier;
  interval?: BillingInterval;
}

export interface StripeCheckoutRequest {
  userId?: string;
  tier: SubscriptionTier;
  interval?: BillingInterval;
  successUrl?: string;
  cancelUrl?: string;
}

export interface TopUpCreditsRequest {
  userId?: string;
  amountUsd: number;
}
