'use client';
import React, { useState, useContext, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import { authContext } from 'contexts/Auth';

function ProfileDisplayName() {
  const { displayName, userId, setDisplayName } = useContext(authContext);
  const { apiClient } = useContext(authContext);
  const [originalText, setOriginalText] = useState('');
  const [editedText, setEditedText] = useState('');
  const [error, setError] = useState(null); // New state for error

  useEffect(() => {
    setOriginalText(displayName || '');
    setEditedText(displayName || '');
  }, [displayName]);

  const handleSubmitClick = () => {
    if (editedText !== originalText) {
      apiClient
        .patch(`users/${displayName}/`, {
          name: editedText
        })
        .then(response => {
          setOriginalText(editedText);
          setDisplayName(editedText);
          setError(null); // Clear any previous errors
        })
        .catch(error => {
          setEditedText(originalText);
          setError(error.response.data?.name); // Set the error message from the server
        });
    }
  };

  const handleChange = event => {
    setEditedText(event.target.value);
    setError(null); // Clear error when text is changed
  };

  return (
    <Grid container alignItems="center" direction="column">
      <Typography variant="caption">Profile:</Typography>
      <Grid container direction="row" wrap="nowrap" width="90%">
        <>
          <TextField
            fullWidth
            value={editedText}
            onChange={handleChange}
            variant="standard"
            error={!!error} // Set error prop based on whether there is an error
            helperText={error} // Display error message
          />
          <IconButton onClick={handleSubmitClick} aria-label="Edit">
            <DoneIcon />
          </IconButton>
        </>
      </Grid>
    </Grid>
  );
}

export default ProfileDisplayName;
