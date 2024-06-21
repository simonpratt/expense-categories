export const generateCategorisationPrompt = (transactions: string[], categories: string[], targetCategory: string) => {
  return `You will be analyzing a list of bank transactions to identify which ones best fit a specific spending category. You will also assign a confidence level to each match. Here's how to proceed:

First, review the list of transactions:
<transactions>
${transactions.join('\n')}
</transactions>

Next, familiarize yourself with the available spending categories:
<categories>
${categories.join('\n')}
</categories>

The category we're focusing on is:
<target_category>
${targetCategory}
</target_category>

Your task is to go through each transaction and determine if it belongs to the target category. For each transaction that you believe fits the category, you should also assign a confidence level (low, medium, or high).

When analyzing each transaction:
1. Look at the transaction description.
2. Consider if the transaction could reasonably belong to the target category.
3. If you believe it does, determine your confidence level in this classification.

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
