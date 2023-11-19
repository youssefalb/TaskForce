import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem } from '@mui/material';
const priorityMap = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const statusMap = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

const AddTicketDialog = ({ open, onClose, onAdd }) => {
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open'
  });

  const handleInputChange = (e) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (newTicket.title.trim() === '' || newTicket.description.trim() === '') {
        alert('Please fill in all required fields.');
        return;
    }
    console.log(newTicket);
    onAdd(newTicket);
    console.log("add clicked");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Ticket</DialogTitle>
      <DialogContent>
        <TextField
          name="title"
          sx={{ my: 2 }}
        required    
          label="Title"
          type="text"
          fullWidth
          onChange={handleInputChange}
        />
        <TextField
          sx={{ my: 2 }}
          name="description"
          label="Description"
          required  
          type="text"
            multiline
          rows={5}
          fullWidth
          onChange={handleInputChange}
        />
        <Select
          sx={{ my: 2 }}
          name='priority'
          value={newTicket.priority}
          
          onChange={handleInputChange}
          fullWidth
        >
          {Object.keys(priorityMap).map((key) => (
            <MenuItem key={key} value={key}>{priorityMap[key]}</MenuItem>
          ))}
        </Select>
        <Select
          sx={{ my: 2 }}
          name='status'
        
          value={newTicket.status}
          onChange={handleInputChange}
          fullWidth
        >
          {Object.keys(statusMap).map((key) => (
            <MenuItem key={key} value={key}>{statusMap[key]}</MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTicketDialog;
