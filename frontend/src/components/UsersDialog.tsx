import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem } from '@mui/material';

const UsersDialog = ({ open, onAdd, onClose, usersList }) => {
    const [selectedUser, setSelectedUser] = useState('');

    console.log(usersList);
    const handleAdd = () => {
        console.log(selectedUser);
        onAdd(selectedUser);
        setSelectedUser('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add User</DialogTitle>
            <DialogContent>
                <Select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    fullWidth
                    style={{ width: '250px' }}
                >
                    {usersList.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                            @{user.username}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAdd} disabled={!selectedUser}>Add</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UsersDialog;
