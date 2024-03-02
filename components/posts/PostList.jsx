'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Typography, List, ListItem, Grid, Pagination } from '@mui/material';
import PostMini from 'components/posts/PostMini';
import { Button } from '@mui/material';
import DataHandlingMenu from 'components/dataManipulation/DataManipulationMenu';
import {
  sortById,
  sortByScore
} from 'components/dataManipulation/SortFunctions';
import { getTimeThresholdsDict } from 'functions/formatting/time';
import { filterOlderThan } from 'components/dataManipulation/FilterFunctions';
import { postContext } from 'contexts/Post';
import { authContext } from 'contexts/Auth';
import Link from 'next/link';

const POSTS_PER_PAGE = 20;

const PostList = () => {
  const { apiClient, loginStatus } = useContext(authContext);
  const { page, setPage, totalPages, setTotalPages, posts, setPosts } =
    useContext(postContext);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  useEffect(() => {
    setFilteredPosts(posts);
  }, [posts]);

  useEffect(() => {
    async function getPosts() {
      const postsUrl = page === null ? '/posts/' : `/posts/?page=${page}`;
      const postsResponse = await apiClient.get(postsUrl);
      const posts = postsResponse?.data?.results || [];
      setTotalPages(Math.ceil(postsResponse.data.count / POSTS_PER_PAGE));
      const postDict = {};
      posts.forEach(post => {
        postDict[post.id] = post;
      });
      const scoreResponse = await apiClient.get(
        `/post_score/?post__in=${Object.keys(postDict).join(',')}`
      );
      scoreResponse.data.forEach(score => {
        postDict[score.post].user_score = score.upvote ? 1 : -1;
      });
      return postDict;
    }
    getPosts().then(postDict => {
      setPosts(Object.values(postDict));
    });
  }, [page, loginStatus]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const sortingOptions = [
    {
      name: 'Sort by posting time',
      sideEffect: () => {
        setPosts(sortById(posts));
      }
    },
    {
      name: 'Sort by score',
      sideEffect: () => {
        setPosts(sortByScore);
      }
    }
  ];

  const filteringOptions = useMemo(
    () =>
      getTimeThresholdsDict().map(thresholdDict => ({
        name: thresholdDict.name,
        sideEffect: () => {
          setFilteredPosts(filterOlderThan(posts, thresholdDict.time));
        }
      })),
    [posts]
  );

  if (!posts) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Grid container alignItems="center" flexDirection="column">
      <Grid container direction="row" width="fit-content">
        <DataHandlingMenu items={sortingOptions} label={'Sort'} />
        <Link href="/posts/create">
          <Button variant="contained" color="primary">
            Create new post
          </Button>
        </Link>
        <DataHandlingMenu items={filteringOptions} label={'Filter'} />
      </Grid>

      <Grid>
        <List>
          {filteredPosts.map(post => (
            <ListItem key={post.id}>
              <PostMini post={post} />
            </ListItem>
          ))}
        </List>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </Grid>
    </Grid>
  );
};

export default PostList;
