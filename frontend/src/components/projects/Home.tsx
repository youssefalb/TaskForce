import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Card, CardContent, Avatar } from '@mui/material';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';
import { useSession } from 'next-auth/react';
import { getProjectTasks } from '@/lib/projects';

const Home = ({ projectId }: any) => {
  type Task = {
    id: string;
    title: string;
    status: string;
    description: string;
    users : {
      id: string;
      username: string;
      image: string;
    }[];

  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.accessToken) {
        try {
          const data = await getProjectTasks(session.user.accessToken, projectId);
          // Assign a unique ID to each task
          const tasksWithUniqueIds = data.map((task, index) => ({ ...task, id: `task-${index}` }));
          setTasks(tasksWithUniqueIds);
          console.log('Response Data', data);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error('Access token or user ID is undefined.');
      }
    };
    fetchData();
  }, [session, projectId]);

  const onDragEnd = (result: any) => {
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
  };

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Task Management
        </Typography>

        <Grid container spacing={0.5} style={{ display: 'flex'}}>
          {['backlog', 'todo', 'doing', 'done', 'scrapped'].map((columnId) => (
            <Droppable key={columnId} droppableId={columnId} type="task">
              {(provided) => (
                <Grid item xs={2.4} ref={provided.innerRef}>
                  <Paper className="p-4">
                    <Typography variant="h6" className="text-lg font-semibold mb-4">
                      {columnId}
                    </Typography>
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
                                className={`p-2 mb-2 ${
                                  columnId === 'todo' ? 'bg-blue-100' :
                                  columnId === 'doing' ? 'bg-yellow-100' :
                                  columnId === 'scrapped' ? 'bg-red-100' : 'bg-green-100'
                                } rounded`}
                              >
                                <CardContent>
                                  <Typography variant="h6" component="div">
                                    {task.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {task.description}
                                  </Typography>
                                  <div>
                                      {task.users.map((user) => (
                                      <div key={user.id}>
                                        <Avatar src={user.image} alt={user.username}  title={user.username}/>
                                      </div>
                                    ))}
                                  </div>
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
    </Container>
  );
};

export default Home;
