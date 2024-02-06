import React from "react";
import { Grid, IconButton, Typography, Slider, Box } from "@mui/material";
import {
  SkipPrevious,
  SkipNext,
  PlayCircleOutline,
  PauseCircleOutline,
} from "@mui/icons-material";

const AudioPlayer = ({
    isDarkMode,
  currentTime,
  duration,
  isPlaying,
  handlePrevious,
  handleNext,
  handleSliderChange,
  handlePlayPause,
  selectedAudio,
}) => {
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const sliderValue = isNaN(currentTime) ? 0 : currentTime;
  const sliderMax = isNaN(duration) ? 0 : duration;

return (
  <Grid container spacing={2} alignItems="center" direction="column" marginTop='5px'>
    <Grid item xs style={{ width: "50%" }}>
      <Typography
        variant="body2"
        color="textSecondary"
        style={{ color: isDarkMode ? "#FFFFFF" : "" }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </Typography>
      <Slider
        value={sliderValue}
        max={sliderMax}
        onChange={handleSliderChange}
        aria-labelledby="continuous-slider"
      />
    </Grid>
    <Grid
      item
      container
      spacing={2}
      justifyContent="center"
      style={{ width: "100vw" }}
    >
      <Grid item>
        <IconButton
          onClick={handlePrevious}
          style={{ color: isDarkMode ? "#FFFFFF" : "" }}
        >
          <SkipPrevious />
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? (
            <PauseCircleOutline
              style={{ color: isDarkMode ? "#FFFFFF" : "" }}
            />
          ) : (
            <PlayCircleOutline style={{ color: isDarkMode ? "#FFFFFF" : "" }} />
          )}
        </IconButton>
      </Grid>
      <Grid item>
        <IconButton
          onClick={handleNext}
          style={{ color: isDarkMode ? "#FFFFFF" : "" }}
        >
          <SkipNext />
        </IconButton>
      </Grid>
    </Grid>
  </Grid>
);

};

export default AudioPlayer;
