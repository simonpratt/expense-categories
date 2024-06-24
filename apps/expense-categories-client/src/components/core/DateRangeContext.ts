import { createContext } from 'react';

export interface DateRangeContextProps {
  startDate: string;
  endDate?: string;
  setStart: (start: string) => void;
  setEnd: (end: string) => void;
}

const DateRangeContext = createContext<DateRangeContextProps>({
  startDate: '0',
  endDate: '0',
  setStart: () => {},
  setEnd: () => {},
});

export default DateRangeContext;
