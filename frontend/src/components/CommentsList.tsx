// CommentsList.tsx
import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';



const CommentsList = ({ comments }) => {

  console.log('Comments list from comp: ', comments);
  return (
    <List>
      {comments.map((comment) => (
        <ListItem alignItems="flex-start" key={comment.id}>
          <ListItemAvatar>
            <Avatar alt={`${comment.author.first_name} ${comment.author.last_name}`} src={comment.author.image || "/static/images/avatar/1.jpg"} />
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'bold' }}>
                  {comment.author.first_name || "Unknown"} {comment.author.last_name || "Unknown"}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="span" sx={{ marginLeft: 1 }}>
                  @{comment.author.username || "unknown"}
                </Typography>
              </>}
            secondary={
              <>
                  <Typography variant="body1" color="textPrimary" component="div">
                            {comment.text}
                  </Typography>
                <Typography variant="body2" color="textSecondary" component="div" sx={{ marginTop: 1 }}>
                  {new Date(comment.created_at).toLocaleDateString("en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default CommentsList;
