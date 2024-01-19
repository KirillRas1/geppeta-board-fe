import React, { useState, useContext } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { authContext } from 'contexts/Auth';

const ScoreButtons = ({ foreignKey, scoreType, initialScore, initialTotalScore, mini=false }) => {
  const [score, setScore] = useState(initialScore);
  const [totalScore, setTotalScore] = useState(initialTotalScore)
  const { apiClient } = useContext(authContext);

  const createScore = targetScore => {
    apiClient
      .post(`/${scoreType}_score/`, {
        [scoreType]: foreignKey,
        upvote: targetScore === 1 ? true : false
      })
      .then(() => {
        setScore(targetScore)
        console.log(targetScore)
        setTotalScore(totalScore+targetScore)
      })
      .catch(error => {
        setScore(0);
      });
  };

  const updateScore = () => {
    apiClient
      .patch(`/${scoreType}_score/`, {
        params: { [scoreType]: foreignKey },
        upvote: score === 1 ? false : true,
        [scoreType]: foreignKey
      })
      .then(response => {
        setScore(-score);
        setTotalScore(totalScore-2*score)
      });
  };

  const deleteScore = () => {
    apiClient
      .delete(`/${scoreType}_score/`, {
        params: { [scoreType]: foreignKey }
      })
      .then(response => {
        setScore(0);
        setTotalScore(initialScore)
      });
  };

  const handleScoreClick = targetScore => () => {
    if (score === targetScore) {
      deleteScore();
    } else if (score === -targetScore) {
      updateScore();
    } else {
      createScore(targetScore);
    }
  };

  const renderTotalScore = total_score => {
    return (
      <Typography variant={mini ? "h6" : "h5"} alignSelf="center">
        {total_score}
      </Typography>
    );
  };

  return (
    <Grid display="flex">
    <Grid container alignSelf="center" width="fit-content" direction="column">
      <ThumbUpIcon
        color={score === 1 ? 'primary' : undefined}
        onClick={handleScoreClick(1)}
        fontSize={mini ? 's' : undefined}
      />
      <ThumbDownIcon
        color={score === -1 ? 'primary' : undefined}
        onClick={handleScoreClick(-1)}
        fontSize={mini ? 's' : undefined}
      />
    </Grid>
    {renderTotalScore(totalScore)}
    </Grid>
  );
};

export default ScoreButtons;
