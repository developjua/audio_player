import React, { useState, useEffect } from "react";
import {
  Container,
  CssBaseline,
} from "@mui/material";
import NavBar from "./NavBar";
import Home from "./Components/Home.jsx";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Audio from './Components/audioPlayerComponents/Audio.jsx'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
        overflow: "hidden",
      }}
    >
      <Container
        style={{
          background: `linear-gradient(45deg, ${
            isDarkMode ? "#263238, #37474F" : "#FF6D00, #FFA000"
          })`,
        }}
      >
        <NavBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
            <Route
              path="/songlist"
              element={<Audio isDarkMode={isDarkMode} />}
            />
          </Routes>
        </Router>
      </Container>
    </motion.div>
  );
}

export default App;
