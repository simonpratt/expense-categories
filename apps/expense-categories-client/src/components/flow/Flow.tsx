import React, { useEffect, useState } from 'react';
import { DataRow, ProcessedDataRow } from '../../types/DataRow';
// import PostProcess from '../processing/PostProcess';
import Process from '../processing/Process';
import Upload from '../csv/Upload';
import Categorise from '../categorise/Categorise';
import storage from '../../core/storage';

type Step = 'UPLOAD' | 'PROCESSING' | 'POST_PROCESS' | 'CATEGORISE';

const Flow = () => {
  const [step, setStep] = useState<Step>('UPLOAD');
  const [rawData, setRawData] = useState<Record<string, string>[]>();
  const [data, setData] = useState<DataRow[]>();
  const [postData, setPostData] = useState<ProcessedDataRow[]>();

  useEffect(() => {
    const loaded = storage.getItem('data');
    if (loaded) {
      setPostData(loaded);
      setStep('CATEGORISE');
    }
  }, [setPostData]);

  const handleRaw = (_rawData: Record<string, string>[]) => {
    setRawData(_rawData);
    setStep('PROCESSING');
  };

  const handleProcessed = (_data: DataRow[]) => {
    setData(_data);
    setStep('POST_PROCESS');
  };

  // const handlePostProcessed = (_postData: ProcessedDataRow[]) => {
  //   setPostData(_postData);
  //   storage.setItem('data', _postData);
  //   setStep('CATEGORISE');
  // };

  if (step === 'UPLOAD') {
    return <Upload onUpload={handleRaw} />;
  }

  if (step === 'PROCESSING' && rawData) {
    return <Process rawData={rawData} onProcessed={handleProcessed} />;
  }

  if (step === 'POST_PROCESS' && data) {
    return <div>123</div>
    // return <PostProcess data={data} onPostProcessed={handlePostProcessed} />;
  }

  if (step === 'CATEGORISE' && postData) {
    return <Categorise data={postData} />;
  }

  return null;
};

export default Flow;
