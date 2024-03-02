import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import Comment, { CommentList } from 'components/comments/Comment';
import { Grid, List, ListItem } from '@mui/material';
import { Button, Typography } from '@mui/material';

import { postContext } from 'contexts/Post';
import CircleIcon from '@mui/icons-material/Circle';
import CommentInput from 'components/comments/CommentInput';
import TagList from 'components/tags/TagList';
import { PromptModeTooltip } from 'components/common/dataDisplay/tooltips/PromptModeTooltip';
import { authContext } from 'contexts/Auth';

const styles = {
  container: {
    width: '70%',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  closeButton: {
    marginBottom: '10px'
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  content: {
    marginBottom: '20px'
  },
  commentInput: {
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#888',
    fontStyle: 'italic'
  }
};

const PostDetails = () => {
  const router = useRouter();
  const { post, comments } = useContext(postContext);
  const { id: postId, title, author, content, chat_role, prompt_mode } = post;
  const { displayName } = useContext(authContext);
  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <Grid style={styles.container}>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => router.back()}
        style={styles.closeButton}
      >
        Close Post
      </Button>
      <div style={styles.titleWrapper}>
        <Typography variant="h2" style={styles.title}>
          {title}
        </Typography>
        <CircleIcon
          sx={{ fontSize: '30%', paddingRight: '1%', paddingLeft: '1%' }}
        />
        <Typography variant="subtitle1" style={styles.subtitle}>
          {author}
        </Typography>
        <CircleIcon
          sx={{ fontSize: '30%', paddingRight: '1%', paddingLeft: '1%' }}
        />
        <Typography variant="subtitle1" style={styles.subtitle}>
          <PromptModeTooltip promptMode={prompt_mode}>
            {prompt_mode === 'score'
              ? 'Score Based Prompting'
              : 'Author based prompting'}
          </PromptModeTooltip>
        </Typography>
      </div>
      <Typography variant="subtitle1">{chat_role}</Typography>
      <Typography variant="body1" style={styles.content}>
        {content}
      </Typography>
      <TagList tagNames={post.tags || []} />
      <CommentList
        comments={comments}
        isPostAuthor={displayName === author}
        isAuthorMode={prompt_mode === 'author'}
      />
      <CommentInput postId={postId} />
    </Grid>
  );
};

export default PostDetails;
