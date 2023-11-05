import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Chip,
    Stack,
    Autocomplete
} from '@mui/material';
import { getAvailablePermissions } from '@/lib/projects';





const RoleDialog = ({ open, onClose, onSave, role }) => {
    const [roleState, setRoleState] = useState({ name: '', permissions: [] });
    const [availablePermissions, setAvailablePermissions] = useState([]);
    const [inputPermission, setInputPermission] = useState('');

    useEffect(() => {
        if (role && open) {
            setRoleState(role);
        } else {
            setRoleState({ name: '', permissions: [] });
        }
    }, [role, open]);

    useEffect(() => {
        const getPermissions = async () => {
            try {
                const permissions = await getAvailablePermissions();
                setAvailablePermissions(permissions);
                console.log("Available permissions: ", permissions);
            }
            catch (error) {
                console.error(error);
            }
        };

        getPermissions();
    }, []);

    const handleSave = () => {
        onSave(roleState);
    };

    const handleChange = (event) => {
        setRoleState({ ...roleState, [event.target.name]: event.target.value });
        console.log("Role state: ", roleState);
    };

    const handlePermissionDelete = (permissionCodename) => {
        console.log("Role state: ", roleState);
        console.log("Permission ID: ", permissionCodename);

        setRoleState((prevState) => ({
            ...prevState,
            permissions: prevState.permissions.filter(
                (permission) => permission.codename !== permissionCodename
            ),
        }));
    };

    const handleAddPermission = (event, newValue) => {
        if (newValue && !roleState.permissions.some(p => p.id === newValue.id)) {
            setRoleState((prevState) => ({
                ...prevState,
                permissions: [...prevState.permissions, newValue],
            }));
            setInputPermission(''); // Clear input after adding
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{role ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Role Name"
                    type="text"
                    fullWidth
                    name="name"
                    value={roleState.name}
                    onChange={handleChange}
                />
                <Autocomplete
                    options={availablePermissions}
                    getOptionLabel={(option) => option.name || ''}
                    getOptionDisabled={(option) =>
                        roleState.permissions.some((permission) => permission.codename === option.codename)
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="Add Permission" margin="normal" />
                    )}
                    value={inputPermission}
                    onChange={handleAddPermission}
                    freeSolo
                />
                <Stack direction="row" spacing={1} mt={2}>
                    {roleState.permissions.map((permission) => (
                        <Chip
                            key={permission.codename}
                            label={permission.name}
                            onDelete={() => handlePermissionDelete(permission.codename)}
                        />
                    ))}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoleDialog;
