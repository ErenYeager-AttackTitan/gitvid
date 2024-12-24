const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const app = express();
const port = 3000;

// Video URL to stream
const videoUrl = 'http://188.165.53.164/vidshd/56ea912c4df934c216c352fa8d623af3/3108.mp4';

// Set up the route to stream the video
app.get('/stream', (req, res) => {
    res.contentType('video/mp4'); // Set the content type to video/mp4

    // Use ffmpeg to stream the video
    ffmpeg(videoUrl)
        .format('mp4')
        .videoCodec('libx264')
        .audioCodec('aac')
        .on('start', () => {
            console.log('FFmpeg started streaming');
        })
        .on('end', () => {
            console.log('FFmpeg finished streaming');
        })
        .on('error', (err) => {
            console.error('Error:', err);
            res.status(500).send('Error streaming the video');
        })
        .pipe(res, { end: true }); // Pipe the output directly to the response
});

// Start the server
app.listen(port, () => {
    console.log(`IPTV server is running at http://localhost:${port}`);
});
