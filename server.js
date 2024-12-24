const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Path to the local video file
const videoPath = path.join(__dirname, 'Tokyo Ghoul - S1 - NCOP1 (10).mp4');

// Set up the route to stream the local video file
app.get('/stream', (req, res) => {
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");

        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;

        const chunkSize = (end-start)+1;
        const file = fs.createReadStream(videoPath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        });

        file.pipe(res);
    } else {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });

        fs.createReadStream(videoPath).pipe(res);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`IPTV server is running at http://localhost:${port}`);
});
