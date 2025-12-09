import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import Groq from "groq-sdk";
import type { AuditReport } from "@shared/schema";

// Multi-provider AI support - auto-detects provider from API key format
type AIProvider = "openai" | "groq";

interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

function detectAIConfig(): AIConfig {
  // Check for provider-specific keys first
  if (process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile"
    };
  }
  
  if (process.env.OPENAI_API_KEY) {
    const key = process.env.OPENAI_API_KEY;
    // Auto-detect Groq key format even if stored in OPENAI_API_KEY
    if (key.startsWith("gsk_")) {
      return {
        provider: "groq",
        apiKey: key,
        model: "llama-3.3-70b-versatile"
      };
    }
    return {
      provider: "openai",
      apiKey: key,
      model: "gpt-4o" // Using gpt-4o as it's widely available
    };
  }
  
  throw new Error("No AI API key configured. Please set OPENAI_API_KEY or GROQ_API_KEY in your environment.");
}

// Lazy-initialized clients
let openaiClient: OpenAI | null = null;
let groqClient: Groq | null = null;

function getOpenAI(apiKey: string): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

function getGroq(apiKey: string): Groq {
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

interface ScrapedContent {
  title: string;
  metaDescription: string;
  h1Tags: string[];
  heroText: string;
  menuItems: string[];
  ctaButtons: string[];
  hasContactForm: boolean;
  hasLiveChat: boolean;
  phoneNumbers: string[];
  emails: string[];
  addresses: string[];
  socialLinks: { platform: string; url: string }[];
  testimonials: number;
  hasAboutPage: boolean;
  hasServicesPage: boolean;
  hasBlog: boolean;
  hasPrivacyPolicy: boolean;
  hasTermsOfService: boolean;
  bodyText: string;
  imageCount: number;
  hasHttps: boolean;
  url: string;
}

async function scrapeWebsite(url: string): Promise<ScrapedContent> {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Extract title
    const title = $("title").text().trim() || "";

    // Extract meta description
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // Extract H1 tags
    const h1Tags: string[] = [];
    $("h1").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Tags.push(text);
    });

    // Extract hero text (first prominent heading or large text)
    const heroText = h1Tags[0] || $("h2").first().text().trim() || "";

    // Extract menu items
    const menuItems: string[] = [];
    $("nav a, header a, .nav a, .menu a, .navbar a").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 50 && !text.includes("http")) {
        menuItems.push(text);
      }
    });

    // Extract CTA buttons
    const ctaButtons: string[] = [];
    $("button, .btn, [class*='cta'], [class*='button'], a[class*='btn']").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 50) {
        ctaButtons.push(text);
      }
    });

    // Check for contact form
    const hasContactForm = $("form").length > 0 || $("[id*='contact']").length > 0 || $("[class*='contact']").length > 0;

    // Check for live chat
    const hasLiveChat = 
      $("[class*='chat']").length > 0 || 
      $("[id*='chat']").length > 0 ||
      response.data.includes("intercom") ||
      response.data.includes("drift") ||
      response.data.includes("zendesk") ||
      response.data.includes("tawk") ||
      response.data.includes("crisp") ||
      response.data.includes("livechat");

    // Extract phone numbers
    const phoneRegex = /[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/g;
    const phoneNumbers = (response.data.match(phoneRegex) || [])
      .filter((p: string) => p.length >= 10)
      .slice(0, 5);

    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = (response.data.match(emailRegex) || []).slice(0, 5);

    // Extract addresses (basic detection)
    const addresses: string[] = [];
    $("[class*='address'], [id*='address'], address").each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) addresses.push(text);
    });

    // Extract social links
    const socialLinks: { platform: string; url: string }[] = [];
    const socialPatterns = [
      { platform: "LinkedIn", pattern: /linkedin\.com/i },
      { platform: "Facebook", pattern: /facebook\.com/i },
      { platform: "Twitter", pattern: /twitter\.com|x\.com/i },
      { platform: "Instagram", pattern: /instagram\.com/i },
      { platform: "YouTube", pattern: /youtube\.com/i },
    ];
    
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href") || "";
      for (const { platform, pattern } of socialPatterns) {
        if (pattern.test(href) && !socialLinks.some(s => s.platform === platform)) {
          socialLinks.push({ platform, url: href });
        }
      }
    });

    // Count testimonials
    let testimonials = 0;
    $("[class*='testimonial'], [class*='review'], [class*='quote'], blockquote").each(() => {
      testimonials++;
    });

    // Check for common pages
    const hasAboutPage = $("a[href*='about']").length > 0;
    const hasServicesPage = $("a[href*='service'], a[href*='product']").length > 0;
    const hasBlog = $("a[href*='blog'], a[href*='news'], a[href*='article']").length > 0;
    const hasPrivacyPolicy = $("a[href*='privacy']").length > 0;
    const hasTermsOfService = $("a[href*='terms'], a[href*='tos']").length > 0;

    // Get body text (limited)
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 5000);

    // Count images
    const imageCount = $("img").length;

    return {
      title,
      metaDescription,
      h1Tags,
      heroText,
      menuItems: [...new Set(menuItems)].slice(0, 15),
      ctaButtons: [...new Set(ctaButtons)].slice(0, 10),
      hasContactForm,
      hasLiveChat,
      phoneNumbers,
      emails,
      addresses,
      socialLinks,
      testimonials,
      hasAboutPage,
      hasServicesPage,
      hasBlog,
      hasPrivacyPolicy,
      hasTermsOfService,
      bodyText,
      imageCount,
      hasHttps: url.startsWith("https"),
      url,
    };
  } catch (error: any) {
    throw new Error(`Failed to scrape website: ${error.message}`);
  }
}

async function generateAuditWithAI(scrapedContent: ScrapedContent): Promise<AuditReport> {
  const prompt = `You are a senior business analyst and digital marketing consultant. Analyze this website data and generate a comprehensive professional audit report.

Website URL: ${scrapedContent.url}
Page Title: ${scrapedContent.title}
Meta Description: ${scrapedContent.metaDescription}
H1 Tags: ${scrapedContent.h1Tags.join(", ")}
Hero Text: ${scrapedContent.heroText}
Menu Items: ${scrapedContent.menuItems.join(", ")}
CTA Buttons: ${scrapedContent.ctaButtons.join(", ")}
Has Contact Form: ${scrapedContent.hasContactForm}
Has Live Chat: ${scrapedContent.hasLiveChat}
Phone Numbers Found: ${scrapedContent.phoneNumbers.join(", ")}
Emails Found: ${scrapedContent.emails.join(", ")}
Social Links: ${scrapedContent.socialLinks.map(s => s.platform).join(", ")}
Testimonials Count: ${scrapedContent.testimonials}
Has About Page: ${scrapedContent.hasAboutPage}
Has Services Page: ${scrapedContent.hasServicesPage}
Has Blog: ${scrapedContent.hasBlog}
Has Privacy Policy: ${scrapedContent.hasPrivacyPolicy}
Has Terms of Service: ${scrapedContent.hasTermsOfService}
Image Count: ${scrapedContent.imageCount}
Has HTTPS: ${scrapedContent.hasHttps}

Body Content Sample (first 3000 chars):
${scrapedContent.bodyText.slice(0, 3000)}

Generate a complete audit report with realistic, professional analysis based on this data. Return a JSON object with this exact structure:

{
  "id": "unique-id",
  "url": "the website URL",
  "companyName": "extracted or inferred company name",
  "industry": "identified industry/niche",
  "auditDate": "today's date in format Month DD, YYYY",
  "overallScore": number between 40-95,
  "scoreBreakdown": {
    "technical": number 1-10,
    "design": number 1-10,
    "content": number 1-10,
    "seo": number 1-10,
    "conversion": number 1-10,
    "mobile": number 1-10,
    "trust": number 1-10,
    "clarity": number 1-10
  },
  "keyFindings": ["3-5 critical findings with specific evidence"],
  "priorityActions": ["3 immediate actions to take"],
  "companyProfile": {
    "legalName": "company name",
    "founded": "year or 'Not disclosed'",
    "locations": ["addresses found or 'Not disclosed'"],
    "serviceArea": "geographic area served",
    "teamSize": "if mentioned or 'Not disclosed'"
  },
  "businessModel": {
    "revenueStreams": ["identified revenue sources"],
    "pricingStrategy": "Transparent/Hidden/By Quote",
    "targetMarket": "B2B/B2C/Both with evidence",
    "customerSegments": ["identified segments"]
  },
  "valueProposition": {
    "mainPromise": "their main headline or tagline",
    "differentiationClaims": ["what makes them unique"],
    "competitiveAdvantages": ["stated advantages"],
    "gapAnalysis": ["what's missing or unclear"]
  },
  "onlinePresence": {
    "websiteTechnology": "detected platform/technology",
    "socialMedia": [{"platform": "name", "url": "url", "status": "Active/Inactive/Not found"}],
    "businessListings": ["found directories"],
    "recentNews": ["any mentions found"]
  },
  "technicalPerformance": {
    "https": boolean,
    "mobileResponsive": boolean (assume true for modern sites),
    "pageLoadAssessment": "Fast/Moderate/Slow based on content",
    "brokenLinks": ["any found"],
    "browserCompatibility": "Modern/Outdated"
  },
  "siteStructure": {
    "navigationClarity": number 1-10,
    "menuItems": ["actual menu items"],
    "userJourney": "assessment of user flow",
    "contactAccessibility": "how easy to find contact info"
  },
  "seoElements": {
    "pageTitle": "actual title",
    "metaDescription": "actual meta or 'Missing'",
    "h1Tags": ["actual H1s"],
    "altTextUsage": "Present/Sparse/Missing",
    "urlStructure": "Clean/Messy",
    "sitemap": boolean,
    "robotsTxt": boolean,
    "schemaMarkup": boolean,
    "pageSpeedIndicators": ["observations"]
  },
  "homepageAnalysis": {
    "firstImpression": "description of design and messaging",
    "heroSection": "actual hero headline",
    "primaryCTA": "main call-to-action text",
    "valueCommunication": "how quickly visitors understand the business",
    "trustSignals": ["visible trust elements"]
  },
  "aboutPage": {
    "exists": boolean,
    "quality": number 1-10,
    "description": "brief assessment"
  },
  "servicesPage": {
    "exists": boolean,
    "quality": number 1-10,
    "description": "brief assessment",
    "services": ["listed services if found"]
  },
  "contactPage": {
    "phone": "found number or 'Missing'",
    "email": "found email or 'Missing'",
    "contactForm": boolean,
    "liveChat": boolean,
    "address": "found address or 'Not shown'",
    "responseTimePromise": "if stated or 'Not stated'"
  },
  "contentQuality": {
    "writingQuality": "Professional/Adequate/Poor",
    "grammarSpelling": "Clean/Issues noted",
    "contentDepth": "Comprehensive/Surface-level",
    "industryAuthority": "Demonstrated/Lacking",
    "contentFreshness": "assessment",
    "blog": {
      "status": "Active/Inactive/Missing",
      "latestPost": "date or N/A",
      "frequency": "assessment"
    }
  },
  "visualDesign": {
    "designEra": "Modern 2024-25/Dated/Outdated",
    "brandConsistency": "Strong/Weak",
    "colorScheme": "description",
    "typography": "Professional/Basic/Poor",
    "imageryQuality": "High-quality/Stock/Low-quality",
    "whiteSpaceUsage": "Balanced/Cluttered/Sparse",
    "visualHierarchy": "Clear/Confusing"
  },
  "ctaAnalysis": {
    "visibility": number 1-10,
    "clarity": "Clear/Vague",
    "primaryCTAs": ["actual CTA texts found"],
    "placement": "Strategic/Random/Missing"
  },
  "leadGeneration": {
    "contactForms": "description of forms",
    "phoneProminence": "Visible/Hidden",
    "emailSignup": boolean,
    "leadMagnets": ["any offers found"],
    "frictionPoints": ["barriers to conversion"]
  },
  "trustCredibility": {
    "testimonials": {"present": boolean, "count": number},
    "caseStudies": {"present": boolean, "count": number},
    "clientLogos": boolean,
    "awards": ["any shown"],
    "mediasMentions": boolean,
    "professionalAssociations": boolean,
    "guarantees": boolean,
    "securityBadges": boolean,
    "privacyPolicy": boolean,
    "termsOfService": boolean,
    "googleReviews": null or {"rating": number, "count": number},
    "thirdPartyReviews": ["platforms found"]
  },
  "keywordStrategy": {
    "primaryKeywords": ["identified target keywords"],
    "keywordImplementation": "Natural/Over-optimized/Under-optimized",
    "localSEO": "Optimized/Neglected",
    "napConsistency": boolean,
    "locationKeywords": boolean
  },
  "contentMarketing": {
    "blogStatus": "Active/Inactive/Missing",
    "contentTypes": ["types found"],
    "educationalValue": "High/Medium/Low",
    "thoughtLeadership": "Demonstrated/Lacking"
  },
  "marketPosition": {
    "positioningStatement": "how they position themselves",
    "competitiveDifferentiation": "what makes them unique",
    "marketGaps": ["opportunities not addressed"]
  },
  "industryComparison": {
    "websiteSophistication": "Ahead/On Par/Behind",
    "featureCompleteness": ["missing features"],
    "pricePositioning": "Premium/Mid-range/Budget/Unknown"
  },
  "mobileExperience": {
    "issues": ["mobile-specific problems"],
    "touchTargets": "Adequate/Too small",
    "navigation": "Easy/Difficult",
    "pageSpeed": "Fast/Moderate/Slow",
    "ctaVisibility": "Visible/Hidden"
  },
  "highPriorityIssues": [{"description": "issue", "impact": "business impact"}],
  "mediumPriorityIssues": [{"description": "issue", "impact": "impact"}],
  "lowPriorityIssues": [{"description": "issue", "impact": "impact"}],
  "recommendations": [
    {
      "title": "specific actionable title",
      "impact": "High/Medium/Low",
      "effort": "High/Medium/Low",
      "priority": number 1-10,
      "why": "explanation with evidence",
      "how": ["step 1", "step 2", "step 3"],
      "expectedOutcome": "measurable result"
    }
  ],
  "quickWins": [{"title": "opportunity", "expectedLift": "expected result"}],
  "strategicInitiatives": [{"title": "initiative", "expectedLift": "result"}],
  "longTermVision": [{"title": "strategy", "expectedLift": "result"}],
  "competitors": [{"name": "competitor", "url": "url or unknown", "strength": "what they do better"}],
  "competitiveAdvantages": ["areas where this business could outperform"]
}

Generate 6-10 detailed recommendations. Be specific and evidence-based. Make scores realistic - most sites score 50-75.`;

  const config = detectAIConfig();
  let content: string | null = null;

  const systemMessage = "You are a senior business analyst generating professional website audit reports. Always respond with valid JSON only, no markdown formatting or code blocks. Do not wrap your response in code blocks or markdown.";

  if (config.provider === "openai") {
    const client = getOpenAI(config.apiKey);
    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 8192,
    });
    content = response.choices[0].message.content;
  } else if (config.provider === "groq") {
    const client = getGroq(config.apiKey);
    const response = await client.chat.completions.create({
      model: config.model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      max_tokens: 8192,
    });
    content = response.choices[0].message.content;
  }

  if (!content) {
    throw new Error("No response from AI");
  }

  // Clean up response - remove any markdown code blocks if present
  let cleanContent = content.trim();
  if (cleanContent.startsWith("```json")) {
    cleanContent = cleanContent.slice(7);
  } else if (cleanContent.startsWith("```")) {
    cleanContent = cleanContent.slice(3);
  }
  if (cleanContent.endsWith("```")) {
    cleanContent = cleanContent.slice(0, -3);
  }
  cleanContent = cleanContent.trim();

  try {
    const auditData = JSON.parse(cleanContent) as AuditReport;
    auditData.id = `audit-${Date.now()}`;
    auditData.url = scrapedContent.url;
    return auditData;
  } catch (error) {
    console.error("Failed to parse AI response:", cleanContent.substring(0, 500));
    throw new Error("Failed to parse AI response as JSON");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Audit endpoint
  app.post("/api/audit", async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Validate URL format
      let normalizedUrl = url;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        normalizedUrl = `https://${url}`;
      }

      try {
        new URL(normalizedUrl);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }

      // Scrape website
      const scrapedContent = await scrapeWebsite(normalizedUrl);

      // Generate audit with AI
      const auditReport = await generateAuditWithAI(scrapedContent);

      res.json(auditReport);
    } catch (error: any) {
      console.error("Audit error:", error);
      res.status(500).json({ error: error.message || "Failed to generate audit" });
    }
  });

  return httpServer;
}
