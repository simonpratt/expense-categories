export interface Rule {
  id: string;
  text: string;
  ignore: boolean;
  category?: string;
}

export interface RuleWithData extends Rule {
  amount: number;
}
