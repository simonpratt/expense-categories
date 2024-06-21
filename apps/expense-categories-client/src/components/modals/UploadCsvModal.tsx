import React from 'react';
import Papa from 'papaparse';
import { DateTime } from 'luxon';
import { Modal } from '@dtdot/lego';
import { apiConnector } from '../../core/api.connector';
import { parseDescription } from '../../helpers/parseDescription';

interface UploadCsvModalProps {
  onClose: () => void;
}

const hashValue = (val: string) =>
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(val)).then((h) => {
    const hexes: any = [];
    const view = new DataView(h);
    for (let i = 0; i < view.byteLength; i += 4) hexes.push(('00000000' + view.getUint32(i).toString(16)).slice(-8));
    return hexes.join('');
  });

const UploadCsvModal: React.FC<UploadCsvModalProps> = ({ onClose }) => {
  const { mutateAsync, isPending } = apiConnector.app.transactions.addMany.useMutation();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<any>(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = [];
          for (const row of results.data) {
            const hash = await hashValue(`expenses-${row.Description}-${row.Credit}-${row.Debit}-${row.Date}`);
            data.push({
              uniqueRef: hash,
              description: parseDescription(row.Description),
              account: 'expenses',
              date: DateTime.fromFormat(row.Date, 'dd/MM/yyyy').setZone('utc').startOf('day').toJSDate(),
              credit: Math.abs(+row.Credit),
              debit: Math.abs(+row.Debit),
            });
          }

          await mutateAsync({ transactions: data });
          onClose();
        },
      });
    }
  };

  return (
    <Modal onClose={onClose} loading={isPending}>
      <Modal.Body>
        <input type='file' accept='.csv' onChange={handleFileUpload} />
      </Modal.Body>
    </Modal>
  );
};

export default UploadCsvModal;
