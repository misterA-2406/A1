import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Audit Report Types
export interface ScoreBreakdown {
  technical: number;
  design: number;
  content: number;
  seo: number;
  conversion: number;
  mobile: number;
  trust: number;
  clarity: number;
}

export interface CompanyProfile {
  legalName: string;
  founded: string;
  locations: string[];
  serviceArea: string;
  teamSize: string;
}

export interface BusinessModel {
  revenueStreams: string[];
  pricingStrategy: string;
  targetMarket: string;
  customerSegments: string[];
}

export interface ValueProposition {
  mainPromise: string;
  differentiationClaims: string[];
  competitiveAdvantages: string[];
  gapAnalysis: string[];
}

export interface OnlinePresence {
  websiteTechnology: string;
  socialMedia: {
    platform: string;
    url: string;
    status: string;
  }[];
  businessListings: string[];
  recentNews: string[];
}

export interface TechnicalPerformance {
  https: boolean;
  mobileResponsive: boolean;
  pageLoadAssessment: string;
  brokenLinks: string[];
  browserCompatibility: string;
}

export interface SiteStructure {
  navigationClarity: number;
  menuItems: string[];
  userJourney: string;
  contactAccessibility: string;
}

export interface SEOElements {
  pageTitle: string;
  metaDescription: string;
  h1Tags: string[];
  altTextUsage: string;
  urlStructure: string;
  sitemap: boolean;
  robotsTxt: boolean;
  schemaMarkup: boolean;
  pageSpeedIndicators: string[];
}

export interface HomepageAnalysis {
  firstImpression: string;
  heroSection: string;
  primaryCTA: string;
  valueCommunication: string;
  trustSignals: string[];
}

export interface PageReview {
  exists: boolean;
  quality: number;
  description: string;
}

export interface ContentQuality {
  writingQuality: string;
  grammarSpelling: string;
  contentDepth: string;
  industryAuthority: string;
  contentFreshness: string;
  blog: {
    status: string;
    latestPost: string;
    frequency: string;
  };
}

export interface VisualDesign {
  designEra: string;
  brandConsistency: string;
  colorScheme: string;
  typography: string;
  imageryQuality: string;
  whiteSpaceUsage: string;
  visualHierarchy: string;
}

export interface CTAAnalysis {
  visibility: number;
  clarity: string;
  primaryCTAs: string[];
  placement: string;
}

export interface LeadGeneration {
  contactForms: string;
  phoneProminence: string;
  emailSignup: boolean;
  leadMagnets: string[];
  frictionPoints: string[];
}

export interface TrustCredibility {
  testimonials: { present: boolean; count: number };
  caseStudies: { present: boolean; count: number };
  clientLogos: boolean;
  awards: string[];
  mediasMentions: boolean;
  professionalAssociations: boolean;
  guarantees: boolean;
  securityBadges: boolean;
  privacyPolicy: boolean;
  termsOfService: boolean;
  googleReviews: { rating: number; count: number } | null;
  thirdPartyReviews: string[];
}

export interface KeywordStrategy {
  primaryKeywords: string[];
  keywordImplementation: string;
  localSEO: string;
  napConsistency: boolean;
  locationKeywords: boolean;
}

export interface ContentMarketing {
  blogStatus: string;
  contentTypes: string[];
  educationalValue: string;
  thoughtLeadership: string;
}

export interface MarketPosition {
  positioningStatement: string;
  competitiveDifferentiation: string;
  marketGaps: string[];
}

export interface IndustryComparison {
  websiteSophistication: string;
  featureCompleteness: string[];
  pricePositioning: string;
}

export interface MobileExperience {
  issues: string[];
  touchTargets: string;
  navigation: string;
  pageSpeed: string;
  ctaVisibility: string;
}

export interface Issue {
  description: string;
  impact: string;
}

export interface Recommendation {
  title: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  priority: number;
  why: string;
  how: string[];
  expectedOutcome: string;
}

export interface GrowthOpportunity {
  title: string;
  expectedLift: string;
}

export interface Competitor {
  name: string;
  url: string;
  strength: string;
}

export interface AuditReport {
  id: string;
  url: string;
  companyName: string;
  industry: string;
  auditDate: string;
  overallScore: number;
  scoreBreakdown: ScoreBreakdown;
  keyFindings: string[];
  priorityActions: string[];
  companyProfile: CompanyProfile;
  businessModel: BusinessModel;
  valueProposition: ValueProposition;
  onlinePresence: OnlinePresence;
  technicalPerformance: TechnicalPerformance;
  siteStructure: SiteStructure;
  seoElements: SEOElements;
  homepageAnalysis: HomepageAnalysis;
  aboutPage: PageReview;
  servicesPage: PageReview & { services: string[] };
  contactPage: {
    phone: string;
    email: string;
    contactForm: boolean;
    liveChat: boolean;
    address: string;
    responseTimePromise: string;
  };
  contentQuality: ContentQuality;
  visualDesign: VisualDesign;
  ctaAnalysis: CTAAnalysis;
  leadGeneration: LeadGeneration;
  trustCredibility: TrustCredibility;
  keywordStrategy: KeywordStrategy;
  contentMarketing: ContentMarketing;
  marketPosition: MarketPosition;
  industryComparison: IndustryComparison;
  mobileExperience: MobileExperience;
  highPriorityIssues: Issue[];
  mediumPriorityIssues: Issue[];
  lowPriorityIssues: Issue[];
  recommendations: Recommendation[];
  quickWins: GrowthOpportunity[];
  strategicInitiatives: GrowthOpportunity[];
  longTermVision: GrowthOpportunity[];
  competitors: Competitor[];
  competitiveAdvantages: string[];
}

export const auditRequestSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type AuditRequest = z.infer<typeof auditRequestSchema>;
