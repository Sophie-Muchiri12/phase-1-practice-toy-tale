let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.querySelector("#toy-collection");
  const toyForm = document.querySelector(".add-toy-form");

  // Hide & seek with the form
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Fetch and display toys
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        createToyCard(toy);
      });
    });

  // Add a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(toy => {
      createToyCard(toy);
      toyForm.reset();
      toyFormContainer.style.display = "none";
      addToy = false;
    });
  });

  // Function to create a toy card
  function createToyCard(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";

    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add event listener to the like button
    const likeBtn = toyCard.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      fetch(`http://localhost:3000/toys/${toy.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          likes: toy.likes + 1
        })
      })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        toyCard.querySelector("p").innerText = `${updatedToy.likes} Likes`;
      });
    });

    toyCollection.appendChild(toyCard);
  }
});