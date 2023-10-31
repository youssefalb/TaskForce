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
import { getProjectUsers, updateTaskData} from "@/lib/projects";
import { useSession } from "next-auth/react";

const TaskSettingsDialog = (props: any) => {

  type users = {
    id: string;
    username: string;
    image: string;
    role_name: string;
  };


  const { data: session } = useSession();
  const { open, onClose, onSave, projectId } = props;
  const taskDetails = props.task;
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [taskUsers, setUsers] = useState<users[]>([]);
  const [projectUsers, setProjectUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<users[]>([]);



function changeProjectUsersBody(projectUsers: any[]) {
  return projectUsers.map((user) => {
    console.log("User: ", user);
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
    if (taskDetails) {
      setEditedTitle(taskDetails.title || "");
      setEditedDescription(taskDetails.description || "");
      if (taskDetails.users) {
        setUsers(taskDetails.users);
        setSelectedUsers(taskDetails.users);
        console.log("Task Users: ", taskDetails.users);
        if (projectId) {
          getProjectUsersData();
          console.log("Project Users: ", projectUsers);
        }
      }

      console.log("Selected Users: ", selectedUsers);
    }

  }, [taskDetails]);






  useEffect(() => {
    console.log(selectedUsers);
  }, [selectedUsers]);


  const handleClose = () => {
    onClose();
  };


  const handleSave = async () => {

    try {
      if (session?.user?.accessToken) {
        const selectedUserIds = selectedUsers.map(user => user.id);
        console.log("Selected User Ids: ", selectedUserIds);
       const response = await updateTaskData(session?.user?.accessToken, taskDetails.id, editedTitle, editedDescription, selectedUserIds);
        console.log("Response: ", response);
        onSave();
      }
    } catch (error) {
      console.error(error);
    }
    onClose();
  };


  const handleDeselectUser = (id) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user.id !== id)
    );
    
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Task Details</DialogTitle>
      <DialogContent>
        <TextField
          className="my-4"
          label="Title"
          fullWidth
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <TextField
          label="Description"
          className="my-4"
          fullWidth
          multiline
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
        />
        <FormControl fullWidth>
          <Autocomplete
            multiple
            id="user-select"
            disableClearable={true} 
            options={projectUsers}
            getOptionLabel={(user) => `${user.username} (${user.role_name})`}
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
  

          <div className="flex flex-wrap gap-2 mt-4">
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

export default TaskSettingsDialog;
