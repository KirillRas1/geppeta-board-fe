'use client';
import React, { useState, useEffect, useContext } from 'react';
import { authContext } from 'contexts/Auth';
import { useRouter } from 'next/navigation';
import { CommentList } from 'components/comments/Comment';
import { PostProvider } from 'contexts/Post';
import { Typography } from '@mui/material';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const { apiClient } = useContext(authContext);

  const router = useRouter();

  useEffect(() => {
    // Fetch the list of posts using Axios when the component mounts
    if (router.isReady) {
      apiClient
        .get('/comments/', { params: router.query })
        .then(response => {
          setComments(response.data);
        })
        .catch(error => console.error('Error fetching posts:', error));
    }
  }, [router.query, router.isReady]);

  if (!comments) {
    return <p>Loading...</p>;
  }

  return (
    <PostProvider>
      <Typography>Comments</Typography>
      <CommentList comments={comments} readOnly />
    </PostProvider>
  );
};

export default CommentsPage;
