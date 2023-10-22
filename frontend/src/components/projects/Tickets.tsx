import React from 'react';

const Tickets = ({ projectId } : any) => {

  console.log(projectId);

  
  return (
    <div>
      <h1>Tickets</h1>
      <p>Ticket ID: {projectId}</p>
    </div>
  );
};

export default Tickets;
