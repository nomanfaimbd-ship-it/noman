
export type PillColor = 'green' | 'yellow' | 'red';

export interface ClassificationResult {
  roleLine?: string;
  industryLine?: string;
  finalText: string;
  rolePillColor: PillColor;
  industryPillColor: PillColor;
  finalPillColor: PillColor;
  roleValue?: string;
  matchedIndustryKeywords?: string[];
}
