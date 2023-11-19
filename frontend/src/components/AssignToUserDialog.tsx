import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';

const AssignToUserDialog = ({ open, onClose, onAssign, usersList }) => {
    const [selectedUser, setSelectedUser] = useState('');

    useEffect(() => {
        console.log(usersList);
        if (open && usersList.length === 0) {

        }
    }, [open, usersList.length]);

    const handleAssign = () => {
        onAssign(selectedUser);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Assign Ticket</DialogTitle>
            <DialogContent>
                {/* Adjust width here */}
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    fullWidth
                    style={{ width: '250px' }} // Set the desired width
                >
                    {usersList.map((user) => (
                        <MenuItem key={user.user} value={user.user}>
                            @{user.username} {/* Displaying only username */}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAssign} disabled={!selectedUser}>Assign</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignToUserDialog;
