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
} from "@mui/material";
import { useEffect, useState } from "react";
import { getProjectUsers } from "@/lib/projects";
import { useSession } from "next-auth/react";

const TaskSettingsDialog = (props: any) => {

  type users = {
    id: string;
    username: string;
    image: string;
  };
  const { data: session } = useSession();
  const { open, onClose, onSave, projectId } = props;
  const taskDetails = props.task;
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [users, setUsers] = useState<users[]>([]);
  const [projectUsers, setProjectUsers] = useState<users[]>([]);
  let [selectedUsers, setSelectedUsers] = useState<users[]>([]); // An array to store selected user IDs

  const getProjectUsersData = async () => {
    if (session?.user?.accessToken) {
      try {
        const data = await getProjectUsers(session.user.accessToken, projectId);
        setProjectUsers(data);
        console.log(data);
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
      }
    }
    if (projectId) {
      getProjectUsersData();
    }
  }, [taskDetails])

  useEffect(() => {
    console.log(selectedUsers);
  }, [selectedUsers]);

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(editedTitle, editedDescription, selectedUsers);
    onClose();
  };


  const handleDeselectUser = (id: any) => {
    console.log("Id from here: ", id);
    setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
  }

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
        <Typography>Assign users:</Typography>
        <FormControl fullWidth>
          <InputLabel id="label-users" className="mt-4">Users</InputLabel>
          <Select
            label="Users"
            multiple
            className="my-4"
            value={selectedUsers}
            onChange={(e) => {
              const selectedUserIds = e.target.value as string[];
              const selectedUserObjects = projectUsers.filter((user) =>
                selectedUserIds.includes(user.id)
              );
              setSelectedUsers(selectedUserObjects);
            }}
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-2">
                {(selected as any[]).map((user) => (
                  <div key={user.id} className="relative">
                    <Avatar
                      src={user.image}
                      alt={user.username}
                      title={user.username}
                    />

                    <span className="absolute top-0 right-0 cursor-pointer">
                      <img
                        src="/images/x-mark.png"
                        alt={user.username}
                        className="w-4 h-4 rounded-full object-cover"
                        onClick={() => handleDeselectUser(user.id)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            )}
          >
            {projectUsers
              .filter((user) => !selectedUsers.some((selectedUser) => selectedUser.id === user.id))
              .map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user.username} (${user.role_name})`}
                </MenuItem>
              ))}
          </Select>

          <div className="flex flex-wrap gap-2">
            {users.map((user) => (
              <div key={user.id}>
                <Avatar src={user.image} alt={user.username} title={`${user.username} (${user.role_name})`} />
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
