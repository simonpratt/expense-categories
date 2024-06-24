import React, { useMemo } from 'react';
import { DateTime } from 'luxon';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiConnector } from '../../core/api.connector';
import { useTheme } from 'styled-components';
import { colorMapping } from '../../core/colorMapping';

interface AnalyseProps {
  startDate: string; // ISO date string
  endDate?: string; // Optional ISO date string
}

const Analyse: React.FC<AnalyseProps> = ({ startDate, endDate }) => {
  const { data: transactions } = apiConnector.app.transactions.getTransactions.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!transactions || !categories) return [];

    const start = DateTime.fromISO(startDate);
    const end = endDate ? DateTime.fromISO(endDate) : DateTime.now();

    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = DateTime.fromISO(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });

    const fortnightlyData = filteredTransactions.reduce((acc, transaction) => {
      const date = DateTime.fromISO(transaction.date);
      const fortnightStart = date.startOf('week').plus({ weeks: date.weekday <= 7 ? 0 : 1 });
      const fortnightKey = fortnightStart.toISODate();

      if (!acc[fortnightKey]) {
        acc[fortnightKey] = { date: fortnightKey };
        categories.forEach((cat) => {
          acc[fortnightKey][cat.name] = 0;
        });
        acc[fortnightKey]['Uncategorized'] = 0;
      }

      const category = transaction.spendingCategoryId
        ? categoryMap.get(transaction.spendingCategoryId)
        : 'Uncategorized';
      acc[fortnightKey][category] = (acc[fortnightKey][category] || 0) + (transaction.debit || 0);

      return acc;
    }, {});

    return Object.values(fortnightlyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, categories, startDate, endDate]);

  if (!chartData.length) return <div>No data available for the selected date range.</div>;

  const getCategoryColor = (categoryName: string) => {
    const category = categories?.find((cat) => cat.name === categoryName);
    return category ? colorMapping[category.colour] || colorMapping.grey : colorMapping.grey;
  };

  return (
    <ResponsiveContainer width='100%' height={400}>
      <BarChart data={chartData}>
        <XAxis
          dataKey='date'
          tickFormatter={(date) => DateTime.fromISO(date).toFormat('MMM dd')}
          domain={[startDate, endDate || 'auto']}
          stroke={theme.colours.defaultFont}
          tick={{ fill: theme.colours.defaultFont }}
        />
        <YAxis stroke={theme.colours.defaultFont} tick={{ fill: theme.colours.defaultFont }} />
        <Tooltip
          formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
          labelFormatter={(label) => DateTime.fromISO(label).toFormat('MMM dd, yyyy')}
          contentStyle={{
            backgroundColor: theme.colours.cardBackground,
            border: `1px solid ${theme.colours.defaultBorder}`,
            borderRadius: '4px',
          }}
          itemStyle={{ color: theme.colours.defaultFont }}
          labelStyle={{ color: theme.colours.defaultFont, fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{ color: theme.colours.defaultFont }} />
        {categories &&
          categories.map((category) => (
            <Bar key={category.id} dataKey={category.name} stackId='a' fill={getCategoryColor(category.name)} />
          ))}
        <Bar dataKey='Uncategorized' stackId='a' fill={colorMapping.grey} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Analyse;
