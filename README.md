# AudioPlayer App

AudioPlayer is a web application built with vite, ReactJS, Material UI, and Framer Motion that allows users to upload, manage, and play audio files in their browser.

## Features

1. **File Uploading**: Upload audio files to the app, which are stored locally using IndexedDB.

2. **Playlist and Now Playing View**: View all uploaded songs in a playlist format and see which song is currently playing. Users can play or pause songs directly from the playlist.

3. **Audio Player Controls**: The audio player includes play, pause, and next buttons for controlling playback. A seek bar allows users to adjust the playback position.

4. **Last Playback Position**: The app utilizes browser sessionStorage to store the last playing audio file and its playback position. This enables automatic playback from the last position upon page reload.

## Installation

To run the AudioPlayer app locally, follow these steps:

1. Clone this repository to your local machine:
    git clone https://github.com/developjua/audio_player
   
2. Navigate to the project directory:
    cd audio_player

3. Install dependencies using npm or yarn:
   npm install
   or
   yarn install
4. Start the development server:
   npm dev
   or
   vite

