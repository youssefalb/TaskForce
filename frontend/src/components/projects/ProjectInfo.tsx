import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    CardMedia,
    Input,
    Select,
    MenuItem,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import CustomButton from '../CustomButton';
import { useSession } from 'next-auth/react';
import { deleteProject, updateProjectDetails } from '@/lib/projects';
import { useRouter } from 'next/router';


const ProjectInfo = ({ details, fetchData, permissions}: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedDetails, setEditedDetails] = useState({ ...details });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [openBanDialog, setOpenBanDialog] = useState(false);
    const router = useRouter();

    const { data: session } = useSession();
    const canEditProject = permissions?.includes('change_project');
    const canDeleteProject = permissions?.includes('delete_project');
    const statusChoices = {
        not_started: 'Not Started',
        in_progress: 'In Progress',
        on_hold: 'On Hold',
        completed: 'Completed',
        cancelled: 'Cancelled',
        failed: 'Failed',
        pending_approval: 'Pending Approval',
        under_review: 'Under Review',
        needs_attention: 'Needs Attention',
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };
    const handleDeleteClick = () => {
        setOpenBanDialog(true);
    };
    const handleDeleteProject = () => {
        if (session?.user?.accessToken && details?.id) {
            deleteProject(session.user.accessToken, details.id)
                .then((data) => { console.log(data); fetchData(); })
                .catch((error) => console.error(error));
                router.push('/');
        }
    };

    const handleSaveClick = () => {
        console.log('Handle save click tutaj');
        uppdateProject();
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setEditedDetails({ ...details });
        setSelectedImage(null);
        setIsEditing(false);
    };

    const uppdateProject = () => {

        if (session?.user?.accessToken) {
            updateProjectDetails(session.user.accessToken, editedDetails)
                .then((data) => { console.log(data); fetchData(); })
                .catch((error) => console.error(error));
        }

        console.log(editedDetails);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedDetails({
            ...editedDetails,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        console.log('Handle image change tutaj');
    };

    return (
        <div>
            <div className="relative">
                <img
                    src="https://picsum.photos/900"
                    alt="Cover"
                    className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
            </div>
            <div className="relative mx-auto -mt-16 w-32 h-32 rounded-full overflow-hidden border-4 border-white hover:cursor-pointer">
                <label htmlFor="profileImageInput" className="w-full h-full">
                    <img
                        src={details?.image}
                        alt={details?.title}
                        className="w-full h-full object-cover"
                    />
                    <input
                        id="profileImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </label>
            </div>
            <Typography variant="h4" sx={{ m: 2 }}
            >Project Info</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={editedDetails.title}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        multiline
                        rows={4}
                        value={editedDetails.description}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />

                </Grid>
                <Grid item xs={12}>
                      <InputLabel id='status-label'>Status</InputLabel>
                    <Select
                        fullWidth
                        labelId='status-label'
                        name="status"
                        value={editedDetails.status}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    >
                        {Object.keys(statusChoices).map((value) => (
                            <MenuItem key={value} value={value}>
                                {statusChoices[value]}
                            </MenuItem>
                        ))}
                    </Select>
                </Grid>

            </Grid>
            {isEditing ? (
                <div className='flex justify-center'>
                    <CustomButton buttonText="Save" onClick={handleSaveClick} color="gray" width="twelve" />
                    <CustomButton buttonText="Cancel" onClick={handleCancelClick} color="red" width="twelve" />
                </div>
            ) : (
                <div className="flex justify-center">
                    {canEditProject && (<CustomButton onClick={handleEditClick} buttonText="Edit" color="gray" width="twelve" />)}
                    {canDeleteProject && (<CustomButton onClick={handleDeleteClick} buttonText="Delete" color="red" width="twelve" />) }

                </div>
            )}


    <Dialog open={openBanDialog} onClose={() => setOpenBanDialog(false)}>
        <DialogTitle>{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to delete this Project? This action cannot be undone.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBanDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteProject} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

        </div>
    );
};

export default ProjectInfo;
