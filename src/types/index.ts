// Props types
export interface ProgressItem {
  id: string;
  category: "Triagens" | "Casos";
  title: string;
  progress: number;
}

export interface Indicator {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  percentage: number;
}

export interface IndexPageProps {
  progressItems: ProgressItem[];
  indicators: Indicator[];
}