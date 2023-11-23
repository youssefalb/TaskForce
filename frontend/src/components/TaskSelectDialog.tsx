// TaskSelectionDialog.js
import React, { use, useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';


const TaskSelectDialog = ({ open, onClose, onUpdateTasks, tasks, ticketTasks }) => {
    const [selectedTasks, setSelectedTasks] = useState(ticketTasks.map((task) => task.id) || []);
    console.log("Selected tasks: ", selectedTasks);
    console.log("Ticket tasks: ", ticketTasks);


    useEffect(() => {
        setSelectedTasks(ticketTasks.map((task) => task.id));
    }, [ticketTasks, open]);

    const handleToggleTask = (taskId) => {
        console.log("Task ID: ", taskId);
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
        } else {
            setSelectedTasks([...selectedTasks, taskId]);
        }

    };



    const handleAdjustSelectedTasks = () => {
        // console.log("Selected tasks: ", selectedTasks);
        onUpdateTasks(selectedTasks);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Select a Task to Add</DialogTitle>
            {tasks.length > 0 ? (
                <List>
                    {tasks.map((task) => (
                        <ListItemButton key={task.id}>
                            <Checkbox
                                checked={selectedTasks.includes(task.id)}
                                onChange={() => handleToggleTask(task.id)}
                            />
                            <ListItemText primary={task.title} />
                        </ListItemButton>
                    ))}
                </List>
            ) : (
                <p>No tasks available.</p>
            )}
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAdjustSelectedTasks} color="primary" disabled={selectedTasks?.length === 0}>
                    Update Tasks
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskSelectDialog;
