import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Divider,
    Button,
    TextField,
    MenuItem,
    Select,
} from '@mui/material';
import { useRouter } from 'next/router';
import { getTicketDetail, getTicketComments, updateTicket, createTicketComment, getProjectUsers } from '@/lib/projects';
import StatusChip from '@/components/chips/StatusChips';
import PriorityChip from '@/components/chips/PriorityChips';
import CommentsList from '@/components/CommentsList';
import { format, set } from 'date-fns';
import AddComment from '@/components/AddComment';
import LoadingComponent from '@/components/LoadingComponent';
import EmptyStateMessage from '@/components/EmptyStateMessage';
import { priorityMap } from '@/components/chips/PriorityChips';
import { statusMap } from '@/components/chips/StatusChips';
import AssignToUserDialog from '@/components/AssignToUserDialog';

const TicketDetail = () => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const { data: session } = useSession();
    const router = useRouter()
    const { id, ticketId } = router.query
    const [editMode, setEditMode] = useState(false);
    const [editValues, setEditValues] = useState({
        title: '',
        description: '',
        priority: '',
        status: '',
    });

    const [usersList, setUsersList] = useState([]);

    const [showUsersDialog, setShowUsersDialog] = useState(false);

    const fetchProjectUsers = async () => {
        if (session?.user?.accessToken && id) {
            try {
                const users = await getProjectUsers(session.user.accessToken, id.toString());
                setUsersList(users);
            } catch (error) {
                console.error("Error fetching project users:", error);
            }
        }
    };


    const handleDetailsSave = async () => {
        console.log('Saving...');
        console.log('Edit Values: ', editValues);
        const details = {
            title: editValues.title,
            description: editValues.description,
            priority: editValues.priority,
            status: editValues.status,
        };
        await updateTicket(session.user.accessToken, id.toString(), ticketId.toString(), details);
        setTicket(details);
        setEditMode(false);
    };


    const fetchTicketDetails = async (ticketId) => {
        if (session?.user?.accessToken && ticketId && id) {
            setLoading(true);
            try {
                const res = await getTicketDetail(session.user.accessToken, id.toString(), ticketId.toString());

                if (res && res.id) {
                    setTicket(res);
                    setEditValues(res);
                    const ticketComments = await getTicketComments(session.user.accessToken, id.toString(), ticketId.toString());
                    setComments(ticketComments);
                } else {
                    console.log('Ticket not found or invalid response');
                }
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
            }
            setLoading(false);
        }
    };


    const handleAddComment = async (commentText: string) => {
        if (session?.user?.accessToken && ticketId && id) {
            console.log('Comment Text: ', commentText);
            try {
                const res = await createTicketComment(session.user.accessToken, ticketId.toString(), commentText, session?.user?.id);
                console.log('Comment Response: ', res);
                fetchTicketDetails(ticketId);
            } catch (error) {
                console.error("Failed to add comment:", error);
            }
        }

    }

    useEffect(() => {
        fetchTicketDetails(ticketId);
        fetchProjectUsers();
    }, [ticketId, session]);

    const handleInputChange = async (e) => {
        if (session?.user?.accessToken && ticketId && id) {
            const { name, value } = e.target;
            console.log('Name: ', name);
            console.log('Value: ', value);
            setEditValues({ ...editValues, [name]: value });
            console.log('Edit Values: ', editValues);
        }
    };

    const handleAssignToMe = async () => {
        if (session?.user?.accessToken && ticketId && id) {
            console.log('Assigning to me...');
            const details = {
                assigned_to: session?.user?.id,
            };
            console.log('Details: ', details);
            const res = await updateTicket(session.user.accessToken, id.toString(), ticketId.toString(), details);
            console.log('Response: ', res);
            fetchTicketDetails(ticketId);
            console.log('Updated Ticket: ', ticket);
            setEditMode(false);
        }
    }

    const handleAssignToUser = async (selectedUser) => {
        if (session?.user?.accessToken && ticketId && id) {
            const details = {
                assigned_to: selectedUser,
            };
            const res = await updateTicket(session.user.accessToken, id.toString(), ticketId.toString(), details);
            await fetchTicketDetails(ticketId);
            console.log('Updated Ticket: ', ticket);
            setEditMode(false);
        }
    };


    const cancelEdit = () => {
        setEditMode(false);
        setEditValues(ticket);
        console.log('Edit Values after cancel: ', editValues);
    };


    if (loading) {
        return <LoadingComponent />;
    }


    if (ticket == null) {
        return (
            <EmptyStateMessage
                title="No Ticket Found"
                description="No ticket found with this ID."
            />
        );
    }

    const editableField = (fieldValue, label, name, multiline = false) => {
        if (editMode) {
            console.log('priorityMap: ', priorityMap);
            console.log('statusMap: ', statusMap);
            if (name === 'priority' || name === 'status') {
                const options = name === 'priority' ? priorityMap : statusMap;
                return (
                    <Select
                        name={name}
                        value={editValues[name]}
                        onChange={handleInputChange}
                        fullWidth
                    >
                        {Object.keys(options).map((key) => (
                            <MenuItem key={key} value={key}>{options[key]}</MenuItem>
                        ))}
                    </Select>
                );
            } else {
                return (
                    <TextField
                        fullWidth
                        variant="outlined"
                        name={name}
                        label={label}
                        defaultValue={fieldValue}
                        multiline={multiline}
                        onChange={handleInputChange}
                    />
                );
            }
        } else {
            if (name === 'priority') {
                return <PriorityChip priority={fieldValue} />;
            } else if (name === 'status') {
                return <StatusChip status={fieldValue} />;
            } else {
                return (
                    <Typography variant={multiline ? "body1" : "h5"} component="div" gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                        {fieldValue || `No ${label}`}
                    </Typography>
                );
            }
        }
    };

    return (
        <CardContent>
            {editableField(ticket.title, 'Title', 'title')}

            <Button onClick={handleAssignToMe} color="primary">
                Assign to me
            </Button>
            <Button onClick={() => setShowUsersDialog(true)} color="primary">
                Assign
            </Button>

            {!editMode && (
                <Button onClick={() => setEditMode(true)} color="primary">
                    Edit
                </Button>
            )}
            {editMode && (
                <>
                    <Button onClick={() => handleDetailsSave()} color="primary">
                        Save
                    </Button>
                    <Button onClick={() => cancelEdit()} color="secondary">
                        Cancel
                    </Button>
                </>

            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', width: '100%' }} mb={2}>
                {ticket.created_by && (
                    <Box display="flex" sx={{ alignItems: 'center' }} m={1}>
                        <Avatar src={ticket.created_by.image} />
                        <Typography variant="subtitle1" ml={1}>
                            Created By {ticket.created_by.first_name || "xxxx"} {ticket.created_by.last_name || "xxxx"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" ml={1}>
                            @{ticket.created_by.username || "unknown"}
                        </Typography>
                    </Box>
                )}
                {ticket.assigned_to && (
                    <Box display="flex" sx={{ alignItems: 'center' }} m={1}>
                        <Avatar src={ticket.assigned_to.image} />
                        <Typography variant="subtitle1" ml={1}>
                            Assigned to {ticket.assigned_to.first_name || "xxxx"} {ticket.assigned_to.last_name || "xxxx"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" ml={1}>
                            @{ticket.assigned_to.username || "unknown"}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Typography gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                Priority: {editableField(ticket.priority, 'Priority', 'priority')}
            </Typography>
            <Typography gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                Status: {editableField(ticket.status, 'Status', 'status')}
            </Typography>

            <Divider light />
            {editableField(ticket.description, 'Description', 'description', true)}
            <Divider light />

            {comments.length > 0 && (
                <CommentsList comments={comments} />

            )}
            <AddComment handleAddComment={handleAddComment} />

            {ticket.created_at && ticket.updated_at && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="overline" display="block" gutterBottom>
                        Created: {ticket ? format(new Date(ticket.created_at), "PPpp") : "N/A"}
                    </Typography>
                    <Typography variant="overline" display="block" gutterBottom>
                        Last Updated: {ticket ? format(new Date(ticket.updated_at), "PPpp") : "N/A"}
                    </Typography>
                </Box>

            )}

            <AssignToUserDialog
                open={showUsersDialog}
                onClose={() => setShowUsersDialog(false)}
                onAssign={handleAssignToUser}
                usersList={usersList}
            />
        </CardContent>

    );
};

export default TicketDetail;
