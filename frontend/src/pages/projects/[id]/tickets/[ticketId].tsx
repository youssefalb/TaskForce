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
    Grid,
} from '@mui/material';
import { useRouter } from 'next/router';
import { getTicketDetail, getTicketComments, updateTicket, createTicketComment, getProjectUsers, getTicketFiles, deleteFileFromTicket } from '@/lib/projects';
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
import TicketFileUpload from '@/components/TicketFileUpload';
import { addFileToTicket } from '@/lib/projects';
import { getTicketTasks } from '@/lib/projects';
import TaskCard from '@/components/TaskCard';
import TaskSelectionDialog from '@/components/TaskSelectDialog';
import { getProjectTasks } from '@/lib/projects';
import { updateTicketTasks } from '@/lib/projects';
import AddRecordDialog from '@/components/AddRecordDialog';
import { addRecord } from '@/lib/projects';
const TicketDetail = () => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const { data: session } = useSession();
    const router = useRouter()
    const { id, ticketId } = router.query
    const [editMode, setEditMode] = useState(false);
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [projectTasks, setProjectTasks] = useState([]);

    const [editValues, setEditValues] = useState({
        title: '',
        description: '',
        priority: '',
        status: '',
    });
    const [ticketFiles, setTicketFiles] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [showUsersDialog, setShowUsersDialog] = useState(false);
    const [showAddRecordDialog, setShowAddRecordDialog] = useState(false);
    const [ticketTasks, setTicketTasks] = useState([]);

    const handleAddRecord = async (recordData) => {
        // console.log('Record Data: ', recordData);
        //         console.log('Ticket ID: ', ticketId);
        const res = await addRecord(session.user.accessToken, Number(ticketId), recordData);
        // console.log('Response: ', res);
        setShowAddRecordDialog(false);
    };

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

    const handleUpdateTasks = async (updatedTasks) => {
        console.log('tasks: ', updatedTasks);
        setShowTaskDialog(false);
        setLoading(true);
        const res = await updateTicketTasks(session.user.accessToken, ticketId.toString(), updatedTasks);
        await fetchTicketTasks();
        setLoading(false);

    };

    const handleFilesUpload = async (fileUrl, fileName) => {
        if (session?.user?.accessToken && ticketId && id) {
            // console.log('Uploaded file:', fileUrl);
            // console.log('Ticket ID:', ticketId);
            // console.log('session.user.accessToken:', session.user.accessToken)
            const res = await addFileToTicket(session.user.accessToken, ticketId.toString(), fileUrl, fileName);
            fetchTicketFiles(ticketId);
        }

    };
    const handleFilesDelete = async (file) => {
        if (session?.user?.accessToken && file?.id) {
            const res = await deleteFileFromTicket(session.user.accessToken, file.id);
            fetchTicketFiles(ticketId);
        }

    };


    const handleDetailsSave = async () => {
        // console.log('Saving...');
        // console.log('Edit Values: ', editValues);
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
        }
    };
    const fetchTicketTasks = async () => {
        console.log('Fetching ticket tasks...');
        if (session?.user?.accessToken && ticketId && id) {
            try {
                // console.log('Fetching ticket tasks...');
                const res = await getTicketTasks(session.user.accessToken, ticketId.toString());
                // console.log('Ticket tasks: ', res);
                setTicketTasks(res);
            }
            catch (error) {
                console.error("Failed to fetch ticket tasks:", error);
            }
        }
    }
    const fetchTicketFiles = async (ticketId) => {
        if (session?.user?.accessToken && ticketId && id) {
            try {
                const res = await getTicketFiles(session.user.accessToken, ticketId.toString());
                setTicketFiles(res);
            } catch (error) {
                console.error("Failed to fetch ticket files:", error);
            }
        }
    }


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
    const fetchProjectTasks = async () => {
        if (session?.user?.accessToken && id) {
            try {
                const data = await getProjectTasks(session.user.accessToken, id.toString());
                const tasksWithStringsIds = data;
                setProjectTasks(tasksWithStringsIds);
            } catch (error) {
                console.error("Failed to fetch project tasks:", error);
            }
        }
    }

    useEffect(() => {
        // fetchTicketDetails(ticketId);
        // fetchProjectUsers();
        // fetchProjectTasks();
        // fetchTicketFiles(ticketId);
        // fetchTicketTasks();
        fetchData();
    }, [ticketId, session]);


    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([
                fetchTicketDetails(ticketId),
                fetchProjectUsers(),
                fetchProjectTasks(),
                fetchTicketFiles(ticketId),
                fetchTicketTasks()
            ]);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
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

    if (loading) {
        return <LoadingComponent />;
    }


    if (!ticket) {
        console.log('Ticket not found');
        console.log('loading: ', loading);
        return (
            <EmptyStateMessage
                title="No Ticket Found"
                description="No ticket found with this ID."
            />
        );
    }
    return (
        <CardContent>
            {editableField(ticket.title, 'Title', 'title')}

            <Button onClick={handleAssignToMe} color="primary">
                Assign to me
            </Button>
            <Button onClick={() => setShowUsersDialog(true)} color="primary">
                Assign
            </Button>
            <Button onClick={() => setShowAddRecordDialog(true)} color="primary">
                Add record
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
            <Box m={5}>
                <TicketFileUpload
                    files={ticketFiles}
                    onFileUpload={handleFilesUpload}
                    onFileDelete={handleFilesDelete}
                    ticketId={ticketId}
                />
            </Box>
            <Divider light />
            {comments.length > 0 && (
                <CommentsList comments={comments} />

            )}
            <AddComment handleAddComment={handleAddComment} />



            <Divider light />
            <Typography variant="h5" sx={{ marginTop: 2 }}>
                Related Tasks
            </Typography>
            {ticketTasks.length > 0 ? (
                <Grid container spacing={2} my={1}>
                    {ticketTasks.map((task) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={task.id}>
                            <TaskCard task={task} openTaskModal={null} checkPermission={null} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">No related tasks.</Typography>
            )}

            <Button variant="contained" type="submit" onClick={() => setShowTaskDialog(true)}
                style={{
                    color: 'black',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                    fontWeight: 'bold',
                    fontSize: '16px',
                }} sx={{ mb: 2 }} >
                Add Task
            </Button>


            <Divider light />

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
            <TaskSelectionDialog
                open={showTaskDialog}
                onClose={() => setShowTaskDialog(false)}
                onUpdateTasks={handleUpdateTasks}
                tasks={projectTasks}
                ticketTasks={ticketTasks}

            />
            <AssignToUserDialog
                open={showUsersDialog}
                onClose={() => setShowUsersDialog(false)}
                onAssign={handleAssignToUser}
                usersList={usersList}
            />

            <AddRecordDialog
                open={showAddRecordDialog}
                onClose={() => setShowAddRecordDialog(false)}
                onAdd={handleAddRecord}
            />
        </CardContent>

    );
};

export default TicketDetail;
