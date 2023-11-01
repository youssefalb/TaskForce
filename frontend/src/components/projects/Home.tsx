import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Avatar, Button, Modal } from '@mui/material';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import { changeTaskStatus, getProjectTasks } from '@/lib/projects';
import TaskDialog from '../TaskDialog';

const Home = ({ projectId }: any) => {
  type Task = {
    id: string;
    title: string;
    status: string;
    description: string;
    users: {
      id: string;
      username: string;
      image: string;
    }[];
    deadline: string;
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fetchData = async () => {
    if (session?.user?.accessToken) {
      try {
        const data = await getProjectTasks(session.user.accessToken, projectId);

        const tasksWithStringsIds = data.map((task: Task) => ({
          ...task,
          id: task.id.toString(),
        }));

        setTasks(tasksWithStringsIds);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Access token or user ID is undefined.');
    }
  };

  useEffect(() => {

    fetchData();
  }, [session, projectId]);


  useEffect(() => {
    console.log('Selected Task: ', selectedTask);
  }, [selectedTask]);

const addTask = () => {
    setSelectedTask(null);
    console.log('Add Task is triggred');
    setIsModalOpen(true);
  };



  const onDragEnd = async (result: any) => {
    if (!result.destination) {
      return;
    }

    const updatedTasks = Array.from(tasks);
    const [draggedTask] = updatedTasks.splice(result.source.index, 1);
    updatedTasks.splice(result.destination.index, 0, {
      ...draggedTask,
      status: result.destination.droppableId,
    });

    await changeTaskStatus(session?.user?.accessToken, draggedTask.id, result.destination.droppableId)
      .then((data) => {
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error('Error changing task status:', error);
      });
  };

  const openTaskModal = (task: Task) => {
    console.log('Open Task Modal is triggred');
    console.log('Task: ', task);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
  };



  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Task Management
        </Typography>

        <Grid container spacing={0.5} style={{ display: 'flex' }}>
          {['backlog', 'todo', 'doing', 'done', 'scrapped'].map((columnId) => (
            <Droppable key={columnId} droppableId={columnId} type="task">
              {(provided) => (
                <Grid item xs={2.4} ref={provided.innerRef}>
                  <Paper className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <Typography variant="h5" >
                        <strong>
                          {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
                          </strong>
                      </Typography>
                      {columnId === 'backlog' && (
                        <button onClick={addTask} className="p-2 m-2 text-black font-bold bg-zinc-300 rounded-2xl">
                          + Add Task
                        </button>
                      )}
                    </div>
                    {tasks.map((task, index) => {
                      if (task.status === columnId) {
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                elevation={3}
                                className={`p-2 mb-2 ${columnId === 'todo' ? 'bg-blue-100' :
                                  columnId === 'doing' ? 'bg-yellow-100' :
                                    columnId === 'scrapped' ? 'bg-red-100' : 'bg-green-100'
                                  } rounded`}
                                onClick={() => openTaskModal(task)} // Open edit dialog on click
                              >
                                <CardContent>
                                  <Typography variant="h6" component="div" className='bold'>
                                    {task.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    <div className='overflow-hidden text-ellipsis'>
                                      {task.description}
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
                            )}
                          </Draggable>
                        );
                      }
                      return null;
                    })}
                    {provided.placeholder}
                  </Paper>
                </Grid>
              )}
            </Droppable>
          ))}
        </Grid>
      </DragDropContext>

      <TaskDialog
        open={isModalOpen}
        onSave={fetchData}
        onClose={closeTaskModal}
        task={selectedTask}
        projectId={projectId}
      />
    </div>
  );
};

export default Home;
