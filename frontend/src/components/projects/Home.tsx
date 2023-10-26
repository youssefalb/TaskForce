import React, { useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

const initialTasks = [
  { id: 'task-1', content: 'Task 1', status: 'Todo' },
  { id: 'task-2', content: 'Task 2', status: 'Todo' },
  { id: 'task-3', content: 'Task 3', status: 'Doing' },
  { id: 'task-4', content: 'Task 4', status: 'Done' },
];

const Home = () => {
  const [tasks, setTasks] = useState(initialTasks);

const onDragEnd = (result) => {
    console.log("Testttttttttttttttttttttttttttt");
    console.log("Tasks:", tasks);
  if (!result.destination) {
    return;
  }
  console.log(result);
  const updatedTasks = Array.from(tasks);
  const [draggedTask] = updatedTasks.splice(result.source.index, 1);
  updatedTasks.splice(result.destination.index, 0, {
    ...draggedTask,
    status: result.destination.droppableId,
  });

  setTasks(updatedTasks);
  console.log("Updated Tasks: ", updatedTasks);
};


  return (

    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Task Management
      </Typography>

      <Grid container spacing={3}>
        <Droppable droppableId="Todo" type="task">
          {(provided) => (
            <Grid item xs={4} ref={provided.innerRef}>
              <Paper elevation={3} className="task-column">
                <Typography variant="h6">Todo</Typography>
                {tasks.map((task, index) => {
                  if (task.status === 'Todo') {
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={1}
                            className="task-item"
                          >
                            {task.content}
                          </Paper>
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

        <Droppable droppableId="Doing" type="task">
          {(provided) => (
            <Grid item xs={4} ref={provided.innerRef}>
              <Paper elevation={3} className="task-column">
                <Typography variant="h6">Doing</Typography>
                {tasks.map((task, index) => {
                  if (task.status === 'Doing') {
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={1}
                            className="task-item"
                          >
                            {task.content}
                          </Paper>
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

        <Droppable droppableId="Done" type="task">
          {(provided) => (
            <Grid item xs={4} ref={provided.innerRef}>
              <Paper elevation={3} className="task-column">
                <Typography variant="h6">Done</Typography>
                {tasks.map((task, index) => {
                  if (task.status === 'Done') {
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={1}
                            className="task-item"
                          >
                            {task.content}
                          </Paper>
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
      </Grid>
      </DragDropContext>
    </Container>
  );
};

export default Home;
