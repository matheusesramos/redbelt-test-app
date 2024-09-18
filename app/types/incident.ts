export type Incident = {
  id: number;
  name: string;
  evidence: string;
  criticality: string;
  host: string;
  created_at: Date;
  updated_at: Date;
};