'use client';
import { PostProvider } from 'contexts/Post';
import PostDetails from 'components/posts/PostDetails';
import { Grid } from '@mui/material';

const PostPage = () => {
  return (
    <Grid container spacing={2} justifyContent="space-between">
      <Grid item />
      <PostProvider>
        <PostDetails />
      </PostProvider>
      <Grid item />
    </Grid>
  );
};

export default PostPage;
