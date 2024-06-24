import React, { useState } from 'react';
import DateRangeContext, { DateRangeContextProps } from './DateRangeContext';

interface DateRangeProviderProps {
  children: React.ReactNode;
}

export const DateRangeProvider: React.FC<DateRangeProviderProps> = ({ children }) => {
  const [startDate, setStartDate] = useState('0');
  const [endDate, setEndDate] = useState('0');

  const dateRangeContextValue: DateRangeContextProps = {
    startDate,
    endDate,
    setStart: setStartDate,
    setEnd: setEndDate,
  };

  return <DateRangeContext.Provider value={dateRangeContextValue}>{children}</DateRangeContext.Provider>;
};

export default DateRangeProvider;
