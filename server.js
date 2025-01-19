const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Facebook video download endpoint
app.get('/download', async (req, res) => {
  const videoURL = req.query.url;  // URL passed as a query parameter

  if (!videoURL) {
    return res.status(400).json({ error: 'No video URL provided' });
  }

  try {
    // Fetch the video info from Facebook (this is a simplified version)
    const videoID = extractFacebookVideoID(videoURL);  // Helper function to extract the video ID from the URL
    if (!videoID) {
      return res.status(400).json({ error: 'Invalid Facebook URL' });
    }

    // Make request to Facebook to fetch video details
    const videoDetails = await getFacebookVideoDownloadURL(videoID);
    if (!videoDetails) {
      return res.status(500).json({ error: 'Failed to fetch video details from Facebook' });
    }

    // Stream the video to the client
    res.header('Content-Disposition', `attachment; filename="facebook_video.mp4"`);
    res.header('Content-Type', 'video/mp4');
    fetch(videoDetails.download_url)
      .then((response) => response.body.pipe(res))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to download video.' });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to download video. Please check the URL.' });
  }
});

// Helper function to extract the video ID from the Facebook URL
function extractFacebookVideoID(url) {
  const regex = /(?:https?:\/\/(?:www\.)?facebook\.com\/(?:[^\/]+\/)+)?(\d+)/;
  const matches = url.match(regex);
  return matches && matches[1] ? matches[1] : null;
}

// Function to get the Facebook video download URL (simplified for this example)
async function getFacebookVideoDownloadURL(videoID) {
  // In a real case, Facebook API or third-party services are used to get download URL.
  // For simplicity, this example assumes an API that can provide the download URL.
  // The Facebook API is often restrictive or not openly accessible, so be aware of API limits and legal constraints.

  const response = await fetch(`https://graph.facebook.com/${videoID}?fields=source&access_token=YOUR_ACCESS_TOKEN`);
  const data = await response.json();

  if (data.source) {
    return { download_url: data.source };
  }

  return null;
}

// Root endpoint (to serve index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
