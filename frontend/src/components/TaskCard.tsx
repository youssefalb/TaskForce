import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

const TaskCard = ({ task, openTaskModal, checkPermission }) => {

    
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
            className={`p-2 mb-2 ${task.status === 'todo' ? 'bg-blue-100' :
                task.status === 'doing' ? 'bg-yellow-100' :
                    task.status === 'scrapped' ? 'bg-red-100' : 'bg-green-100'
                } rounded`}
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
