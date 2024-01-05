import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Grid,
    DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

const AddProjectDialog = ({ open, handleClose, handleSubmit }) => {
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        start_date: new Date(),
        end_date: new Date(),
    });

    const handleInputChange = (e) => {
        setNewProject({
            ...newProject,
            [e.target.name]: e.target.value,
        });
    };

    const handleDateChange = (name, date) => {
        setNewProject({
            ...newProject,
            [name]: date,
        });
    };

    const handleFormSubmit = () => {

        const formattedDetails = {
            ...newProject,
            start_date: newProject.start_date.toISOString().split('T')[0],
            end_date: newProject.end_date.toISOString().split('T')[0]
        };

        handleSubmit(formattedDetails);
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} >
                    <Grid item xs={12} mt={2}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={newProject.title}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={newProject.description}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="Start Date"
                            name="start_date"
                            value={newProject.start_date}
                            onChange={(date) => handleDateChange('start_date', date)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <DatePicker
                            label="End Date"
                            name="end_date"
                            value={newProject.end_date}
                            onChange={(date) => handleDateChange('end_date', date)}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleFormSubmit}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProjectDialog;
