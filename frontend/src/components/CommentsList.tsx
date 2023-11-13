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
            primary={comment.text}
            secondary={
              <>
                <Typography variant="subtitle1" component="span">
                  {comment.author.first_name || "Unknown"} {comment.author.last_name || "Unknown"}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="span" sx={{ marginLeft: 1 }}>
                  @{comment.author.username || "unknown"}
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
