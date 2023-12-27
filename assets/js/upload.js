function openFileInput() {
    // Triggers the click event for the file input field
    document.getElementById('fileInput').click();
}

function handleFileSelect(event) {
    const files = event.target.files;

    // Iterate over the selected files and preview them
    for (const file of files) {
        const reader = new FileReader();

        reader.onload = function (e) {
            // Create a new image element
            const newImage = document.createElement('img');
            newImage.src = e.target.result;

            // Add the image to the preview area
            document.getElementById('previewContainer').appendChild(newImage);
        };

        // Reading file contents
        reader.readAsDataURL(file);
    }
}
