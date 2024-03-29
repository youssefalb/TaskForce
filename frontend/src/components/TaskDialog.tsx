import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,

  FormControl,
  Avatar,
  Autocomplete,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getProjectUsers, updateTaskData, addTask, deleteTask,
  getTaskComments, createTaskComment
} from "@/lib/projects";
import { useSession } from "next-auth/react";
import AddComment from "./AddComment";
import CommentsList from "./CommentsList";

const TaskDialog = (props: any) => {


  type users = {
    id: string;
    username: string;
    image: string;
    role_name: string;
  };




  const { data: session } = useSession();
  const { open, onClose, onSave, task, projectId, checkPermission } = props;
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<users[]>([]);
  const [deadline, setDeadline] = useState('');
  const [taskComments, setTaskComments] = useState<any[]>([]);
  let canUpdateTask = checkPermission('update_task');
  let canDeleteTask = checkPermission('delete_task');
  let canAddTask = checkPermission('add_task');




  function changeProjectUsersBody(projectUsers: any[]) {
    return projectUsers.map((user) => {
      return {
        id: user.user,
        image: user.image,
        role_name: user.role_name,
        username: user.username
      };
    });
  }

const getProjectUsersData = async () => {
    if (session?.user?.accessToken) {
      try {
        const data = await getProjectUsers(session.user.accessToken, projectId);
        setProjectUsers(changeProjectUsersBody(data));
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Access token or user ID is undefined.");
    }
  };


  const fetchTaskComments = async () => {
    if (session?.user?.accessToken && task?.id) {
      try {
        const data = await getTaskComments(session.user.accessToken, projectId, task.id);
        setTaskComments(data);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Access token or user ID is undefined.");
    }
  }
  useEffect(() => {
    if (projectId) {
      getProjectUsersData();
    }
    if (task) {
      setEditedTitle(task?.title);
      setEditedDescription(task?.description);
      setDeadline(task?.deadline);
      setSelectedUsers(task?.users);
      fetchTaskComments();
    }
    else {
      setEditedTitle("");
      setEditedDescription("");
      setDeadline("");
      setSelectedUsers([]);
    }

  }, [task]);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    if (task?.id && session?.user?.accessToken) {
      try {
        const response = await deleteTask(session.user.accessToken, task?.id);
      }
      catch (error) {
        console.error(error);
      }
      onClose();
    }
  };


  const handleSave = async () => {

    try {
      if (session?.user?.accessToken) {
        const selectedUserIds = selectedUsers.map(user => user.id);
        onSave();
        if (task?.id) {
          const response = await updateTaskData(
            session?.user?.accessToken,
            task.id,
            editedTitle,
            editedDescription,
            deadline,
            selectedUserIds
          );
        } else {

          const response = await addTask(
            session?.user?.accessToken,
            projectId,
            editedTitle,
            editedDescription,
            deadline,
            selectedUserIds
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
    onSave();
    onClose();
  };


  const handleDeselectUser = (id) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== id)
    );
  };

  const handleAddComment = async (comment) => {
    if (session?.user && task?.id)
      await createTaskComment(session.user?.accessToken, projectId, task.id, comment, session?.user?.id);
      fetchTaskComments();
  };


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{task?.id ? 'Edit Task Details' : 'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ m: 2 }}
          disabled={(!canUpdateTask && task?.id) || (!canAddTask && !task?.id)}
          label="Title"
          fullWidth
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <TextField
          label="Description"
          sx={{ m: 2 }}
          disabled={(!canUpdateTask && task?.id) || (!canAddTask && !task?.id)}
          fullWidth
          multiline
          rows={5}
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />

        <TextField
          label="Deadline"
          fullWidth
          disabled={(!canUpdateTask && task?.id) || (!canAddTask && !task?.id)}
          sx={{ m: 2 }}
          InputLabelProps={{ shrink: true }}
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <FormControl fullWidth>
          <Autocomplete
            multiple
            disabled={(!canUpdateTask && task?.id) || (!canAddTask && !task?.id)}
            fullWidth
            sx={{ m: 2 }}
            id="user-select"
            disableClearable={true}
            options={projectUsers}
            getOptionLabel={(user) => `${user.username} (${user.role_name})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedUsers}
            getOptionDisabled={(option) => selectedUsers.some((user) => user.id === option.id)}
            onChange={(event, newValue) => {
              setSelectedUsers(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={(!canUpdateTask && task?.id) || (!canAddTask && !task?.id)}
                label="Users"
                fullWidth
              />
            )}
          />


            {selectedUsers.length > 0 &&  (selectedUsers.map((user) => (
            <div className="flex flex-wrap gap-2 m-4">

              <div key={user.id} className="relative">
                <Avatar src={user.image} alt={user.username} title={`${user.username} (${user.role_name})`} />
                <div className="absolute top-0 right-0 cursor-pointer">
                  <img
                    src="/images/x-mark.png"
                    alt={user.username}
                    className="w-4 h-4 rounded-full object-cover"
                    onClick={() => handleDeselectUser(user.id)}
                  />
                </div>
              </div>
            </div>
            )))}

        </FormControl>


        {task?.id && (
          <Box sx={{ m: 2 }}>
            <AddComment handleAddComment={handleAddComment} />

            {taskComments.length > 0 &&
              (<CommentsList comments={taskComments} />)
            }
          </Box>
        )}

      </DialogContent>
      <DialogActions>
        {task?.id && (
          <Button onClick={handleDelete} disabled={!canDeleteTask} color="error">
            Delete
          </Button>)
        }
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={(!canUpdateTask && task?.id) || (!canAddTask && !task?.id)}
          color="primary">
          Save
        </Button>


      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
