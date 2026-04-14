document.addEventListener("DOMContentLoaded", () => {
  const App = {
    init() {
      this.cacheDOM();
      this.bindEvents();
      this.setupFAQ();
      this.setupSmoothScroll();
      this.setupActiveNavOnScroll();
      this.setupContactForm();
      this.setupImageFallbacks();
      this.updateFooterYear();
      this.createBackToTopButton();
    },

    cacheDOM() {
      this.navLinks = document.querySelectorAll('nav a[href^="#"]');
      this.sections = document.querySelectorAll("section[id]");
      this.faqItems = document.querySelectorAll(".faq-item");
      this.contactForm = document.querySelector(".contact-form form");
      this.footerText = document.querySelector("footer p");
      this.productImages = document.querySelectorAll(".card img");
      this.header = document.querySelector("header");
      this.body = document.body;
    },

    bindEvents() {
      window.addEventListener("scroll", () => {
        this.highlightActiveNavLink();
        this.toggleBackToTopButton();
      });
    },

    setupSmoothScroll() {
      this.navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          const targetId = link.getAttribute("href");

          if (!targetId || !targetId.startsWith("#")) return;

          const targetSection = document.querySelector(targetId);
          if (!targetSection) return;

          event.preventDefault();

          const headerHeight = this.header ? this.header.offsetHeight : 0;
          const targetPosition =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        });
      });
    },

    setupActiveNavOnScroll() {
      this.highlightActiveNavLink();
    },

    highlightActiveNavLink() {
      let currentSectionId = "";

      this.sections.forEach((section) => {
        const headerHeight = this.header ? this.header.offsetHeight : 0;
        const sectionTop = section.offsetTop - headerHeight - 120;
        const sectionHeight = section.offsetHeight;

        if (
          window.pageYOffset >= sectionTop &&
          window.pageYOffset < sectionTop + sectionHeight
        ) {
          currentSectionId = section.getAttribute("id");
        }
      });

      this.navLinks.forEach((link) => {
        link.classList.remove("active-link");

        const href = link.getAttribute("href");
        if (href === `#${currentSectionId}`) {
          link.classList.add("active-link");
        }
      });
    },

    setupFAQ() {
      if (!this.faqItems.length) return;

      this.faqItems.forEach((item, index) => {
        const question = item.querySelector("h3");
        const answer = item.querySelector("p");

        if (!question || !answer) return;

        answer.style.display = "none";
        question.style.cursor = "pointer";
        question.setAttribute("tabindex", "0");
        question.setAttribute("role", "button");
        question.setAttribute("aria-expanded", "false");

        if (index === 0) {
          answer.style.display = "block";
          question.setAttribute("aria-expanded", "true");
        }

        const toggleFAQ = () => {
          const isOpen = answer.style.display === "block";

          this.faqItems.forEach((faq) => {
            const faqQuestion = faq.querySelector("h3");
            const faqAnswer = faq.querySelector("p");

            if (faqAnswer && faqQuestion) {
              faqAnswer.style.display = "none";
              faqQuestion.setAttribute("aria-expanded", "false");
            }
          });

          if (!isOpen) {
            answer.style.display = "block";
            question.setAttribute("aria-expanded", "true");
          }
        };

        question.addEventListener("click", toggleFAQ);

        question.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleFAQ();
          }
        });
      });
    },

    setupContactForm() {
      if (!this.contactForm) return;

      this.contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(this.contactForm);
        const name = formData.get("name")?.trim() || "";
        const email = formData.get("email")?.trim() || "";
        const phone = formData.get("phone")?.trim() || "";
        const message = formData.get("message")?.trim() || "";

        const validation = this.validateForm({
          name,
          email,
          phone,
          message,
        });

        this.clearFormErrors();

        if (!validation.isValid) {
          this.showFormErrors(validation.errors);
          return;
        }

        this.showToast(
          `Thank you, ${name}. Your message has been received successfully.`
        );

        this.contactForm.reset();
      });
    },

    validateForm({ name, email, phone, message }) {
      const errors = {};

      if (name.length < 2) {
        errors.name = "Please enter a valid name.";
      }

      if (!this.isValidEmail(email)) {
        errors.email = "Please enter a valid email address.";
      }

      if (!this.isValidPhone(phone)) {
        errors.phone = "Please enter a valid phone number.";
      }

      if (message.length < 10) {
        errors.message = "Your message should be at least 10 characters long.";
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    },

    isValidEmail(email) {
      const emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return emailPattern.test(email);
    },

    isValidPhone(phone) {
      const cleanedPhone = phone.replace(/[\\s()+-]/g, "");
      const phonePattern = /^\\d{9,15}$/;
      return phonePattern.test(cleanedPhone);
    },

    showFormErrors(errors) {
      Object.entries(errors).forEach(([fieldName, message]) => {
        const field = this.contactForm.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.style.borderColor = "#dc2626";

        const errorText = document.createElement("small");
        errorText.className = "form-error";
        errorText.textContent = message;
        errorText.style.color = "#dc2626";
        errorText.style.display = "block";
        errorText.style.marginTop = "-8px";
        errorText.style.marginBottom = "12px";
        errorText.style.fontSize = "14px";

        field.insertAdjacentElement("afterend", errorText);
      });
    },

    clearFormErrors() {
      const errorMessages = this.contactForm.querySelectorAll(".form-error");
      errorMessages.forEach((error) => error.remove());

      const fields = this.contactForm.querySelectorAll("input, textarea");
      fields.forEach((field) => {
        field.style.borderColor = "#ccc";
      });
    },

    showToast(message) {
      const existingToast = document.querySelector(".custom-toast");
      if (existingToast) existingToast.remove();

      const toast = document.createElement("div");
      toast.className = "custom-toast";
      toast.textContent = message;

      Object.assign(toast.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#0a5c8f",
        color: "#fff",
        padding: "14px 18px",
        borderRadius: "8px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
        zIndex: "2000",
        maxWidth: "320px",
        fontSize: "15px",
        lineHeight: "1.5",
      });

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 3500);
    },

    setupImageFallbacks() {
      if (!this.productImages.length) return;

      this.productImages.forEach((image) => {
        image.addEventListener("error", () => {
          image.src =
            "https://via.placeholder.com/800x500?text=Freeze+Point+Engineering";
          image.alt = "Image unavailable";
        });
      });
    },

    updateFooterYear() {
      if (!this.footerText) return;

      const currentYear = new Date().getFullYear();
      this.footerText.innerHTML = `&copy; ${currentYear} Freeze Point Engineering. All rights reserved.`;
    },

    createBackToTopButton() {
      const button = document.createElement("button");
      button.textContent = "↑";
      button.setAttribute("aria-label", "Back to top");
      button.className = "back-to-top";

      Object.assign(button.style, {
        position: "fixed",
        bottom: "20px",
        left: "20px",
        width: "45px",
        height: "45px",
        border: "none",
        borderRadius: "50%",
        backgroundColor: "#0a5c8f",
        color: "#fff",
        fontSize: "20px",
        cursor: "pointer",
        display: "none",
        zIndex: "2000",
        boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
      });

      button.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      document.body.appendChild(button);
      this.backToTopButton = button;
    },

    toggleBackToTopButton() {
      if (!this.backToTopButton) return;

      if (window.scrollY > 400) {
        this.backToTopButton.style.display = "block";
      } else {
        this.backToTopButton.style.display = "none";
      }
    },
  };

  App.init();
});