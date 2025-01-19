const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS) from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON data
app.use(express.json());

// Route for downloading the video
app.get('/download', async (req, res) => {
    const videoURL = req.query.url;  // URL passed as a query parameter

    if (!videoURL) {
        return res.status(400).json({ error: 'No video URL provided' });
    }

    try {
        const videoID = extractFacebookVideoID(videoURL);
        if (!videoID) {
            return res.status(400).json({ error: 'Invalid Facebook video URL.' });
        }

        // Send a request to a third-party service to fetch the download link
        const response = await fetch(`https://www.fbdown.net/download.php?url=${encodeURIComponent(videoURL)}`);
        const html = await response.text();

        // Regex to extract the video download link from the HTML page returned
        const regex = /<a href="(https:\/\/.*?\.mp4)"/;
        const matches = html.match(regex);

        if (matches && matches[1]) {
            const downloadLink = matches[1];
            res.json({ downloadLink });
        } else {
            res.status(500).json({ error: 'Failed to extract download link.' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching the video.' });
    }
});

// Route to serve the frontend HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Helper function to extract video ID from the Facebook URL
function extractFacebookVideoID(url) {
    const regex = /(?:facebook\.com\/(?:[^\/]+\/)?video\.php\?v=|facebook\.com\/share\/v\/)([\w-]+)/;
    const matches = url.match(regex);
    return matches && matches[1] ? matches[1] : null;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
