let isLoading = false;
let loadingElement;
let smallLoadingElement;

document.addEventListener("DOMContentLoaded", function () {
  loadingElement = document.getElementById("loading");
  smallLoadingElement = document.getElementById("smallLoading");
  const loadingTextElement = document.createElement("p");
  loadingTextElement.style.color = "#fff";
  loadingTextElement.style.fontSize = "1.5em";
  loadingTextElement.textContent = "Creating your story...";
  loadingElement.appendChild(loadingTextElement);
  loadingElement.style.display = "flex";

  setTimeout(() => {
    loadingTextElement.textContent = "Preparing choices...";
  }, 3000);

  setTimeout(() => {
    loadingTextElement.textContent = "Creating images...";
  }, 7000);

  setTimeout(() => {
    loadingTextElement.textContent = "Finalizing...";
  }, 10000);

  fetch("/game")
    .then((response) => response.json())
    .then((data) => {
      displayStoryAndImages(data.story, data.images, data.imagePrompts);
      loadingElement.style.display = "none";
      isLoading = false;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data. Please try again later.");
      isLoading = false;
      loadingElement.style.display = "none";
    });
});

function displayStoryAndImages(story, images, imagePrompts) {
  // Append the new part of the story
  const storyTextElement = document.getElementById("storyText");
  const newStoryDiv = document.createElement("div");
  const formattedStory = story.replace(/\n/g, "<br>"); //Potential cause of error!
  newStoryDiv.innerHTML = `<p>${story}</p>`;
  storyTextElement.appendChild(newStoryDiv);

  // Clear and replace the current images
  const imageChoicesContainer = document.getElementById("imageChoices");
  imageChoicesContainer.innerHTML = "";

  // Append the new images
  images.forEach((imageUrl, index) => {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Generated Image";
    img.id = `image-${Date.now()}-${index}`; // Set a unique ID for each image
    img.classList.add("image-choice");
    img.style.width = "200px";
    img.style.height = "auto";

    // Set the prompt for each image
    img.dataset.prompt = imagePrompts[index];

    img.addEventListener("click", () => {
      if (!isLoading) {
        selectImage(img.id);
      }
    });
    imageChoicesContainer.appendChild(img);
  });
}

function selectImage(selectedImageId) {
  if (isLoading) return; // Prevent selection (again?) if already loading

  isLoading = true;
  smallLoadingElement.style.display = "flex";

  const selectedImage = document.getElementById(selectedImageId);
  const selectedPrompt = selectedImage.dataset.prompt;

  // Highlight the selected image
  const images = document.querySelectorAll(".image-choice");
  images.forEach((img) => {
    img.style.border =
      img.id === selectedImageId ? "1px dotted lightgray" : "none";
  });

  // Disable further image clicks
  images.forEach((img) => {
    img.style.pointerEvents = "none";
  });

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
      displayStoryAndImages(data.story, data.images, data.imagePrompts);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    })
    .finally(() => {
      isLoading = false;
      smallLoadingElement.style.display = "none";

      // Re-enable image clicks
      images.forEach((img) => {
        img.style.pointerEvents = "auto";
      });
    });
}
