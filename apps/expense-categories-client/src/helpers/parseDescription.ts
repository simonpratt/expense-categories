const rules = [
  {
    match: / - Internal Transfer - Receipt.*/,
    func: (val: string) =>
      `Transfer to ${val.replace(/.* - Receipt \d+ /, '')} - ${val.replace(/ - Internal Transfer - Receipt.*/, '')}`
        .trim()
        .toLowerCase(),
  },
  {
    match: / - Visa.*/,
    func: (val: string) =>
      val
        .replace(/ - Visa.*/, '')
        .trim()
        .toLowerCase(),
  },
  {
    match: / - EFTPOS.*/,
    func: (val: string) =>
      val
        .replace(/ - EFTPOS.*/, '')
        .trim()
        .toLowerCase(),
  },

  {
    match: / - Osko.*/,
    func: (val: string) =>
      val
        .replace(/ - Osko.*/, '')
        .trim()
        .toLowerCase(),
  },
  {
    match: / - Receipt.*/,
    func: (val: string) =>
      val
        .replace(/ - Receipt.*/, '')
        .trim()
        .toLowerCase(),
  },
];

export const parseDescription = (description: string): string => {
  for (let i = 0; i < rules.length; i++) {
    if (rules[i].match.test(description)) {
      return rules[i].func(description);
    }
  }

  return description.trim().toLowerCase();
};
