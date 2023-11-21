import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Avatar, Button, Modal } from '@mui/material';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import { changeTaskStatus, getProjectTasks } from '@/lib/projects';
import TaskDialog from '../TaskDialog';
import LoadingComponent from '../LoadingComponent';
import TaskCard from '../TaskCard';
const Home = ({ projectId, permissions }: any) => {
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

  const checkPermission = (permission: string) => {
    console.log('Checking permission: ', permissions);
    return permissions?.includes(permission);

  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    if (session?.user?.accessToken) {
      try {
        setIsLoading(true);
        const data = await getProjectTasks(session.user.accessToken, projectId);

        const tasksWithStringsIds = data.map((task: Task) => ({
          ...task,
          id: task.id.toString(),
        }));
        setTasks(tasksWithStringsIds);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    } else {
      console.error('Access token or user ID is undefined.');
      setIsLoading(false);

    }
  };

  useEffect(() => {

    fetchData();
  }, [session, selectedTask, projectId]);


  const addTask = () => {
    setSelectedTask(null);
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

    setTasks(updatedTasks);
    await changeTaskStatus(session?.user?.accessToken, draggedTask.id, result.destination.droppableId)
      .then((data) => {
        console.log(updatedTasks);
      })
      .catch((error) => {
        console.error('Error changing task status:', error);
      });
  };

  const openTaskModal = (task: Task) => {

    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    fetchData();
  };


  if (isLoading) {
    return <LoadingComponent />;
  }

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
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
                          <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={!checkPermission('update_task')}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <TaskCard
                                  task={task}
                                  openTaskModal={openTaskModal}
                                  checkPermission={checkPermission}
                                />
                              </div>
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
        checkPermission={checkPermission}
      />
    </div>
  );
};

export default Home;
