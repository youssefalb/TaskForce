import React, { use, useEffect, useState } from 'react';
import { Typography, Button, List, ListItem, ListItemText, ListItemButton, Box, Paper, Chip } from '@mui/material';
import RoleDialog from '../RoleDialog';
import { deleteRole, getProjectRoles } from '@/lib/projects';
import { useSession } from 'next-auth/react';
import CustomButton from '../CustomButton';
import { updateRole, createRole } from '@/lib/projects';
import LoadingComponent from '../LoadingComponent';
import EmptyStateMessage from '../EmptyStateMessage';


const RolesPage = ({ projectId, permissions }: any) => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const canAddRoles = permissions?.includes('add_role');
    const canEditRoles = permissions?.includes('change_role');
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    console.log('permissions', permissions )

    const handleDialogOpen = (role) => {
        setSelectedRole(role);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleRoleUpdate = async (role: Role) => {
        if (role?.id) {
            if (session?.user?.accessToken) {
                try {
                    updateRole(session.user.accessToken, role);

                }
                catch (error) {
                    console.error(error);
                }
                setRoles(prevRoles => prevRoles.map(r => r.id === role.id ? role : r));
            }
        }
        else {
            if (session?.user?.accessToken) {
                try {
                    await createRole(session.user.accessToken, projectId, role);
                }
                catch (error) {
                    console.error(error);
                }
                setRoles(prevRoles => [...prevRoles, role]);
                console.log('New role added', role);
            }
            fetchData();
        }

        handleDialogClose();
    };


    const fetchData = async () => {
        if (session?.user?.accessToken && projectId) {
            setLoading(true);
            await getProjectRoles(session.user.accessToken, projectId.toString())
                .then((data) => { setRoles(data); console.log('Response Data for roles', data); })
                .catch((error) => console.error(error));
            setLoading(false);
        } else {
            console.error("Access token or user ID is undefined.");
            setLoading(false);
        }
    }
    const handleRoleDelete = async (roleId) => {
        console.log('Role ID', roleId);

        if (session?.user?.accessToken && projectId) {
            try {
                await deleteRole(session.user.accessToken, roleId);
                setRoles(roles.filter(r => r.id !== roleId));
                handleDialogClose();

            } catch (error) {
            }
        }
    }


    useEffect(() => {
        fetchData();
    }, []);


    if (loading) {
        return <LoadingComponent />;
    }

    if (roles.length === 0) {
        return (
                <div className="flex flex-col items-center">
                    <EmptyStateMessage
                        title="No Roles Found"
                        description="No roles found in this project."
                    />
                    {canAddRoles && (
                        <CustomButton onClick={() => handleDialogOpen(null)} buttonText={"Add New Role"} />
                    )}
                </div>
        );
    }
    return (
        <div>
            <Typography variant="h4" gutterBottom>Project Roles</Typography>
            {canAddRoles && <CustomButton onClick={() => handleDialogOpen(null)} buttonText={"Add New Role"} />}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {roles.map((role) => (
                    <Paper
                        key={role.id}
                        elevation={2}
                        sx={{ padding: 2, cursor: 'pointer' }}
                        onClick={() => {
                            if (role.name !== 'Owner' && role.name !== 'Admin') {
                                handleDialogOpen(role);
                            }
                        }}
                    >
                        <Typography variant="subtitle1">{role.name}</Typography>
                        <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {role.permissions.map((permission) => (
                                <Chip label={permission.name} variant="outlined" sx={{ backgroundColor: 'grey.300' }}
                                />
                            ))}
                        </Box>

                    </Paper>
                ))}
            </Box>
            {canEditRoles && <RoleDialog open={isDialogOpen} onClose={handleDialogClose} role={selectedRole} onSave={handleRoleUpdate} onDelete={handleRoleDelete} />}        </div>
    );
};

export default RolesPage;
