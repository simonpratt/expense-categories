import { createContext } from 'react';

import { DateTime } from 'luxon';

export interface DateRangeContextProps {
  startDate?: string;
  endDate?: string;
  setStart: (start: string) => void;
  setEnd: (end: string) => void;
}

const DateRangeContext = createContext<DateRangeContextProps>({
  startDate: undefined,
  endDate: undefined,
  setStart: () => {},
  setEnd: () => {},
});

export const getDateQueryParams = (contextVal: { startDate?: string; endDate?: string }) => ({
  startDate: DateTime.fromISO(contextVal.startDate || '1970-01-01').toJSDate(),
  endDate: DateTime.fromISO(contextVal.endDate || '2040-01-01').toJSDate(),
});

export const getDateQueryEnabled = (contextVal: { startDate?: string; endDate?: string }) =>
  !!contextVal.startDate && !!contextVal.endDate;

export default DateRangeContext;
