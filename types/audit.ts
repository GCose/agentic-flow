export interface RootObject {
  id: string;
  company_name: string;
  created_at: string;
  delivery: Delivery;
  industry: string;
  insight: Insight;
  normalized_url: string;
  report: Report;
  score: Score;
  solution: Record<string, unknown>;
  summary: Summary;
  updated_at: string;
  website_url: string;
}

export interface Delivery {
  solutions: Record<
    string,
    {
      how: string;
      priority: number;
      what: string;
      why: string;
    }
  >;
}

export interface Insight {
  insights: Record<string, unknown>;
}

export interface Report {
  data: Record<string, unknown>;
  deliverables: Deliverables;
  handoff_message: HandoffMessage;
  report_section: ReportSection;
}

export interface Deliverables {
  deliverables_list: string[];
  loom_video_url: string;
  pdf_report_url: string;
}

export interface HandoffMessage {
  links: Record<string, unknown>;
  message: string;
}

export interface ReportSection {
  audit_scorecard: AuditScorecard[];
  audit_tags: string[];
  call_to_action: string;
  executive_summary: string;
  fixes_and_recommendations: unknown[];
  key_insights: unknown[];
  painful_reality_of_revenue: string;
  path_to_recovery_and_growth: string;
}

export interface AuditScorecard {
  booking_score: BenchmarkScore;
  close_score: BenchmarkScore;
  followup_score: BenchmarkScore;
  lead_score: BenchmarkScore;
  overall_funnel_score: BenchmarkScore;
  response_time_score: BenchmarkScore;
  showup_score: BenchmarkScore;
}

export interface BenchmarkScore {
  benchmark: number;
  name: string;
  score: number;
}

export interface Score {
  scores: Record<string, unknown>;
}

export interface Summary {
  writer_report: WriterReport;
}

export interface WriterReport {
  summary: WriterSummary;
}

export interface WriterSummary {
  intro: string;
  pain_points: string;
  transition: string;
}
