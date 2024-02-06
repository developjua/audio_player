import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  CircularProgress,
  Container,
  FormControlLabel,
  Grid,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function MusicPlayer({ isDarkMode }) {
  const [uploading, setUploading] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState([]);
  const navigate = useNavigate();
  const dbRef = useRef(null);

  const initIndexDB = () => {
    const dbName = "musicDatabase";
    const dbVersion = 1;
    const objectStoreName = "musicFiles";

    const request = window.indexedDB.open(dbName, dbVersion);

    request.onerror = function (event) {
      console.error("Error opening indexedDB:", event.target.error);
    };

    request.onupgradeneeded = function (event) {
      dbRef.current = event.target.result;
      dbRef.current.createObjectStore(objectStoreName, {
        autoIncrement: true,
      });
      setDbInitialized(true);
    };

    request.onsuccess = function (event) {
      dbRef.current = event.target.result;
      console.log("IndexedDB opened successfully");
      setDbInitialized(true);
    };
  };

  useEffect(() => {
    initIndexDB();
  }, []);

  const handleUpload = useCallback(
    async (event) => {
      if (!dbInitialized) {
        toast.error("IndexedDB not initialized");
        return;
      }

      setUploading(true);
      const files = Array.from(event.target.files);
      let successCount = 0;
      let errorOccurred = false;

      try {
        const transaction = dbRef.current.transaction(
          ["musicFiles"],
          "readwrite"
        );
        const objectStore = transaction.objectStore("musicFiles");

        const existingFiles = await getFileFromIndexDB(objectStore);

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();

          if (
            existingFiles.some(
              (existingFile) => existingFile.fileName === file.name
            )
          ) {
            toast.warning(`${file.name} is already uploaded`);
            continue;
          }

          reader.onload = async (e) => {
            try {
              await saveToIndexDB({
                fileName: file.name,
                fileData: e.target.result,
              });
              successCount++;
            } catch (error) {
              console.log(error);
              errorOccurred = true;
            }

            if (successCount === files.length) {
              toast.success("All files uploaded successfully");

              setUploading(false);
              navigate("/songlist");
            } else if (errorOccurred) {
              toast.error("Error occurred during upload");
              setUploading(false);
            }
          };

          reader.onerror = () => {
            toast.error(`Error reading ${file.name}`);
          };

          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.log(error);
        errorOccurred = true;
        toast.error("Error occurred during upload");
      } finally {
        setUploading(false);
      }
    },
    [dbInitialized]
  );

  const getFileFromIndexDB = (objectStore) => {
    return new Promise((resolve, reject) => {
      const request = objectStore.getAll();

      request.onsuccess = () => {
        const files = request.result;
        resolve(files);
      };

      request.onerror = (event) => {
        console.error(
          "Error getting files from IndexedDB:",
          event.target.error
        );
        reject(event.target.error);
      };
    });
  };

  const saveToIndexDB = async ({ fileName, fileData }) => {
    return new Promise((resolve, reject) => {
      const transaction = dbRef.current.transaction(
        ["musicFiles"],
        "readwrite"
      );
      const objectStore = transaction.objectStore("musicFiles");
      const request = objectStore.add({ fileName, fileData });

      transaction.oncomplete = () => {
        console.log("Transaction completed successfully");
        resolve();
      };

      transaction.onerror = (event) => {
        console.error("Transaction error:", event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        console.log("File added to IndexedDB successfully");
      };

      request.onerror = (event) => {
        console.error("Error adding file to IndexedDB:", event.target.error);
        reject(event.target.error);
      };
    });
  };

  const handleButtonClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    fileInputRef.current.click();
  };

  const handlePlaylistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/songlist");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: `linear-gradient(45deg, ${
          isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
        })`,
        minHeight: "100vh",
        padding: "64px 16px",
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: isDarkMode ? "#37474F" : "#FFA000",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography
                variant="h4"
                gutterBottom
                style={{ color: isDarkMode ? "#FFFFFF" : "#263238" }}
              >
                Music Player
              </Typography>
            </Grid>
            <Grid item></Grid>
          </Grid>
          <Typography
            variant="body1"
            paragraph
            style={{ color: isDarkMode ? "#FFFFFF" : "#263238" }}
          >
            Upload your favorite music files and enjoy listening!
          </Typography>
          <input
            accept="audio/mp3"
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            multiple
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              color="primary"
              disabled={uploading}
              onClick={handleButtonClick}
            >
              Upload Music Files
            </Button>
          </label>
          <Button
            variant="contained"
            component="span"
            color="primary"
            onClick={handlePlaylistClick}
            style={{ marginLeft: "5px" }}
          >
            GO To Playlist
          </Button>
          {uploading && (
            <Typography variant="body2" style={{ marginTop: 8 }}>
              Loading...
            </Typography>
          )}
        </motion.div>
      </Container>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
      />
    </motion.div>
  );
}

export default MusicPlayer;
