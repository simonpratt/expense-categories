import { CenteredLayout, Loader } from '@dtdot/lego';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { DataRow, ProcessedDataRow } from '../../types/DataRow';

dayjs.extend(customParseFormat);

const tempRegexArr = [/ - Visa.*/, / - EFTPOS.*/, / - Receipt.*/];

const processData = (data: DataRow[]): ProcessedDataRow[] => {
  const processed = data.map((row, index) => ({
    ...row,
    id: `${index}`,
    amount: Math.ceil((row.amount as any) * -1),
    description: processDataDescription(row.description),
  }));

  const counts: Record<string, number> = {};
  const totalAmount: Record<string, number> = {};
  processed.forEach((row) => {
    if (counts[row.description]) {
      counts[row.description]++;
    } else {
      counts[row.description] = 1;
    }

    if (totalAmount[row.description]) {
      totalAmount[row.description] += row.amount;
    } else {
      totalAmount[row.description] = row.amount;
    }
  });

  return processed.map((row) => ({
    ...row,
    date: dayjs(row.date, 'DD-MM-YYYY').toDate(),
    count: counts[row.description],
    totalAmount: totalAmount[row.description],
  }));
};

const processDataDescription = (description: string): string => {
  for (let i = 0; i < tempRegexArr.length; i++) {
    if (tempRegexArr[i].test(description)) {
      return description.replace(tempRegexArr[i], '').trim().toLowerCase();
    }
  }

  return description;
};

export interface PostProcessProps {
  data: DataRow[];
  onPostProcessed: (data: ProcessedDataRow[]) => void;
}

const PostProcess = ({ data, onPostProcessed }: PostProcessProps) => {
  useEffect(() => {
    const processed = processData(data);
    onPostProcessed(processed);
  }, [data, onPostProcessed]);

  return (
    <CenteredLayout>
      <Loader />
    </CenteredLayout>
  );
};

export default PostProcess;
