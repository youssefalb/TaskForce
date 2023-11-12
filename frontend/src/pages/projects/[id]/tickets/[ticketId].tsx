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
} from '@mui/material';
import { useRouter } from 'next/router';
import { getTicketDetail, getTicketComments } from '@/lib/projects';
import StatusChip from '@/components/chips/StatusChips';
import PriorityChip from '@/components/chips/PriorityChips';


const TicketDetail = () => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const { data: session } = useSession();
    const router = useRouter()
    const { id, ticketId } = router.query



    const fetchTicketDetails = async (ticketId) => {
        if (session?.user?.accessToken && ticketId && id) {
            console.log('Ticket ID: ', ticketId);
            setLoading(true);
            try {
                const res = await getTicketDetail(session.user.accessToken, id.toString(), ticketId.toString());
                const ticketComments = await getTicketComments(session.user.accessToken, id.toString(), ticketId.toString());
                console.log('Ticket Details: ', res);
                console.log('Ticket Comments: ', ticketComments);
                setTicket(res);
                setComments(ticketComments);
            } catch (error) {
                console.error("Failed to fetch ticket details:", error);
            }
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchTicketDetails(ticketId);
    }, [ticketId, session]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!ticket) {
        return <Typography variant="h6">Ticket not found</Typography>;
    }


    // const comments = [
    //     { id: 1, text: "This is a comment.", author: "Commenter One" },
    //     // ... more comments
    // ];

    return (
        <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
                {ticket.title}
            </Typography>
            <Button color="primary">
                Edit
            </Button>

            <Button color="primary">
                Comment
            </Button>

            <Button color="primary">
                Assign to me
            </Button>
            <Button color="primary">
                Assign
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', width: '100%' }} mb={2}>
                {ticket.created_by && (
                    <Box display="flex" sx={{ alignItems: 'center' }} m={1}>
                        <Avatar src={ticket.created_by.image} />
                        <Typography variant="subtitle1" ml={1}>
                            Created by {ticket.created_by.first_name || "xxxx"} {ticket.created_by.last_name || "xxxx"}
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
            <Typography gutterBottom sx={{ fontFamily: '"Segoe UI"' }} mb={2}>
                        Descirption: 
                    </Typography>
            <Typography mb={2}>{ticket.description}</Typography>
            <Divider light />


            {comments.length > 0 && (
                 <List>
                {comments.map((comment) => (
                    <ListItem alignItems="flex-start" key={comment.id}>
                        <ListItemAvatar>
                            <Avatar alt={comment.author.image} />
                        </ListItemAvatar>
                        <ListItemText primary={comment.text} secondary={
                                 <>
                                <Typography variant="subtitle1"component="span">
                                {comment.author.first_name || "xxxx"} {comment.author.last_name || "xxxx"}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="span" ml={1}>
                                @{comment.author.username || "unknown"}
                                </Typography>
                            </>
                        } />
                    </ListItem>
                ))}
            </List>
                
            )}
           
        </CardContent>

    );
};

export default TicketDetail;
