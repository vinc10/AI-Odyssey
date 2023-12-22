document.addEventListener("DOMContentLoaded", function () {
  const loadingElement = document.getElementById("loading");
  const loadingTextElement = document.createElement("p"); // Create a new paragraph element for the loading text
  loadingTextElement.style.color = "#fff"; // Set the text color to white
  loadingTextElement.style.fontSize = "1.5em"; // Set the font size
  loadingTextElement.textContent = "Creating your story..."; // Display the first message straight away
  loadingElement.appendChild(loadingTextElement); // Add the loading text element to the loading overlay
  loadingElement.style.display = "flex"; // Show the loading overlay

  setTimeout(() => {
    loadingTextElement.textContent = "Preparing choices..."; // Display the second message after 5 seconds
  }, 3000);

  setTimeout(() => {
    loadingTextElement.textContent = "Creating images..."; // Display the second message after 5 seconds
  }, 6000);

  setTimeout(() => {
    loadingTextElement.textContent = "Finalizing..."; // Display the third message after 6 seconds
  }, 9000);

  fetch("/game")
    .then((response) => response.json())
    .then((data) => {
      loadingElement.style.display = "none"; // Hide the loading overlay
      displayStoryAndImages(data.story, data.images, data.imagePrompts);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data. Please try again later.");
      print(error);
    });
});

function displayStoryAndImages(story, images, imagePrompts) {
  // Append the new part of the story
  const storyTextElement = document.getElementById("storyText");
  const newStoryDiv = document.createElement("div"); // Create a new div for the new story segment
  newStoryDiv.innerHTML = `<p>${story}</p>`;
  storyTextElement.appendChild(newStoryDiv); // Append the new story div to the existing story text

  // Clear and replace the current images
  const imageChoicesContainer = document.getElementById("imageChoices");
  imageChoicesContainer.innerHTML = ""; // Clear the container

  // Append the new images
  images.forEach((imageUrl, index) => {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Generated Image";
    img.id = `image-${Date.now()}-${index}`; // Set a unique ID for each image
    img.classList.add("image-choice"); // Add a class for styling
    img.style.width = "200px"; // Set a fixed width
    img.style.height = "auto"; // Maintain aspect ratio

    // Set the prompt for each image
    img.dataset.prompt = imagePrompts[index];

    img.addEventListener("click", () =>
      selectImage(img.id, img.dataset.prompt)
    );
    imageChoicesContainer.appendChild(img); // Append the image to the container
  });
}

// Ensure the selectImage function is updated accordingly

// Ensure the selectImage function is updated accordingly

// Ensure the selectImage function is updated accordingly

function selectImage(selectedImageId) {
  const selectedImage = document.getElementById(selectedImageId);
  const selectedPrompt = selectedImage.dataset.prompt;

  // Send the selected prompt back to the server
  fetch("/game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedPrompt: selectedPrompt }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Display the next part of the story and new images
      displayStoryAndImages(data.story, data.images, data.imagePrompts);
    })
    .catch((error) => console.error("Error:", error));
  const images = document.querySelectorAll(".image-choice");
  images.forEach((img, index) => {
    if (index === selectedIndex) {
      img.style.border = "3px solid blue"; // Highlight the selected image
    } else {
      img.style.border = "none"; // Remove highlight from other images
    }
  });
}
