import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  Avatar,
  Autocomplete,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getProjectUsers, updateTaskData, addTask } from "@/lib/projects";
import { useSession } from "next-auth/react";

const TaskDialog = (props: any) => {


  type users = {
    id: string;
    username: string;
    image: string;
    role_name: string;
  };


  const { data: session } = useSession();
  const { open, onClose, onSave, action, task, projectId } = props;

  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<users[]>([]);
  const [deadline, setDeadline] = useState(''); 




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
        console.log('************************************************* Project Users: ', projectUsers);
        console.log('Project Users: ', data);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Access token or user ID is undefined.");
    }
  };



  useEffect(() => {
    console.log("Task form Dialouge: ", task);
    if (task) {
      setEditedTitle(task?.title);
      setEditedDescription(task?.description);
      setDeadline(task?.deadline);
      setSelectedUsers(task?.users);
    }
    else {
      setEditedTitle("");
      setEditedDescription("");
      setDeadline("");
      setSelectedUsers([]);
    }
      if (projectId) {
        getProjectUsersData();
        console.log("Project Users: ", projectUsers);
      }


  }, [task, action]);

  useEffect(() => {
    console.log("Task: ", task);
  }, [task]);

  const handleClose = () => {
    onClose();
  };


  const handleSave = async () => {
    // Make an API request to save or update the task here.
    // You need to create functions like createTask and updateTaskData in your backend to handle these operations.
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
        console.log('Response:', response);
      } else {
        console.log('Task ID: ', task?.id);
        console.log('Deadline: ', deadline);
        const response = await addTask(
          session?.user?.accessToken,
          projectId,
          editedTitle,
          editedDescription,
          deadline,
          selectedUserIds
        );
        console.log('Response:', response);
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

return (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{task?.id ? 'Edit Task Details' : 'Add Task'}</DialogTitle>
    <DialogContent>
      <TextField
        sx = {{m: 2}}
        label="Title"
        fullWidth
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
      />
      <TextField
        label="Description"
        sx = {{m: 2}}
        fullWidth
        multiline
        value={editedDescription}
        onChange={(e) => setEditedDescription(e.target.value)}
      />

      <TextField
        label="Deadline"
        className="my-4"
        fullWidth
        sx = {{m: 2}}
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <FormControl fullWidth>
        <Autocomplete
          multiple
          sx = {{m: 2}}
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
              label="Users"
              fullWidth
            />
          )}
        />


        <div className="flex flex-wrap gap-2 m-4">
          {selectedUsers.map((user) => (
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
          ))}

        </div>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Cancel
      </Button>
      <Button onClick={handleSave} color="primary">
        Save
      </Button>
    </DialogActions>
  </Dialog>
);
};

export default TaskDialog;