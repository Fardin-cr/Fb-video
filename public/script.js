document.getElementById('downloadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const videoURL = document.getElementById('videoURL').value;
    const errorMessage = document.getElementById('errorMessage');

    if (!videoURL) {
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none';

    // Make API request to the server to download the video
    fetch(`/download?url=${encodeURIComponent(videoURL)}`)
        .then(response => {
            if (response.ok) {
                window.location.href = `/download?url=${encodeURIComponent(videoURL)}`; // Trigger download
            } else {
                alert('Failed to download video');
            }
        })
        .catch(err => {
            console.error(err);
            alert('Error occurred while downloading the video');
        });
});
