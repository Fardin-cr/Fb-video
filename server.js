// Importing required libraries
const express = require('express');
const path = require('path');
const fbDownloader = require('fb-downloader');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON data
app.use(express.json());

// Video download endpoint (API) for Facebook
app.get('/download', async (req, res) => {
    const videoURL = req.query.url;  // URL passed as a query parameter

    if (!videoURL) {
        return res.status(400).json({ error: 'No video URL provided' });
    }

    try {
        // Get video info from Facebook
        const videoData = await fbDownloader(videoURL);
        
        // Extract the best quality video URL
        const bestQualityUrl = videoData[0].url; // You can select the video quality you prefer
        
        // Stream the video to the client
        res.header('Content-Disposition', `attachment; filename="facebook_video.mp4"`);
        res.redirect(bestQualityUrl); // This will start the download
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to download video. Please check the URL.' });
    }
});

// Root endpoint (to serve index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
