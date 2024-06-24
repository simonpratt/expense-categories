import React, { useEffect, useContext } from 'react';
import { Select } from '@dtdot/lego';
import { DateTime } from 'luxon';
import DateRangeContext from './DateRangeContext';
import styled from 'styled-components';

const StyledSelect = styled(Select)`
  width: 160px;
`;

const timeOptions = [
  { value: '14days', label: '14 Days' },
  { value: '30days', label: '30 Days' },
  { value: '3months', label: '3 Months' },
  { value: '6months', label: '6 Months' },
  { value: '1year', label: '1 Year' },
  { value: '2years', label: '2 Years' },
];

const DateRangeSelect: React.FC = () => {
  const { setStart, setEnd } = useContext(DateRangeContext);
  const [selectedOption, setSelectedOption] = React.useState('30days');

  const handleTimeChange = (value: string) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    const now = DateTime.now();
    let start;

    switch (selectedOption) {
      case '14days':
        start = now.minus({ days: 13 }).startOf('day');
        break;
      case '30days':
        start = now.minus({ days: 29 }).startOf('day');
        break;
      case '3months':
        start = now.minus({ months: 3 }).startOf('day');
        break;
      case '6months':
        start = now.minus({ months: 6 }).startOf('day');
        break;
      case '1year':
        start = now.minus({ years: 1 }).startOf('day');
        break;
      case '2years':
        start = now.minus({ years: 2 }).startOf('day');
        break;
      default:
        start = now.minus({ days: 29 }).startOf('day');
    }

    const end = now.endOf('day');

    setStart(start.toISO());
    setEnd(end.toISO());
  }, [selectedOption, setStart, setEnd]);

  return (
    <StyledSelect
      name='timePicker'
      placeholder='Select time range'
      value={selectedOption}
      onChange={handleTimeChange}
      options={timeOptions}
      data-testid='time-picker'
    />
  );
};

export default DateRangeSelect;
