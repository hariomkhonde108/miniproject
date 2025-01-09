// Open the modal when the plus icon is clicked
document.getElementById('addPhoto').addEventListener('click', function() {
    document.getElementById('photoModal').style.display = 'flex';
});

// Close the modal when the close button is clicked
document.getElementById('closeModal').addEventListener('click', function() {
    document.getElementById('photoModal').style.display = 'none';
    document.getElementById('photoInput').value = ''; // Clear the input field
    document.querySelector('.image-container').innerHTML = ''; // Clear the preview image
    document.getElementById('photoDescription').value = ''; // Clear the description input
});

// Handle file input change (when a photo is selected or taken)
document.getElementById('photoInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.alt = "Selected Image"; // Add alt text for accessibility
            document.querySelector('.image-container').innerHTML = ''; // Clear any existing image preview
            document.querySelector('.image-container').appendChild(imgElement); // Show the image preview
        };
        reader.readAsDataURL(file); // Preview the image locally before uploading
    }
});

// Handle the Upload Photo button click
document.getElementById('uploadBtn').addEventListener('click', function() {
    const photoInput = document.getElementById('photoInput');
    const file = photoInput.files[0];
    const description = document.getElementById('photoDescription').value; // Get the description

    if (file && description.trim() !== '') {
        const formData = new FormData();
        formData.append('photo', file); // Add the file to the FormData object
        formData.append('description', description); // Add the description to the FormData object

        // Send the photo and description to the backend (replace with your backend endpoint)
        fetch('/upload-photo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Photo uploaded successfully:', data);
            // Optionally, close the modal and reset the form
            document.getElementById('photoModal').style.display = 'none';
            document.getElementById('photoInput').value = ''; // Clear the file input
            document.querySelector('.image-container').innerHTML = ''; // Clear the preview image
            document.getElementById('photoDescription').value = ''; // Clear the description field

            // Display the uploaded photo and description on the page
            const postContainer = document.createElement('div');
            postContainer.classList.add('post');
            
            const postImage = document.createElement('img');
            postImage.src = data.filePath; // Assuming backend returns file path
            postImage.alt = "Uploaded Image";

            const postDescription = document.createElement('p');
            postDescription.textContent = data.description;

            postContainer.appendChild(postImage);
            postContainer.appendChild(postDescription);

            // Add the post to the main content section
            document.querySelector('main').appendChild(postContainer);
        })
        .catch(error => {
            console.error('Error uploading photo:', error);
        });
    } else {
        alert('Please select a photo and provide a description.');
    }
});
