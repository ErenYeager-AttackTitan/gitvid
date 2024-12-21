const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Endpoint to serve the M3U playlist
app.get('/playlist.m3u', async (req, res) => {
    try {
        // The URL to your M3U playlist on GitHub
        const m3uUrl = 'https://raw.githubusercontent.com/ErenYeager-AttackTitan/gitvid/refs/heads/main/3.m3u';
        const response = await axios.get(m3uUrl);
        
        // Set the content type for M3U playlist
        res.set('Content-Type', 'application/vnd.apple.mpegurl');
        
        // Send the M3U content to the client
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching M3U playlist:', error);
        res.status(500).send('Error fetching the playlist');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
