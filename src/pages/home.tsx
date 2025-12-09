import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, Search, Loader2, FileText, TrendingUp, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { auditRequestSchema, type AuditRequest, type AuditReport } from "@shared/schema";
import { AuditReportView } from "@/components/audit-report";

export default function Home() {
  const [report, setReport] = useState<AuditReport | null>(null);

  const form = useForm<AuditRequest>({
    resolver: zodResolver(auditRequestSchema),
    defaultValues: {
      url: "",
    },
  });

  const auditMutation = useMutation({
    mutationFn: async (data: AuditRequest) => {
      const response = await apiRequest("POST", "/api/audit", data);
      return response.json() as Promise<AuditReport>;
    },
    onSuccess: (data) => {
      setReport(data);
      setTimeout(() => {
        document.getElementById("audit-report")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
  });

  const onSubmit = (data: AuditRequest) => {
    auditMutation.mutate(data);
  };

  const features = [
    {
      icon: FileText,
      title: "14-Section Analysis",
      description: "Comprehensive audit covering all aspects of your digital presence",
    },
    {
      icon: TrendingUp,
      title: "Actionable Insights",
      description: "Specific recommendations with impact ratings and implementation steps",
    },
    {
      icon: Shield,
      title: "Trust & Credibility",
      description: "Evaluate your trust signals and credibility factors",
    },
    {
      icon: Zap,
      title: "AI-Powered",
      description: "Intelligent analysis using advanced AI for accurate assessments",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">Website Audit Pro</h1>
              <p className="text-xs text-muted-foreground">Professional Business Analysis</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.print()} data-testid="button-print">
            <FileText className="w-4 h-4 mr-2" />
            Print Report
          </Button>
        </div>
      </header>

      {!report && (
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Professional Website Audit
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Get a comprehensive, AI-powered analysis of any website. Receive actionable insights, 
                competitive intelligence, and specific recommendations to improve your digital presence.
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                              <Input
                                {...field}
                                placeholder="Enter website URL (e.g., https://example.com)"
                                className="pl-12 h-14 text-lg"
                                disabled={auditMutation.isPending}
                                data-testid="input-url"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-14 text-lg font-semibold"
                      disabled={auditMutation.isPending}
                      data-testid="button-generate-audit"
                    >
                      {auditMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing Website...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5 mr-2" />
                          Generate Audit Report
                        </>
                      )}
                    </Button>
                  </form>
                </Form>

                {auditMutation.isPending && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-sm font-medium">Analysis in Progress</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Our AI is analyzing the website content, structure, SEO, and more. 
                      This comprehensive audit typically takes 30-60 seconds.
                    </p>
                  </div>
                )}

                {auditMutation.isError && (
                  <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive font-medium">
                      Failed to generate audit. Please check the URL and try again.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {auditMutation.error?.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-left">
                  <CardContent className="p-5">
                    <feature.icon className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {report && (
        <div id="audit-report">
          <AuditReportView report={report} onNewAudit={() => setReport(null)} />
        </div>
      )}

      {!report && (
        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              Website Audit Pro - Professional Business & Website Analysis Tool
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
