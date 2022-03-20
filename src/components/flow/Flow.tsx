import React, { useState } from 'react';
import { DataRow, ProcessedDataRow } from '../../types/DataRow';
import PostProcess from '../processing/PostProcess';
import Process from '../processing/Process';
import Upload from '../csv/Upload';
import Categorise from '../categorise/Categorise';

type Step = 'UPLOAD' | 'PROCESSING' | 'POST_PROCESS' | 'CATEGORISE';

const Flow = () => {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [file, setFile] = useState<File>();
  const [data, setData] = useState<DataRow[]>();
  const [postData, setPostData] = useState<ProcessedDataRow[]>();

  const handleUpload = (_file: File) => {
    setFile(_file);
    setStep('PROCESSING');
  };

  const handleProcessed = (_data: DataRow[]) => {
    setData(_data);
    setStep('POST_PROCESS');
  };

  const handlePostProcessed = (_data: ProcessedDataRow[]) => {
    setPostData(_data);
    setStep('CATEGORISE');
  };

  if (step === 'UPLOAD') {
    return <Upload onUpload={handleUpload} />;
  }

  if (step === 'PROCESSING' && file) {
    return <Process file={file} onProcessed={handleProcessed} />;
  }

  if (step === 'POST_PROCESS' && data) {
    return <PostProcess data={data} onPostProcessed={handlePostProcessed} />;
  }

  if (step === 'CATEGORISE' && postData) {
    return <Categorise data={postData} />;
  }
};

export default Flow;
