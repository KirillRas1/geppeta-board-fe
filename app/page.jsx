'use client';
import React from 'react';
import PostList from 'components/posts/PostList';
import { PostProvider } from 'contexts/Post';
const PostsPage = () => {
  return (
    <PostProvider>
      <PostList />
    </PostProvider>
  );
};

export default PostsPage;
