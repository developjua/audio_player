import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import { PlayCircleOutline, PauseCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";


const SongList = ({
  isDarkMode,
  audioFiles,
  currentlyPlayingIndex,
  isPlaying,
  handlePlayPause,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: isDarkMode ? "#37474F" : "",
        padding: "16px",
        borderRadius: "8px",
        maxHeight: "300px", 
        overflowY: audioFiles.length > 5? "auto" : "initial", 
        scrollBehavior: "smooth", 
      }}
    >
      {audioFiles.length === 0 ? (
        <div>
          <p style={{ color: isDarkMode ? "#FFFFFF" : "#263238" }}>
            No songs found. Go back to the home page to upload.
          </p>
          <Button
            variant="contained"
            component={Link}
            to="/"
            style={{ color: "#FFFFFF", backgroundColor: "#1976D2" }}
          >
            Go Home
          </Button>
        </div>
      ) : (
        <List>
          {audioFiles.map((file, index) => (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                <IconButton onClick={() => handlePlayPause(index)}>
                  {index === currentlyPlayingIndex && isPlaying ? (
                    <PauseCircleOutline
                      style={{ color: isDarkMode ? "#FFFFFF" : "" }}
                    />
                  ) : (
                    <PlayCircleOutline
                      style={{ color: isDarkMode ? "#FFFFFF" : "" }}
                    />
                  )}
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={file.data.fileName}
                style={{ color: isDarkMode ? "#FFFFFF" : "" }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </motion.div>
  );
};

export default SongList;
