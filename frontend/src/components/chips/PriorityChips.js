// PriorityChips.js
import React from 'react';
import { Chip } from '@mui/material';

const priorityColors = {
  'urgent': 'red',
  'high': 'orange',
  'medium': 'yellow',
  'low': 'green',
};

export const priorityMap = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const PriorityChip = ({ priority }) => {
  const label = priorityMap[priority];
  const color = priorityColors[priority?.toLowerCase()]; 

  return <Chip label={label} size="small" style={{ backgroundColor: color }} />;
};

export default PriorityChip;
