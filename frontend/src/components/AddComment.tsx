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
    console.log('Comment: ', comment);  
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
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}  disabled={!comment.trim()}>
        Post
      </Button>
      </Box>
    </Box>
  );
};

export default AddComment;
