import React, { useContext, useEffect, useMemo, useState } from 'react';

import { DateTime } from 'luxon';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'styled-components';

import { apiConnector } from '../../core/api.connector';
import { colorMapping } from '../../core/colorMapping';
import DateRangeContext, { getDateQueryEnabled, getDateQueryParams } from '../core/DateRangeContext';
import TransactionTable from './TransactionTable';

const StackedAreaChart: React.FC = () => {
  const dateContextVal = useContext(DateRangeContext);
  const { data: transactions } = apiConnector.app.transactions.getTransactions.useQuery(
    getDateQueryParams(dateContextVal),
    { enabled: getDateQueryEnabled(dateContextVal) },
  );
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const theme: any = useTheme();

  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with all categories visible
    if (categories) {
      const allCategories = [...categories.map((cat) => cat.name), 'Uncategorized'];
      setVisibleCategories(allCategories);
    }
  }, [categories, setVisibleCategories]);

  const chartData = useMemo(() => {
    if (!transactions || !categories) return [];

    const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

    const fortnightlyData = transactions.reduce<Record<string, { date: string } & Record<string, number>>>(
      (acc, transaction) => {
        const date = DateTime.fromISO(transaction.date);
        const fortnightStart = date.startOf('week').plus({ weeks: date.weekday <= 7 ? 0 : 1 });
        const fortnightKey = fortnightStart.toISODate();

        if (!fortnightKey) {
          return acc;
        }

        if (!acc[fortnightKey]) {
          acc[fortnightKey] = { date: fortnightKey } as any;
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
      },
      {},
    );

    return Object.values(fortnightlyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, categories]);

  const getCategoryColor = (categoryName: string) => {
    const category = categories?.find((cat) => cat.name === categoryName);
    return category ? colorMapping[category.colour] || colorMapping.grey : colorMapping.grey;
  };

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    setVisibleCategories((prevVisible) => {
      let newVisible: string[];
      const allCategories = [...(categories || []).map((cat) => cat.name), 'Uncategorized'];

      if (!allCategories.find((cat) => !prevVisible.includes(cat))) {
        // All checked
        newVisible = [dataKey];
      } else if (prevVisible.includes(dataKey)) {
        // If clicked category is visible, hide it
        newVisible = prevVisible.filter((cat) => cat !== dataKey);
      } else {
        // If clicked category is hidden, show it
        newVisible = [...prevVisible, dataKey];
      }

      // If all categories become hidden, show all categories
      if (newVisible.length === 0) {
        newVisible = [...(categories || []).map((cat) => cat.name), 'Uncategorized'];
      }

      return newVisible;
    });
  };

  if (!chartData.length) return <div>No data available for the selected date range.</div>;

  return (
    <>
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
              <span style={{ color: !visibleCategories.includes(entry.dataKey) ? '#999' : theme.colours.defaultFont }}>
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
                hide={!visibleCategories.includes(category.name)}
              />
            ))}
          <Area
            type='monotone'
            dataKey='Uncategorized'
            stackId='1'
            stroke={colorMapping.grey}
            fill={colorMapping.grey}
            hide={!visibleCategories.includes('Uncategorized')}
          />
        </AreaChart>
      </ResponsiveContainer>
      {transactions?.length && categories?.length && (
        <TransactionTable transactions={transactions} categories={categories} visibleCategories={visibleCategories} />
      )}
    </>
  );
};

export default StackedAreaChart;
