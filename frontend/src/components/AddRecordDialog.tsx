import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const AddRecordDialog = ({ open, onClose, onAdd }) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = () => {
        const startDate = `${date}T${startTime}:00Z`;
        const endDate = `${date}T${endTime}:00Z`
        console.log("Start date: ", startDate);
        console.log("End date: ", endDate);
        console.log("Notes: ", notes);
        onAdd({ startDate, endDate, notes });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Record</DialogTitle>
            <DialogContent>
                <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Start Time"
                    type="time"
                    fullWidth
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Time"
                    type="time"
                    fullWidth
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    sx={{ mt: 2 }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Notes"
                    multiline
                    rows={4}
                    fullWidth
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    sx={{ mt: 2 }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRecordDialog;
