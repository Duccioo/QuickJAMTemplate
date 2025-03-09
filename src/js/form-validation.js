// Form validation for JAM submission
// Import configuration
import config from "./config.js";
// Import notification functions
import {sendTelegramNotification} from "./telegram-bot.js";
import {setupTelegramWebhook} from "./telegram-webhook.js";
// Email notification function (to be implemented)
import {sendEmailNotification} from "./email-notification.js";

document.addEventListener("DOMContentLoaded", function () {
  // Setup Telegram webhook (for demo purposes)
  if (config.submission.notificationMethod === "telegram") {
    setupTelegramWebhook();
  }
  const submissionForm = document.getElementById("jam-submission-form");

  if (submissionForm) {
    // GitHub URL validation
    const githubLinkInput = document.getElementById("github-link");
    const emailInput = document.getElementById("creator-email");
    const projectTitleInput = document.getElementById("project-title");
    const projectSubtitleInput = document.getElementById("project-subtitle");
    const projectImageInput = document.getElementById("project-image");
    const submitButton = document.getElementById("submit-project");
    const formStatus = document.getElementById("form-status");

    // Validate GitHub URL format
    function isValidGithubUrl(url) {
      const githubRegex = /^https?:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?.*$/i;
      return githubRegex.test(url);
    }

    // Validate email format
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    // Show validation message
    function showValidationMessage(input, isValid, message) {
      const messageElement = input.parentElement.querySelector(
        ".validation-message"
      );

      if (isValid) {
        input.classList.remove("invalid");
        input.classList.add("valid");
        if (messageElement) {
          messageElement.textContent = "";
          messageElement.classList.remove("error");
        }
      } else {
        input.classList.remove("valid");
        input.classList.add("invalid");
        if (messageElement) {
          messageElement.textContent = message;
          messageElement.classList.add("error");
        }
      }
    }

    // Validate GitHub link
    if (githubLinkInput) {
      githubLinkInput.addEventListener("blur", function () {
        const isValid = isValidGithubUrl(this.value);
        showValidationMessage(
          this,
          isValid,
          "Please enter a valid GitHub repository URL"
        );
      });
    }

    // Validate email
    if (emailInput) {
      emailInput.addEventListener("blur", function () {
        const isValid = isValidEmail(this.value);
        showValidationMessage(
          this,
          isValid,
          "Please enter a valid email address"
        );
      });
    }

    // Validate project title
    if (projectTitleInput) {
      projectTitleInput.addEventListener("blur", function () {
        const isValid = this.value.trim().length > 0;
        showValidationMessage(this, isValid, "Project title is required");
      });
    }

    // Validate project subtitle
    if (projectSubtitleInput) {
      projectSubtitleInput.addEventListener("blur", function () {
        const isValid = this.value.trim().length > 0;
        showValidationMessage(this, isValid, "Project subtitle is required");
      });
    }

    // Validate image upload
    if (projectImageInput) {
      projectImageInput.addEventListener("change", function () {
        const isValid = this.files && this.files.length > 0;
        showValidationMessage(
          this,
          isValid,
          "Please select an image for your project"
        );
      });
    }

    // Form submission
    submissionForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validate all fields
      const isGithubValid = isValidGithubUrl(githubLinkInput.value);
      const isEmailValid = isValidEmail(emailInput.value);
      const isTitleValid = projectTitleInput.value.trim().length > 0;
      const isSubtitleValid = projectSubtitleInput.value.trim().length > 0;
      const isImageValid =
        projectImageInput.files && projectImageInput.files.length > 0;

      // Update validation messages
      showValidationMessage(
        githubLinkInput,
        isGithubValid,
        "Please enter a valid GitHub repository URL"
      );
      showValidationMessage(
        emailInput,
        isEmailValid,
        "Please enter a valid email address"
      );
      showValidationMessage(
        projectTitleInput,
        isTitleValid,
        "Project title is required"
      );
      showValidationMessage(
        projectSubtitleInput,
        isSubtitleValid,
        "Project subtitle is required"
      );
      showValidationMessage(
        projectImageInput,
        isImageValid,
        "Please select an image for your project"
      );

      // If all validations pass
      if (
        isGithubValid &&
        isEmailValid &&
        isTitleValid &&
        isSubtitleValid &&
        isImageValid
      ) {
        // Show loading state
        submitButton.disabled = true;
        formStatus.textContent = "Submitting project...";
        formStatus.classList.remove("error", "success");

        // Generate a new project ID (in a real app, this would be handled by the server)
        const newProjectId = Date.now();

        // Create project data object
        const projectData = {
          id: newProjectId,
          title: projectTitleInput.value.trim(),
          subtitle: projectSubtitleInput.value.trim(),
          creatorEmail: emailInput.value.trim(),
          githubLink: githubLinkInput.value.trim(),
          image: projectImageInput.files[0],
          visible: false, // Default to not visible until approved
        };

        // Determine which notification method to use based on configuration
        let notificationPromise;

        if (config.submission.notificationMethod === "telegram") {
          // Send Telegram notification
          notificationPromise = sendTelegramNotification(projectData);
        } else if (config.submission.notificationMethod === "email") {
          // Send Email notification
          notificationPromise = sendEmailNotification(projectData);
        } else {
          // Default to console log if no valid method is specified
          console.warn("No valid notification method specified in config");
          notificationPromise = Promise.resolve(false);
        }

        // Handle the notification result
        notificationPromise
          .then((success) => {
            if (success) {
              formStatus.textContent =
                "Project submitted successfully! It will be reviewed by our team.";
              formStatus.classList.add("success");
              formStatus.classList.remove("error");

              // Reset form
              submissionForm.reset();

              // Remove validation classes
              const inputs = submissionForm.querySelectorAll("input, textarea");
              inputs.forEach((input) => {
                input.classList.remove("valid", "invalid");
              });
            } else {
              formStatus.textContent =
                "There was an issue sending the notification. Please try again later.";
              formStatus.classList.add("error");
              formStatus.classList.remove("success");
            }
          })
          .catch((error) => {
            console.error("Error in submission process:", error);
            formStatus.textContent =
              "An error occurred during submission. Please try again later.";
            formStatus.classList.add("error");
            formStatus.classList.remove("success");
          })
          .finally(() => {
            submitButton.disabled = false;
          });

        // Scroll to the status message
        formStatus.scrollIntoView({behavior: "smooth"});
      } else {
        formStatus.textContent =
          "Please fix the errors in the form before submitting.";
        formStatus.classList.add("error");
        formStatus.classList.remove("success");
      }
    });
  }
});
