export interface DataRow {
  date: string;
  description: string;
  amount: string;
}

export interface ProcessedDataRow {
  id: string;
  date: string;
  description: string;
  amount: number;
  count: number;
}
