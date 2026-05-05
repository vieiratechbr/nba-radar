export type Conference = "East" | "West";

export interface Team {
  id: string;
  city?: string;
  name: string;
  fullName?: string;
  abbreviation?: string;
  conference?: Conference | string;
  division?: string;
  logoUrl?: string;
  record?: string;
  seed?: number;
  colors?: {
    primary: string;
    secondary: string;
  };
}
