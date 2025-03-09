// Smooth scrolling for navigation links
// Import configuration
import config from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 60,
          behavior: "smooth",
        });
      }
    });
  }

  // Load project data from JSON file
  loadProjectData();

  // Update hero section with configuration
  updateHeroSection();

  // Update prizes section with configuration
  updatePrizesSection();
  
  // Apply theme configuration
  applyThemeConfiguration();

  // Add animation class to project cards when they come into view
  function setupProjectCardAnimations() {
    const projectCards = document.querySelectorAll(".project-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    projectCards.forEach((card) => {
      observer.observe(card);
    });
  }

  // Add current year to footer copyright
  const yearElement = document.querySelector(".current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// Function to update hero section based on configuration
function updateHeroSection() {
  const heroTitle = document.querySelector(".hero-title");
  const heroSubtitle = document.querySelector(".hero-subtitle");
  const heroCta = document.querySelector(".hero .btn-primary");

  if (heroTitle) {
    heroTitle.textContent = config.event.name;
  }

  if (heroSubtitle) {
    heroSubtitle.textContent = config.event.subtitle;
  }

  if (heroCta) {
    heroCta.textContent = config.event.ctaText;
    heroCta.href = config.event.ctaLink;
  }
}

// Function to update prizes section based on configuration
function updatePrizesSection() {
  const prizesContainer = document.querySelector(".prizes-container");
  const prizesNote = document.querySelector(".prizes-note p");

  if (prizesContainer && config.prizes) {
    // Clear existing prize cards
    prizesContainer.innerHTML = "";

    // Add prize cards based on configuration
    const prizeCount = Math.min(
      config.prizes.count,
      config.prizes.items.length
    );

    for (let i = 0; i < prizeCount; i++) {
      const prize = config.prizes.items[i];
      const prizeCard = document.createElement("div");
      prizeCard.className = `prize-card ${prize.className}`;

      prizeCard.innerHTML = `
                <div class="prize-icon">${prize.icon}</div>
                <h3 class="prize-title">${prize.title}</h3>
                <p class="prize-description">${prize.description}</p>
            `;

      prizesContainer.appendChild(prizeCard);
    }
  }

  // Update prizes note
  if (prizesNote && config.prizes.note) {
    prizesNote.textContent = config.prizes.note;
  }
}

// Mobile menu toggle functionality (if needed in the future)
function toggleMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    mobileMenu.classList.toggle("active");
  }
}

// Project filter functionality (for future enhancement)
function filterProjects(category) {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    if (category === "all") {
      card.style.display = "block";
    } else {
      const projectCategory = card.getAttribute("data-category");
      if (projectCategory === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  });
}

// Function to apply theme configuration from config file
function applyThemeConfiguration() {
  // Apply color palette
  if (config.theme && config.theme.colors) {
    const root = document.documentElement;
    
    // Set color CSS variables
    root.style.setProperty('--primary-color', config.theme.colors.primary);
    root.style.setProperty('--secondary-color', config.theme.colors.secondary);
    root.style.setProperty('--dark-color', config.theme.colors.dark);
    root.style.setProperty('--light-color', config.theme.colors.light);
  }
  
  // Apply font families
  if (config.theme && config.theme.fonts) {
    const root = document.documentElement;
    
    // Set font CSS variables
    root.style.setProperty('--heading-font', config.theme.fonts.heading);
    root.style.setProperty('--body-font', config.theme.fonts.body);
  }
}

// Load project data from JSON file and render project cards
async function loadProjectData() {
  try {
    const response = await fetch("data/projects.json");
    if (!response.ok) {
      throw new Error("Failed to load project data");
    }

    const data = await response.json();
    const projectsGrid = document.querySelector(".projects-grid");

    if (projectsGrid) {
      // Clear existing content
      projectsGrid.innerHTML = "";

      // Filter visible projects and render them
      data.projects
        .filter((project) => project.visible)
        .forEach((project) => {
          const projectCard = document.createElement("div");
          projectCard.className = "project-card";

          projectCard.innerHTML = `
                        <div class="project-image">
                            <img src="${project.image}" alt="${project.title}">
                        </div>
                        <div class="project-content">
                            <h3 class="project-title">${project.title}</h3>
                            <p class="project-subtitle">${project.subtitle}</p>
                            <a href="${project.detailsUrl}" class="btn-secondary">View Details</a>
                        </div>
                    `;

          projectsGrid.appendChild(projectCard);
        });

      // Setup animations for the newly created cards
      setupProjectCardAnimations();
    }
  } catch (error) {
    console.error("Error loading project data:", error);
  }
}
