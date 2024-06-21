import React from 'react';
import { apiConnector } from '../../core/api.connector';

const Analyse = () => {
  const query = apiConnector.app.assist.streamStory.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  console.log(query.data);

  return (
    <div>
      <h1>Space Adventure Story</h1>
      {query.data?.map((car) => (
        <div key={car.model} style={{ maxWidth: '500px', color: 'white' }}>
          {car.model}
        </div>
      ))}
    </div>
  );
};

export default Analyse;
