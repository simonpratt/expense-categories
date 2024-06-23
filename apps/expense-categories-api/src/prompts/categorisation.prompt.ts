import environment from "../core/environment";

export const generateTransactionSearchPrompt = (
  transactions: string[],
  categories: { name: string; description: string | null }[],
  targetCategory: { name: string; description: string | null },
) => {
  return `You will be analyzing a list of bank transactions to identify which ones best fit a specific spending category, taking into account a fixed geographic location for all transactions. You will also assign a confidence level to each match. Here's how to proceed:

First, note the geographic location that applies to all transactions:
<geographic_context>
${environment.GEOGRAPHIC_LOCATION_STRING}
</geographic_context>

Next, review the list of transactions:
<transactions>
${transactions.join('\n')}
</transactions>

Next, familiarize yourself with the available spending categories and their descriptions:
<categories>
${JSON.stringify(categories.map((c) => ({ name: c.name, description: c.description })))}
</categories>

The category we're focusing on is:
<target_category>
${JSON.stringify({ name: targetCategory.name, description: targetCategory.description })}
</target_category>

Your task is to go through each transaction and determine if it belongs to the target category. For each transaction that you believe fits the category, you should also assign a confidence level (low, medium, or high).

When analyzing each transaction:
1. Look at the transaction description.
2. Consider the provided geographic context and how it might influence spending patterns or merchant names in this category.
3. Consider if the transaction could reasonably belong to the target category.
4. If you believe it does, determine your confidence level in this classification.

To determine confidence levels:
- High: You are very certain the transaction belongs to the target category.
- Medium: The transaction likely belongs to the target category, but there's some uncertainty.
- Low: The transaction might belong to the target category, but you're not very sure.

Provide your output in JSON format as follows:
<output>
[
  {
    "description": "TRANSACTION_DESCRIPTION",
    "confidence": "CONFIDENCE_LEVEL"
  },
  ...
]
</output>

Include only the transactions you believe belong to the target category. The "transactions" array should be ordered from highest to lowest confidence.`;
};

export const generateAutoCategorisationPrompt = (
  transactions: string[],
  categories: { name: string; description: string | null }[],
) => {
  return `You will be analyzing a list of bank transactions to identify which ones best fit a specific spending category, taking into account a fixed geographic location for all transactions. You will also assign a confidence level to each match. Here's how to proceed:

First, note the geographic location that applies to all transactions:
<geographic_context>
${environment.GEOGRAPHIC_LOCATION_STRING}
</geographic_context>

Next, review the list of transactions:
<transactions>
${transactions.join('\n')}
</transactions>

Next, familiarize yourself with the available spending categories:
<categories>
${JSON.stringify(categories.map((c) => ({ name: c.name, description: c.description })))}
</categories>

Your task is to go through each transaction and determine which category is the best fit for it. For each transaction you should also assign a confidence level (low, medium, or high).

When analyzing each transaction:
1. Look at the transaction description.
2. Consider the provided geographic context and how it might influence spending patterns or merchant names for each category. 
3. Consider if the transaction could reasonably belong to each category.
4. For the category you decide is the best match, determine your confidence level in this classification.

To determine confidence levels:
- High: You are very certain the transaction belongs to the target category.
- Medium: The transaction likely belongs to the target category, but there's some uncertainty.
- Low: The transaction might belong to the target category, but you're not very sure.

Provide your output in JSON format as follows:
<output>
[
  {
    "description": "TRANSACTION_DESCRIPTION",
    "category": "CATEGORY_NAME",
    "confidence": "CONFIDENCE_LEVEL"
  },
  ...
]
</output>

Include all transactions. The "transactions" array should be ordered in alphabetical order based on the category name.`;
};
