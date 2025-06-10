export interface BaseLead {
  id: string;
  company: string;
  leadScore: number;
  createdAt: string;
  industry: string;
  leadEntry: string;
  salesCall: string;
}

export interface WarmLead extends BaseLead {
  strategy: string;
  salePitch: string;
}

export interface ColdLead extends BaseLead {
  email: string;
  personalized: boolean;
  outreachStage: string;
  lastOutreach: string | null;
}

export type LeadType = "warm" | "cold" | "appointment" | "audit";
