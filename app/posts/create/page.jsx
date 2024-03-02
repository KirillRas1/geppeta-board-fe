'use client';
import React, { useContext, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { authContext } from 'contexts/Auth';
import TagList from 'components/tags/TagList';
import { PromptModeTooltip } from 'components/common/dataDisplay/tooltips/PromptModeTooltip';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  content: Yup.string().required('Content is required')
});

const CreatePost = () => {
  const router = useRouter();
  const { apiClient } = useContext(authContext);
  const [tags, setTags] = useState([]);
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      promptMode: 'author'
    },
    title: '',
    content: '',
    promptMode: 'author',
    validationSchema,
    handleSubmit: () => {},
    onSubmit: async values => {
      try {
        const payload = {
          title: values.title,
          chat_role: values.content,
          tags,
          prompt_mode: values.promptMode
        };

        // Make a POST request to the API endpoint
        const response = await apiClient.post('posts/', payload);
        router.push(`/posts/${response?.data.id}`);
      } catch (error) {
        // Handle error, e.g. show an error message
        console.error('Error creating post:', error);
      }
    }
  });

  const handleTagInputKeyPress = event => {
    if (event.key === 'Enter') {
      const newTag = event.target.value.trim();
      if (newTag !== '' && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        event.target.value = ''; // Clear the input field
      }
    }
  };

  const onDeleteTag = tagIndex => {
    const newTagsList = tags.filter((value, index) => index !== tagIndex);
    setTags(newTagsList);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '1rem' }}>
      <Typography variant="h4" style={{ marginBottom: '1rem' }}>
        Create a New Post
      </Typography>
      <ToggleButtonGroup
        color="primary"
        name="promptMode"
        value={formik.values.promptMode}
        exclusive
        onChange={formik.handleChange}
        aria-label="Platform"
      >
        <ToggleButton value="author" name="promptMode">
          <PromptModeTooltip promptMode={'author'}>
            {/* Set formik values explicitly since the tooltip causes the text to no trigger a button click */}
            <span
              value="author"
              onClick={() => formik.setFieldValue('promptMode', 'author')}
            >
              Author Approved
            </span>
          </PromptModeTooltip>
        </ToggleButton>
        <ToggleButton value="score" name="promptMode">
          <PromptModeTooltip promptMode={'score'}>
            <span
              value="author"
              onClick={() => formik.setFieldValue('promptMode', 'score')}
            >
              Score Based
            </span>
          </PromptModeTooltip>
        </ToggleButton>
      </ToggleButtonGroup>
      <TextField
        label="Title"
        fullWidth
        name="title"
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        helperText={formik.touched.title && formik.errors.title}
        error={formik.touched.title && !!formik.errors.title}
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="AI Role"
        fullWidth
        multiline
        rows={4}
        name="content"
        value={formik.values.content}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Write a role for the AI to assume, eg., 'Pretend you are a cowboy'"
        error={formik.touched.content && !!formik.errors.content}
        style={{ marginBottom: '1rem' }}
      />
      <TextField
        label="Tags"
        fullWidth
        name="tags"
        placeholder="Press Enter to add a tag"
        style={{ marginBottom: '1rem' }}
        onKeyDown={handleTagInputKeyPress}
      />
      <TagList tagNames={tags} onDeleteHandler={onDeleteTag} />

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '1rem' }}
        onClick={formik.handleSubmit}
      >
        Create Post
      </Button>
    </Container>
  );
};

export default CreatePost;
