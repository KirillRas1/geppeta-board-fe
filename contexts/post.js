import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from 'infrastructure/apiClient';

export const postContext = createContext();

export const PostProvider = ({ children }) => {
  const router = useRouter();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [commentLikes, setCommentLikes] = useState([]);

  const getPostComments = postId => {
    apiClient.get(`comments/`, { params: { post: postId } }).then(response => {
      setComments(response.data);
    });
  };

  const getPost = () => {
    apiClient
      .get(`posts/${router.query.id}/`)
      .then(response => {
        setPost(response.data);
        getPostComments(router.query.id);
      })
      .catch(error => console.error('Error fetching post:', error));
  };

  useEffect(() => {
    if (router.isReady) {
      getPost();
    }
  }, [router.isReady]);

  const { Provider } = postContext;
  return (
    <Provider value={{ post, comments, setComments, getPost, getPostComments }}>
      {children}
    </Provider>
  );
};
