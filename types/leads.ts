export interface BaseLead {
  id: string;
  company: string;
  leadScore: number;
  createdAt: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
}

export interface WarmLead extends BaseLead {
  strategy: string;
  salePitch: string;
  lastContact: string;
  assignedTo: string;
}

export interface ColdLead extends BaseLead {
  email: string;
  personalized: boolean;
  outreachStage: string;
  lastOutreach: string | null;
}

export type LeadType = "warm" | "cold";
