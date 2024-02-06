import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import usePersistState from "../../Hooks/usePersistState";
import SongList from "./AudioList";
import AudioPlayer from "./AudioPlayer";
import { Typography } from "@mui/material";

const AudioPlaylist = ({ isDarkMode }) => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [persistedState, setPersistedState] = usePersistState(
    "audioPlaylistState",
    { currentlyPlayingIndex: -1, currentTime: 0 }
  );
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState(
    persistedState.currentlyPlayingIndex
  );
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(persistedState.currentTime);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const updateTimeRef = useRef(null);

  const openIndexedDB = () => {
    return new Promise((resolve, reject) => {
      const dbName = "musicDatabase";
      const dbVersion = 1;

      const request = window.indexedDB.open(dbName, dbVersion);

      request.onerror = function (event) {
        console.error("Error opening indexedDB:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = function (event) {
        const db = event.target.result;
        resolve(db);
      };

      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore("musicFiles", { autoIncrement: true });
      };
    });
  };

  useEffect(() => {
    const getAudioFilesFromIndexedDB = async () => {
      try {
        const db = await openIndexedDB();
        const transaction = db.transaction(["musicFiles"], "readonly");
        const objectStore = transaction.objectStore("musicFiles");
        const request = objectStore.getAll();

        request.onsuccess = () => {
          const files = request.result;
          setAudioFiles(files.map((file) => ({ data: file })));
        };

        request.onerror = (event) => {
          console.error(
            "Error retrieving audio files from IndexedDB:",
            event.target.error
          );
        };
      } catch (error) {
        console.error("Error opening IndexedDB:", error);
      }
    };
    getAudioFilesFromIndexedDB();
  }, []);

  useEffect(() => {
    if (persistedState.currentlyPlayingIndex !== -1) {
      setCurrentlyPlayingIndex(persistedState.currentlyPlayingIndex);
    }
    setCurrentTime(persistedState.currentTime);
  }, [persistedState]);

  useEffect(() => {
    if (currentlyPlayingIndex !== -1 && audioFiles.length > 0) {
      setSelectedAudio(audioFiles[currentlyPlayingIndex]?.data.fileData);
      setIsPlaying(true);
    }
  }, [audioFiles, currentlyPlayingIndex]);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioRef.current.play();
      } catch (error) {
        setIsPlaying(false);
      }
    };

    if (selectedAudio && isPlaying) {
      playAudio();
      audioRef.current.currentTime = currentTime;
    } else if (!isPlaying) {
      audioRef.current.pause();
    }
  }, [selectedAudio, isPlaying, currentTime, setIsPlaying]);

  useEffect(() => {
    setCurrentTime(persistedState.currentTime || 0);
  }, [persistedState.currentTime]);

  useEffect(() => {
    setPersistedState({ currentlyPlayingIndex, currentTime });
  }, [currentlyPlayingIndex, currentTime, setPersistedState]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  const handlePlayPausePlaylist = (index) => {
    if (index === currentlyPlayingIndex && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentlyPlayingIndex(index);
      setSelectedAudio(audioFiles[index]?.data.fileData);
      setIsPlaying(true);
    }
  };

  const handleNextClick = () => {
    const nextIndex = currentlyPlayingIndex + 1;
    if (nextIndex < audioFiles.length) {
      setCurrentlyPlayingIndex(nextIndex);
      setSelectedAudio(audioFiles[nextIndex]?.data.fileData);
      setCurrentTime(0);
    } else {
      setCurrentlyPlayingIndex(0);
      setSelectedAudio(audioFiles[0]?.data.fileData);
      setCurrentTime(0);
    }
  };

  const handlePreviousClick = () => {
    const prevIndex = currentlyPlayingIndex - 1;
    if (prevIndex >= 0) {
      setCurrentlyPlayingIndex(prevIndex);
      setSelectedAudio(audioFiles[prevIndex]?.data.fileData);
      setCurrentTime(0);
    } else {
      setCurrentlyPlayingIndex(audioFiles.length - 1);
      setSelectedAudio(audioFiles[audioFiles.length - 1]?.data.fileData);
      setCurrentTime(0);
    }
  };

  const handleSliderChange = (event, newValue) => {
    if (isFinite(newValue)) {
      setCurrentTime(newValue);
      audioRef.current.currentTime = newValue;
    }
  };

  const handleAudioEnded = () => {
    handleNextClick();
  };

  const handleTimeUpdate = () => {
    if (!isPlaying && audioRef.current && !audioRef.current.seeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  return (
    <motion.div>
      <Typography
        variant="h5"
        gutterBottom
        style={{ color: isDarkMode ? "#FFFFFF" : "" }}
      >
        Audio Playlist
      </Typography>

      <SongList
        isDarkMode={isDarkMode}
        audioFiles={audioFiles}
        currentlyPlayingIndex={currentlyPlayingIndex}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPausePlaylist}
      />

      {selectedAudio && (
        <AudioPlayer
          isDarkMode={isDarkMode}
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          handlePrevious={handlePreviousClick}
          handleNext={handleNextClick}
          handleSliderChange={handleSliderChange}
          handlePlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}

      <audio
        ref={audioRef}
        src={selectedAudio}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setDuration(audioRef.current.duration);
        }}
        onEnded={handleAudioEnded}
      />
    </motion.div>
  );
};

export default AudioPlaylist;
