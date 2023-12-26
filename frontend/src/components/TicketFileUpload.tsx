import React, { useState, useCallback } from 'react';
import { Box, Button, List, Grid, Paper, Typography, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useDropzone } from 'react-dropzone';


const getFileIcon = (fileName) => {
    if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        return <ImageIcon />;
    } else if (fileName.endsWith('.pdf')) {
        return <PictureAsPdfIcon />;
    } else if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
        return <DescriptionIcon />;
    } else if (fileName.endsWith('.zip')) {
        return <FolderZipIcon />;
    } else {
        return <InsertDriveFileIcon />;
    }
};



const TicketFileUpload = ({ files, onFileUpload, onFileDelete, ticketId }) => {
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (files) => {
        setUploading(true);

        for (let file of files) {
            const formData = new FormData();
            formData.append('file: ', file);
            formData.append('ticketId: ', ticketId);
            console.log('Uploading file: ', file);
            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                
                console.log('File uploaded:', data);
                onFileUpload(data.url, file.name);
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }

        setUploading(false);
    }, [onFileUpload, ticketId]);

    const downloadFile = async (url, filename) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            // Clean up and revoke the object URL
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    console.log('files in comp:', files);
    return (
        <Box>
            <div {...getRootProps()} style={{ border: '1px dashed black', padding: '20px', textAlign: 'center' }}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop files here, or click to select files</p>
                <CloudUploadIcon style={{ fontSize: '48px' }} />
            </div>


            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {files.map((file, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => downloadFile(file.file_url, file.name)}>
                            <Box >
                                <Typography variant="body1" gutterBottom style={{ margin: '10px' }} m={1}>
                                    {getFileIcon(file.name)}
                                    <span style={{ marginLeft: '10px' }}>{file.name}</span>
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Click to open
                                </Typography>
                            <IconButton aria-label="delete" onClick={(e) => { e.stopPropagation(); onFileDelete(file); }}>
                                <DeleteIcon />
                            </IconButton>
                            </Box>

                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {uploading && <p>Uploading...</p>}
        </Box>
    );
};

export default TicketFileUpload;
