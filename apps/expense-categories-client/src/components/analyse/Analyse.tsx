import React from 'react';
import { apiConnector } from '../../core/api.connector';

const Analyse = () => {
  const query = apiConnector.app.assist.streamStory.useQuery();

  return (
    <div>
      <h1>Space Adventure Story</h1>
      <div style={{ maxWidth: '500px', color: 'white' }}>{query.data}</div>
    </div>
  );
};

export default Analyse;
