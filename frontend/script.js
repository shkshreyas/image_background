// /frontend/script.js

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('imageUpload');
const outputImage = document.getElementById('outputImage');
const uploadButton = document.getElementById('uploadButton');

uploadArea.addEventListener('click', () => {
    fileInput.click(); // Trigger file input when upload area is clicked
});

// Handle file selection
fileInput.addEventListener('change', handleFileUpload);
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault(); // Prevent default behavior (Prevent file from being opened)
});
uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files; // Set the files to the input
        handleFileUpload();
    }
});

// Handle file upload
async function handleFileUpload() {
    if (fileInput.files.length === 0) {
        alert('Please select an image!');
        return;
    }

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:3001/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to get image back');
        }

        const blob = await response.blob();
        outputImage.src = URL.createObjectURL(blob);
        outputImage.style.display = 'block'; // Show the image
    } catch (error) {
        console.error('Error:', error);
        alert('Error processing the image: ' + error.message);
    }
}