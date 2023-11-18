import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

interface AddCommentProps {
  onAddComment: (comment: string) => void;
}

const AddComment =  ({ handleAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(handleAddComment);
    handleAddComment(comment);
    setComment('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="comment"
        label="Add a comment"
        name="comment"
        autoComplete="off"
        multiline
        autoFocus
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ width: "50%" }}
      />
      <Box>
    <Button 
        type="submit" 
        variant="contained"
        style={{
            color: 'black', 
            padding: '10px 20px', 
            borderRadius: '5px', 
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)', 
            fontWeight: 'bold', 
            fontSize: '16px', 
        }}

        sx={{ 
            mt: 3, 
            mb: 2,
        }}  
        disabled={!comment.trim()}
    >
        Post
    </Button>
      </Box>
    </Box>
  );
};

export default AddComment;
