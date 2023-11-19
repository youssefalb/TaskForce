// StatusChips.js
import React from 'react';
import { Chip } from '@mui/material';

const statusColors = {
  'open': 'lightblue',
  'in_progress': 'orange',
  'resolved': 'green',
  'closed': 'grey',
};

export const statusMap = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const StatusChip = ({ status }) => {
  const label = statusMap[status];
  const color = statusColors[status?.toLowerCase()];
  return <Chip label={label} size="small" style={{ backgroundColor: color }} />;
};

export default StatusChip;
