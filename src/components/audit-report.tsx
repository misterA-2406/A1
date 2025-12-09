import { 
  Globe, 
  Building2, 
  TrendingUp, 
  Target, 
  Share2,
  Settings,
  Layout,
  Search,
  FileText,
  Palette,
  MousePointer,
  Users,
  BarChart3,
  Trophy,
  Smartphone,
  AlertTriangle,
  Lightbulb,
  Rocket,
  Award,
  CheckCircle2,
  XCircle,
  ArrowUp,
  Printer,
  RefreshCw,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { AuditReport, Recommendation, Issue, GrowthOpportunity } from "@shared/schema";

interface AuditReportViewProps {
  report: AuditReport;
  onNewAudit: () => void;
}

function ScoreCircle({ score, size = "lg" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-400";
    if (s >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (s >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBgColor = (s: number) => {
    if (s >= 80) return "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800";
    if (s >= 60) return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800";
    if (s >= 40) return "bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800";
    return "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800";
  };

  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-5xl",
  };

  return (
    <div className={`${sizeClasses[size]} ${getBgColor(score)} rounded-full flex items-center justify-center border-2`}>
      <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
    </div>
  );
}

function ScoreBar({ label, score, maxScore = 10 }: { label: string; score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold">{score}/{maxScore}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

function SectionHeader({ number, title, icon: Icon }: { number: string; title: string; icon: any }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-border">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Section {number}</span>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}

function CheckItem({ checked, label }: { checked: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
      ) : (
        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
      )}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function ImpactBadge({ impact }: { impact: "High" | "Medium" | "Low" }) {
  const variants: Record<string, string> = {
    High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    Low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[impact]}`}>
      {impact}
    </span>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  return (
    <Card className="overflow-visible">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
              {index + 1}
            </div>
            <h4 className="font-semibold">{rec.title}</h4>
          </div>
          <Badge variant="outline" className="flex-shrink-0">
            Priority {rec.priority}/10
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Impact:</span>
            <ImpactBadge impact={rec.impact} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Effort:</span>
            <ImpactBadge impact={rec.effort} />
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Why: </span>
            <span>{rec.why}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">How: </span>
            <ul className="mt-1 space-y-1 pl-4">
              {rec.how.map((step, i) => (
                <li key={i} className="text-muted-foreground">{i + 1}. {step}</li>
              ))}
            </ul>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <span className="font-medium">Expected Outcome: </span>
            <span className="text-muted-foreground">{rec.expectedOutcome}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function IssueCard({ issue, priority }: { issue: Issue; priority: "High" | "Medium" | "Low" }) {
  const colors = {
    High: "border-l-red-500",
    Medium: "border-l-yellow-500",
    Low: "border-l-blue-500",
  };

  return (
    <div className={`pl-4 border-l-4 ${colors[priority]} py-2`}>
      <p className="font-medium">{issue.description}</p>
      <p className="text-sm text-muted-foreground">{issue.impact}</p>
    </div>
  );
}

function OpportunityCard({ opp }: { opp: GrowthOpportunity }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
      <Rocket className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium">{opp.title}</p>
        <p className="text-sm text-muted-foreground">{opp.expectedLift}</p>
      </div>
    </div>
  );
}

export function AuditReportView({ report, onNewAudit }: AuditReportViewProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 print:py-4 print:space-y-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center gap-4 print:hidden sticky top-[73px] bg-background/95 backdrop-blur-sm py-3 z-40 border-b border-border -mx-4 px-4">
        <Button variant="outline" onClick={onNewAudit} data-testid="button-new-audit">
          <RefreshCw className="w-4 h-4 mr-2" />
          New Audit
        </Button>
        <Button variant="ghost" onClick={() => window.print()} data-testid="button-print-report">
          <Printer className="w-4 h-4 mr-2" />
          Print / Export PDF
        </Button>
      </div>

      {/* Header */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Website Audit Report
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-bold" data-testid="text-company-name">
                    {report.companyName}
                  </h1>
                  <p className="text-lg font-mono text-muted-foreground mt-1" data-testid="text-url">
                    {report.url}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Badge variant="outline">{report.industry}</Badge>
                  <span className="text-muted-foreground">Audit Date: {report.auditDate}</span>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <ScoreCircle score={report.overallScore} />
                <span className="text-sm font-medium mt-2 text-muted-foreground">Overall Score</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 1: Executive Summary */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="1" title="Executive Summary" icon={FileText} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreBar label="Technical" score={report.scoreBreakdown.technical} />
              <ScoreBar label="Design & UX" score={report.scoreBreakdown.design} />
              <ScoreBar label="Content" score={report.scoreBreakdown.content} />
              <ScoreBar label="SEO" score={report.scoreBreakdown.seo} />
              <ScoreBar label="Conversion" score={report.scoreBreakdown.conversion} />
              <ScoreBar label="Mobile" score={report.scoreBreakdown.mobile} />
              <ScoreBar label="Trust" score={report.scoreBreakdown.trust} />
              <ScoreBar label="Clarity" score={report.scoreBreakdown.clarity} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Key Findings
                </h3>
                <ul className="space-y-2">
                  {report.keyFindings.map((finding, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Immediate Priority Actions
                </h3>
                <ul className="space-y-2">
                  {report.priorityActions.map((action, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 2: Business Intelligence */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="2" title="Business Intelligence" icon={Building2} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Company Profile</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Legal Name:</span>
                    <span className="font-medium">{report.companyProfile.legalName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founded:</span>
                    <span className="font-medium">{report.companyProfile.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="font-medium">{report.companyProfile.teamSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Area:</span>
                    <span className="font-medium">{report.companyProfile.serviceArea}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Business Model</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target Market:</span>
                    <span className="font-medium">{report.businessModel.targetMarket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing Strategy:</span>
                    <span className="font-medium">{report.businessModel.pricingStrategy}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue Streams:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {report.businessModel.revenueStreams.map((stream, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{stream}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Value Proposition</h4>
              <blockquote className="border-l-4 border-primary pl-4 py-2 italic text-lg mb-4">
                "{report.valueProposition.mainPromise}"
              </blockquote>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Differentiation Claims:</span>
                  <ul className="mt-1 space-y-1">
                    {report.valueProposition.differentiationClaims.map((claim, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {claim}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Gap Analysis:</span>
                  <ul className="mt-1 space-y-1">
                    {report.valueProposition.gapAnalysis.map((gap, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Online Presence</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Website Technology:</span>
                  <p className="font-medium">{report.onlinePresence.websiteTechnology}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Social Media:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {report.onlinePresence.socialMedia.map((social, i) => (
                      <Badge key={i} variant={social.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {social.platform}: {social.status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Technical Audit */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="3" title="Website Technical Audit" icon={Settings} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Technical Performance</h4>
                <div className="space-y-2">
                  <CheckItem checked={report.technicalPerformance.https} label="HTTPS/SSL Secure" />
                  <CheckItem checked={report.technicalPerformance.mobileResponsive} label="Mobile Responsive" />
                  <div className="text-sm mt-2">
                    <span className="text-muted-foreground">Page Load: </span>
                    <span className="font-medium">{report.technicalPerformance.pageLoadAssessment}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Browser Compatibility: </span>
                    <span className="font-medium">{report.technicalPerformance.browserCompatibility}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Site Structure</h4>
                <ScoreBar label="Navigation Clarity" score={report.siteStructure.navigationClarity} />
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Menu Items:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {report.siteStructure.menuItems.map((item, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Contact Accessibility: </span>
                  <span className="font-medium">{report.siteStructure.contactAccessibility}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">SEO Technical Elements</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Page Title: </span>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{report.seoElements.pageTitle}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Meta Description: </span>
                    <span className="text-xs">{report.seoElements.metaDescription || "Missing"}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">URL Structure: </span>
                    <span className="font-medium">{report.seoElements.urlStructure}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <CheckItem checked={report.seoElements.sitemap} label="Sitemap Present" />
                  <CheckItem checked={report.seoElements.robotsTxt} label="Robots.txt Configured" />
                  <CheckItem checked={report.seoElements.schemaMarkup} label="Schema Markup Implemented" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 4: Content Audit */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="4" title="Content Audit" icon={Layout} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Homepage Analysis</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">First Impression: </span>
                    <span>{report.homepageAnalysis.firstImpression}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Value Communication: </span>
                    <span>{report.homepageAnalysis.valueCommunication}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Hero Section</span>
                    <span className="font-medium">"{report.homepageAnalysis.heroSection}"</span>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <span className="text-xs text-muted-foreground block mb-1">Primary CTA</span>
                    <span className="font-medium text-primary">"{report.homepageAnalysis.primaryCTA}"</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">About Page</span>
                  <Badge variant={report.aboutPage.exists ? "default" : "secondary"}>
                    {report.aboutPage.exists ? "Present" : "Missing"}
                  </Badge>
                </div>
                <ScoreBar label="Quality" score={report.aboutPage.quality} />
                <p className="text-xs text-muted-foreground mt-2">{report.aboutPage.description}</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Services Page</span>
                  <Badge variant={report.servicesPage.exists ? "default" : "secondary"}>
                    {report.servicesPage.exists ? "Present" : "Missing"}
                  </Badge>
                </div>
                <ScoreBar label="Quality" score={report.servicesPage.quality} />
                <p className="text-xs text-muted-foreground mt-2">{report.servicesPage.services.length} services listed</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <span className="font-medium block mb-2">Contact Page</span>
                <div className="space-y-1.5 text-xs">
                  <CheckItem checked={!!report.contactPage.phone} label={`Phone: ${report.contactPage.phone || "Missing"}`} />
                  <CheckItem checked={report.contactPage.contactForm} label="Contact Form" />
                  <CheckItem checked={report.contactPage.liveChat} label="Live Chat" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Content Quality</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Writing Quality:</span>
                    <span className="font-medium">{report.contentQuality.writingQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Content Depth:</span>
                    <span className="font-medium">{report.contentQuality.contentDepth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry Authority:</span>
                    <span className="font-medium">{report.contentQuality.industryAuthority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Content Freshness:</span>
                    <span className="font-medium">{report.contentQuality.contentFreshness}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Visual Design</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Design Era:</span>
                    <span className="font-medium">{report.visualDesign.designEra}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand Consistency:</span>
                    <span className="font-medium">{report.visualDesign.brandConsistency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typography:</span>
                    <span className="font-medium">{report.visualDesign.typography}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Imagery Quality:</span>
                    <span className="font-medium">{report.visualDesign.imageryQuality}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 5: Conversion Optimization */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="5" title="Conversion Optimization Audit" icon={MousePointer} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Calls-to-Action</h4>
                <ScoreBar label="CTA Visibility" score={report.ctaAnalysis.visibility} />
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Clarity: </span>
                  <span className="font-medium">{report.ctaAnalysis.clarity}</span>
                </div>
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground">Placement: </span>
                  <span className="font-medium">{report.ctaAnalysis.placement}</span>
                </div>
                <div className="mt-3">
                  <span className="text-sm text-muted-foreground">Primary CTAs Found:</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {report.ctaAnalysis.primaryCTAs.map((cta, i) => (
                      <Badge key={i} variant="outline" className="text-xs">"{cta}"</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Lead Generation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Forms:</span>
                    <span className="font-medium">{report.leadGeneration.contactForms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone Prominence:</span>
                    <span className="font-medium">{report.leadGeneration.phoneProminence}</span>
                  </div>
                  <CheckItem checked={report.leadGeneration.emailSignup} label="Email Signup Present" />
                </div>
                {report.leadGeneration.frictionPoints.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-muted-foreground">Friction Points:</span>
                    <ul className="mt-1 space-y-1">
                      {report.leadGeneration.frictionPoints.map((point, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Trust & Credibility Signals</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <CheckItem checked={report.trustCredibility.testimonials.present} label={`Testimonials (${report.trustCredibility.testimonials.count})`} />
                <CheckItem checked={report.trustCredibility.caseStudies.present} label={`Case Studies (${report.trustCredibility.caseStudies.count})`} />
                <CheckItem checked={report.trustCredibility.clientLogos} label="Client Logos" />
                <CheckItem checked={report.trustCredibility.mediasMentions} label="Media Mentions" />
                <CheckItem checked={report.trustCredibility.guarantees} label="Guarantees" />
                <CheckItem checked={report.trustCredibility.securityBadges} label="Security Badges" />
                <CheckItem checked={report.trustCredibility.privacyPolicy} label="Privacy Policy" />
                <CheckItem checked={report.trustCredibility.termsOfService} label="Terms of Service" />
              </div>
              {report.trustCredibility.googleReviews && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg inline-flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Google Reviews: </span>
                  <span>{report.trustCredibility.googleReviews.rating} stars ({report.trustCredibility.googleReviews.count} reviews)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 6: SEO & Content Marketing */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="6" title="SEO & Content Marketing Analysis" icon={Search} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Keyword Strategy</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Primary Keywords Targeted:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {report.keywordStrategy.primaryKeywords.map((kw, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{kw}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Implementation: </span>
                    <span className="font-medium">{report.keywordStrategy.keywordImplementation}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Local SEO: </span>
                    <span className="font-medium">{report.keywordStrategy.localSEO}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Content Marketing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blog Status:</span>
                    <span className="font-medium">{report.contentMarketing.blogStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Educational Value:</span>
                    <span className="font-medium">{report.contentMarketing.educationalValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thought Leadership:</span>
                    <span className="font-medium">{report.contentMarketing.thoughtLeadership}</span>
                  </div>
                  {report.contentMarketing.contentTypes.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Content Types:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {report.contentMarketing.contentTypes.map((type, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 7: Competitive Positioning */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="7" title="Competitive Positioning" icon={Trophy} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Market Position</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Positioning Statement:</span>
                    <p className="font-medium mt-1">{report.marketPosition.positioningStatement}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Competitive Differentiation:</span>
                    <p className="font-medium mt-1">{report.marketPosition.competitiveDifferentiation}</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Industry Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website Sophistication:</span>
                    <span className="font-medium">{report.industryComparison.websiteSophistication}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Positioning:</span>
                    <span className="font-medium">{report.industryComparison.pricePositioning}</span>
                  </div>
                </div>
                {report.marketPosition.marketGaps.length > 0 && (
                  <div className="mt-3">
                    <span className="text-sm text-muted-foreground">Market Gaps:</span>
                    <ul className="mt-1 space-y-1">
                      {report.marketPosition.marketGaps.map((gap, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 8: Mobile Experience */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="8" title="Mobile Experience" icon={Smartphone} />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Touch Targets:</span>
                  <span className="font-medium">{report.mobileExperience.touchTargets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Navigation:</span>
                  <span className="font-medium">{report.mobileExperience.navigation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Page Speed:</span>
                  <span className="font-medium">{report.mobileExperience.pageSpeed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CTA Visibility:</span>
                  <span className="font-medium">{report.mobileExperience.ctaVisibility}</span>
                </div>
              </div>
              {report.mobileExperience.issues.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground">Mobile-Specific Issues:</span>
                  <ul className="mt-2 space-y-1">
                    {report.mobileExperience.issues.map((issue, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 9: Critical Issues */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="9" title="Critical Issues" icon={AlertTriangle} />
          </CardHeader>
          <CardContent className="space-y-6">
            {report.highPriorityIssues.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  High Priority Issues (Fix Immediately)
                </h4>
                <div className="space-y-3">
                  {report.highPriorityIssues.map((issue, i) => (
                    <IssueCard key={i} issue={issue} priority="High" />
                  ))}
                </div>
              </div>
            )}
            {report.mediumPriorityIssues.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  Medium Priority Issues
                </h4>
                <div className="space-y-3">
                  {report.mediumPriorityIssues.map((issue, i) => (
                    <IssueCard key={i} issue={issue} priority="Medium" />
                  ))}
                </div>
              </div>
            )}
            {report.lowPriorityIssues.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  Low Priority Issues
                </h4>
                <div className="space-y-3">
                  {report.lowPriorityIssues.map((issue, i) => (
                    <IssueCard key={i} issue={issue} priority="Low" />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Section 10: Actionable Recommendations */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="10" title="Actionable Recommendations" icon={Lightbulb} />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {report.recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 11: Growth Opportunities */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="11" title="Growth Opportunities" icon={TrendingUp} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Quick Wins (1-2 weeks)
                </h4>
                <div className="space-y-2">
                  {report.quickWins.map((opp, i) => (
                    <OpportunityCard key={i} opp={opp} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  Strategic (3-6 months)
                </h4>
                <div className="space-y-2">
                  {report.strategicInitiatives.map((opp, i) => (
                    <OpportunityCard key={i} opp={opp} />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-purple-500" />
                  Long-term (6-12 months)
                </h4>
                <div className="space-y-2">
                  {report.longTermVision.map((opp, i) => (
                    <OpportunityCard key={i} opp={opp} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 12: Competitive Intelligence */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="12" title="Competitive Intelligence" icon={BarChart3} />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Competitor Analysis</h4>
                <div className="space-y-3">
                  {report.competitors.map((comp, i) => (
                    <div key={i} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{comp.name}</span>
                        <Badge variant="outline" className="text-xs">{i + 1}</Badge>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mb-1">{comp.url}</p>
                      <p className="text-sm text-muted-foreground">{comp.strength}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-xs tracking-wide">Your Competitive Advantages</h4>
                <ul className="space-y-2">
                  {report.competitiveAdvantages.map((adv, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {adv}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 13: Final Scoring */}
      <section className="print:break-inside-avoid">
        <Card>
          <CardHeader className="pb-4">
            <SectionHeader number="13" title="Final Scoring Summary" icon={Award} />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex flex-col items-center">
                <ScoreCircle score={report.overallScore} size="lg" />
                <span className="text-lg font-semibold mt-3">Overall Score</span>
                <span className="text-sm text-muted-foreground">out of 100</span>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <ScoreBar label="Technical" score={report.scoreBreakdown.technical} />
                <ScoreBar label="Design & UX" score={report.scoreBreakdown.design} />
                <ScoreBar label="Content" score={report.scoreBreakdown.content} />
                <ScoreBar label="SEO" score={report.scoreBreakdown.seo} />
                <ScoreBar label="Conversion" score={report.scoreBreakdown.conversion} />
                <ScoreBar label="Mobile" score={report.scoreBreakdown.mobile} />
                <ScoreBar label="Trust" score={report.scoreBreakdown.trust} />
                <ScoreBar label="Clarity" score={report.scoreBreakdown.clarity} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground print:py-4">
        <p>This report is based on publicly available information and industry best practices.</p>
        <p className="mt-1">Generated by Website Audit Pro on {report.auditDate}</p>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center print:hidden hover-elevate"
        data-testid="button-back-to-top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
