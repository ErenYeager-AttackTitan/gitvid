const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Endpoint to serve the M3U playlist
app.get('/stream.m3u8', async (req, res) => {
    try {
        const m3uUrl = 'https://raw.githubusercontent.com/ErenYeager-AttackTitan/gitvid/refs/heads/main/3.m3u'; // Replace with your M3U file
        const response = await axios.get(m3uUrl);
        res.set('Content-Type', 'application/vnd.apple.mpegurl');
        res.send(response.data);  // Directly serve the playlist file
    } catch (error) {
        console.error('Error fetching M3U playlist:', error);
        res.status(500).send('Error fetching the playlist');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
