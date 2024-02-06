import React from "react";
import { AppBar, Toolbar, Typography, Grid, Switch } from "@mui/material";


const Navbar = ({ isDarkMode, toggleDarkMode }) => (
  <AppBar
    position="static"
    style={{ backgroundColor: "transparent", boxShadow: "none" }}
  >
    <Toolbar>
      <Grid container justifyContent="flex-end" alignItems="center">
        <Typography variant="body2" style={{ color: "white" }}>
          Dark Mode
        </Typography>
        <Switch checked={isDarkMode} onChange={toggleDarkMode} />
      </Grid>
    </Toolbar>
  </AppBar>
);

export default Navbar;
