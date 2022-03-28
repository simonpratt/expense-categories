export interface DataRow {
  date: string;
  description: string;
  amount: string;
}

export interface ProcessedDataRow {
  id: string;
  date: Date;
  description: string;
  amount: number;
  count: number;
  totalAmount: number;
}
