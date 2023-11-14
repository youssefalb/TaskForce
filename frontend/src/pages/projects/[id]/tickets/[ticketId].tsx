import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Button,
    TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { getTicketDetail, getTicketComments, updateTicket, createTicketComment } from '@/lib/projects';
import StatusChip from '@/components/chips/StatusChips';
import PriorityChip from '@/components/chips/PriorityChips';
import CommentsList from '@/components/CommentsList';
import { format, set } from 'date-fns';
import AddComment from '@/components/AddComment';


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
            console.log('Ticket ID: ', ticketId);
            setLoading(true);
            try {
                const res = await getTicketDetail(session.user.accessToken, id.toString(), ticketId.toString());
                const ticketComments = await getTicketComments(session.user.accessToken, id.toString(), ticketId.toString());
                setTicket(res);
                setEditValues(res);
                console.log('Ticket Details: ', res);
                setComments(ticketComments);
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

    const cancelEdit = () => {
        setEditMode(false);
        setEditValues(ticket);
        console.log('Edit Values after cancel: ', editValues);
    };


    if (loading) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
                flexDirection="column"
            >
                <CircularProgress />
                <Typography variant="h6" mt={2}>
                    Loading...
                </Typography>
            </Box>
        );
    }

    if (!ticket) {
        return <Typography variant="h6">Ticket not found</Typography>;
    }

    const editableField = (fieldValue, label, name, multiline = false) => {
        return editMode ? (
            <TextField
                fullWidth
                variant="outlined"
                name={name}
                label={label}
                defaultValue={fieldValue}
                multiline={multiline}
                onChange={handleInputChange}
            />
        ) : (
            <Typography variant={multiline ? "body1" : "h5"} component="div" gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                {fieldValue || `No ${label}`}
            </Typography>
        );
    };

    return (
        <CardContent>
            {editableField(ticket.title, 'Title', 'title')}
            <Button color="primary">
                Comment
            </Button>

            <Button color="primary">
                Assign to me
            </Button>
            <Button color="primary">
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
                            Assigned to {ticket.created_by.first_name || "xxxx"} {ticket.created_by.last_name || "xxxx"}
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
                            Created by {ticket.assigned_to.first_name || "xxxx"} {ticket.assigned_to.last_name || "xxxx"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" ml={1}>
                            @{ticket.assigned_to.username || "unknown"}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Typography gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                Priority:   <PriorityChip priority={ticket.priority} />
            </Typography>
            <Typography gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                Status:  <StatusChip status={ticket.status} />
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


        </CardContent>

    );
};

export default TicketDetail;
