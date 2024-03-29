import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

const TaskCard = ({ task, openTaskModal, checkPermission }) => {

    const getBackgroundColor = () => {
        switch (task.status) {
            case 'todo':
                return '#dbeafe';
            case 'doing':
                return '#fef08a';
            case 'scrapped':
                return '#fecaca';
            case 'done':
                return '#bbf7d0';
            default:
                return '#e5e7eb';
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const handleCardClick = () => {
        if (openTaskModal) {
            openTaskModal(task);
        }
    };

    const isDraggable = () => {
        return checkPermission ? checkPermission('update_task') : false;
    };

    return (
        <Card
            elevation={3}
            style={{ backgroundColor: getBackgroundColor(), padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '0.25rem' }}
            onClick={handleCardClick}
            draggable={isDraggable()}
        >
            <CardContent>
                <Typography variant="h6" component="div" className='bold'>
                    {truncateText(task.title, 60)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <div className='overflow-hidden text-ellipsis'>
                        {truncateText(task.description, 60)}
                    </div>
                </Typography>
                <div className='flex my-2'>
                    {task.users.map((user) => (
                        <div key={user.id}>
                            <Avatar src={user.image} alt={user.username} title={user.username} />
                        </div>
                    ))}
                </div>
                <Typography variant="body2" align="right" color="text.secondary">
                    Due {task.deadline}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
