export interface Rule {
  id: string;
  text: string;
  ignore: boolean;
}

export interface RuleWithData extends Rule {
  amount: number;
}
