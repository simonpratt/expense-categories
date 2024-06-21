import React from 'react';
import { apiConnector } from '../../core/api.connector';

const Analyse = () => {
  const query = apiConnector.app.assist.streamStory.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <h1>Space Adventure Story</h1>
      {query.data?.map((car) => (
        <div key={car.model} style={{ maxWidth: '500px', color: 'white' }}>
          {car.description} ({car.confidence})
        </div>
      ))}
    </div>
  );
};

export default Analyse;
