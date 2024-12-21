const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for Render's port

// Directory to store HLS segment files
const hlsDirectory = path.join(__dirname, 'hls');
if (!fs.existsSync(hlsDirectory)) {
    fs.mkdirSync(hlsDirectory);
}

// Endpoint for serving the M3U playlist dynamically
app.get('/stream.m3u8', async (req, res) => {
    try {
        const m3uUrl = 'https://raw.githubusercontent.com/ErenYeager-AttackTitan/gitvid/refs/heads/main/3.m3u';
        const response = await axios.get(m3uUrl);
        
        res.set('Content-Type', 'application/vnd.apple.mpegurl');
        res.send(response.data); // Directly serve the M3U playlist file
    } catch (error) {
        console.error('Error fetching M3U playlist:', error);
        res.status(500).send('Error fetching the playlist');
    }
});

// HLS streaming endpoint that serves video segments
app.get('/hls/:segment', (req, res) => {
    const segmentPath = path.join(hlsDirectory, req.params.segment);
    if (fs.existsSync(segmentPath)) {
        res.sendFile(segmentPath); // Serve the video segment
    } else {
        res.status(404).send('Segment not found');
    }
});

// Function to start streaming from M3U playlist and convert to HLS
app.get('/start-stream', (req, res) => {
    const m3uUrl = 'https://raw.githubusercontent.com/ErenYeager-AttackTitan/gitvid/refs/heads/main/3.m3u'; // Playlist URL

    // Start converting the video from M3U to HLS (segments)
    ffmpeg(m3uUrl)
        .output(path.join(hlsDirectory, 'output.m3u8')) // Output playlist
        .outputOptions('-hls_time 10')  // Segment length in seconds
        .outputOptions('-hls_list_size 0')  // Unlimited playlist size (live)
        .outputOptions('-f hls')  // HLS format
        .on('end', () => {
            console.log('HLS stream generated');
        })
        .on('error', (err) => {
            console.error('Error during streaming', err);
            res.status(500).send('Error while streaming.');
        })
        .run();

    res.send('Streaming started...');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
          
