const hamMenu = document.querySelector(".ham-menu");
const offScreenMenu = document.querySelector(".off-screen-menu");

function getGalleryImage(item) {
  try {
    const url = new URL(item.url);
    let videoId;

    if (url.hostname === "youtu.be") {
      videoId = url.pathname.slice(1).split("/")[0];
    } else if (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com")) {
      videoId = url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    }

    if (videoId && /^[\w-]{11}$/.test(videoId)) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  } catch (error) {
    console.error("Invalid gallery item URL", error);
  }

  return item.image;
}

//Opens the hamburger menu
hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

//Closes the hamburger menu when clicked outside the menu
document.addEventListener('click', function(event) {
  // Check if the menu is open

  // AND check if the click was outside the menu
  // AND check if the click was not on the button itself
  if (!hamMenu.contains(event.target) && !offScreenMenu.contains(event.target)) {
    // Remove the active class to close the menu
    if(offScreenMenu.classList.contains("active")){
    offScreenMenu.classList.toggle('active');
    hamMenu.classList.toggle("active");
    // If you have a separate toggle icon, you can turn it off here too
    // menuButton.classList.remove('is-active');
  }}
});

//FAQ
document.addEventListener("DOMContentLoaded", () =>{
  const questions = document.querySelectorAll(".faq-question");

  questions.forEach(question => {
    question.addEventListener("click", ()=> {
      question.classList.toggle("active");
      const answer = question.nextElementSibling;
      const icon = question.querySelector(".icon");

      if (answer.style.display === "block") {
        answer.style.display = "none";
        icon.textContent = "+";
      } else {
        answer.style.display = "block";
        icon.textContent ="-";
      }
    });
  });

  const gallerySections = document.querySelector("#gallery-sections");
  if (!gallerySections) {
    return;
  }

  const sectionTemplate = document.querySelector("#gallery-section-template");
  const itemTemplate = document.querySelector("#gallery-item-template");
  if (!sectionTemplate || !itemTemplate) {
    throw new Error("Gallery templates were not found");
  }

  fetch("gallery.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`Gallery data request failed: ${response.status}`);
      }
      return response.json();
    })
    .then(sections => {
      if (!Array.isArray(sections)) {
        throw new Error("Gallery data must be an array of sections");
      }

      const content = document.createDocumentFragment();
      sections.forEach(section => {
        const sectionElement = sectionTemplate.content.firstElementChild.cloneNode(true);
        sectionElement.querySelector("[data-year]").textContent = section.year;
        const itemsElement = sectionElement.querySelector("[data-items]");

        section.items.forEach(item => {
          const itemElement = itemTemplate.content.firstElementChild.cloneNode(true);
          const link = itemElement.querySelector("a");
          const image = itemElement.querySelector("img");
          link.href = item.url;
          image.src = getGalleryImage(item);
          image.alt = item.alt || item.title;
          itemElement.querySelector(".pic-words-small").textContent = item.title;
          itemsElement.appendChild(itemElement);
        });

        content.appendChild(sectionElement);
        content.appendChild(document.createElement("br"));
        content.appendChild(document.createElement("hr"));
        content.appendChild(document.createElement("br"));
      });

      gallerySections.appendChild(content);
    })
    .catch(error => {
      console.error("Failed to load gallery content", error);
      gallerySections.textContent = "The gallery could not be loaded. Please try again later.";
    });
});
