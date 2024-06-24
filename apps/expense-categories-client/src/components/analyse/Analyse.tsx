import React, { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiConnector } from '../../core/api.connector';
import { useTheme } from 'styled-components';
import { colorMapping } from '../../core/colorMapping';

interface AnalyseProps {
  startDate: string;
  endDate?: string;
}

const StackedAreaChart: React.FC<AnalyseProps> = ({ startDate, endDate }) => {
  const { data: transactions } = apiConnector.app.transactions.getTransactions.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const theme: any = useTheme();

  const [hiddenCategories, setHiddenCategories] = useState<string[]>([]);

  const chartData = useMemo(() => {
    if (!transactions || !categories) return [];

    const start = DateTime.fromISO(startDate);
    const end = endDate ? DateTime.fromISO(endDate) : DateTime.now();

    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = DateTime.fromISO(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });

    const fortnightlyData = filteredTransactions.reduce<Record<string, Record<string, number>>>((acc, transaction) => {
      const date = DateTime.fromISO(transaction.date);
      const fortnightStart = date.startOf('week').plus({ weeks: date.weekday <= 7 ? 0 : 1 });
      const fortnightKey = fortnightStart.toISODate();

      if (!fortnightKey) {
        return acc;
      }

      if (!acc[fortnightKey]) {
        acc[fortnightKey] = { date: fortnightKey };
        categories.forEach((cat) => {
          acc[fortnightKey][cat.name] = 0;
        });
        acc[fortnightKey]['Uncategorized'] = 0;
      }

      const category = transaction.spendingCategoryId
        ? categoryMap.get(transaction.spendingCategoryId) || 'Uncategorized'
        : 'Uncategorized';
      acc[fortnightKey][category] = (acc[fortnightKey][category] || 0) + (transaction.debit || 0);

      return acc;
    }, {});

    return Object.values(fortnightlyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, categories, startDate, endDate]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories?.find((cat) => cat.name === categoryName);
    return category ? colorMapping[category.colour] || colorMapping.grey : colorMapping.grey;
  };

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    setHiddenCategories((prevHidden) => {
      const categoryNames = [...(categories || []).map((cat) => cat.name), 'Uncategorized'];
      // Check for first click, hide everything else
      if (!prevHidden.length) {
        return categoryNames.filter((cat) => cat !== dataKey);
      }

      const newHidden = prevHidden.includes(dataKey)
        ? prevHidden.filter((cat) => cat !== dataKey)
        : [...prevHidden, dataKey];

      // Check for everything hidden => show everything again
      if (categoryNames.every((name) => newHidden.includes(name))) {
        return [];
      }

      return newHidden;
    });
  };

  if (!chartData.length) return <div>No data available for the selected date range.</div>;

  return (
    <ResponsiveContainer width='100%' height={400}>
      <AreaChart data={chartData}>
        <XAxis
          dataKey='date'
          tickFormatter={(date) => DateTime.fromISO(date).toFormat('MMM dd')}
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
        <Legend
          wrapperStyle={{ color: theme.colours.defaultFont }}
          onClick={handleLegendClick}
          formatter={(value, entry) => (
            <span style={{ color: hiddenCategories.includes(entry.dataKey) ? '#999' : theme.colours.defaultFont }}>
              {value}
            </span>
          )}
        />
        {categories &&
          categories.map((category) => (
            <Area
              key={category.id}
              type='monotone'
              dataKey={category.name}
              stackId='1'
              stroke={getCategoryColor(category.name)}
              fill={getCategoryColor(category.name)}
              hide={hiddenCategories.includes(category.name)}
            />
          ))}
        <Area
          type='monotone'
          dataKey='Uncategorized'
          stackId='1'
          stroke={colorMapping.grey}
          fill={colorMapping.grey}
          hide={hiddenCategories.includes('Uncategorized')}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StackedAreaChart;
