const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector(".form-status");
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryLightbox = document.querySelector("[data-gallery-lightbox]");
const galleryPreview = document.querySelector("[data-gallery-preview]");
const galleryCaption = document.querySelector("[data-gallery-caption]");
const galleryClose = document.querySelector("[data-gallery-close]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
const testimonialCarousel = document.querySelector("[data-testimonial-carousel]");
const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const testimonialDots = document.querySelectorAll("[data-testimonial-dot]");
const testimonialPrev = document.querySelector("[data-testimonial-prev]");
const testimonialNext = document.querySelector("[data-testimonial-next]");

if (window.location.pathname.endsWith("index.html") && window.location.hash === "#contact") {
  window.location.replace("contact.html#quote-form");
}

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

function scrollToHashTarget() {
  if (!window.location.hash) {
    return;
  }

  const target = document.querySelector(window.location.hash);
  if (target) {
    window.setTimeout(() => {
      const headerOffset = header ? header.offsetHeight + 24 : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "auto" });
    }, 0);
  }
}

scrollToHashTarget();
window.addEventListener("load", scrollToHashTarget);

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formStatus.textContent = "Thanks. Titan will follow up with the next step shortly.";
    contactForm.reset();
  });
}

if (testimonialCarousel && testimonialSlides.length && testimonialDots.length && testimonialPrev && testimonialNext) {
  let currentTestimonialIndex = 0;
  let testimonialTimer;

  function showTestimonial(index) {
    currentTestimonialIndex = (index + testimonialSlides.length) % testimonialSlides.length;

    testimonialSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentTestimonialIndex);
    });

    testimonialDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentTestimonialIndex);
    });
  }

  function startTestimonials() {
    window.clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(() => {
      showTestimonial(currentTestimonialIndex + 1);
    }, 5200);
  }

  testimonialPrev.addEventListener("click", () => {
    showTestimonial(currentTestimonialIndex - 1);
    startTestimonials();
  });

  testimonialNext.addEventListener("click", () => {
    showTestimonial(currentTestimonialIndex + 1);
    startTestimonials();
  });

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonial(index);
      startTestimonials();
    });
  });

  testimonialCarousel.addEventListener("mouseenter", () => window.clearInterval(testimonialTimer));
  testimonialCarousel.addEventListener("mouseleave", startTestimonials);
  testimonialCarousel.addEventListener("focusin", () => window.clearInterval(testimonialTimer));
  testimonialCarousel.addEventListener("focusout", startTestimonials);

  showTestimonial(0);
  startTestimonials();
}

if (galleryLightbox && galleryPreview && galleryCaption && galleryClose && galleryPrev && galleryNext) {
  let currentGalleryIndex = 0;

  function closeGallery() {
    if (typeof galleryLightbox.close === "function") {
      galleryLightbox.close();
    } else {
      galleryLightbox.removeAttribute("open");
    }
  }

  function showGalleryItem(index) {
    const nextIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[nextIndex];
    const image = item.querySelector("img");
    const caption = item.querySelector("figcaption");

    currentGalleryIndex = nextIndex;
    galleryPreview.src = image.src;
    galleryPreview.alt = image.alt;
    galleryCaption.textContent = caption ? caption.textContent : image.alt;
  }

  function openGalleryItem(index) {
    showGalleryItem(index);
    if (typeof galleryLightbox.showModal === "function") {
      galleryLightbox.showModal();
    } else {
      galleryLightbox.setAttribute("open", "");
    }
  }

  function moveGallery(direction) {
    showGalleryItem(currentGalleryIndex + direction);
  }

  galleryItems.forEach((item, index) => {
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `View ${item.querySelector("figcaption")?.textContent || "gallery image"}`);

    item.addEventListener("click", () => openGalleryItem(index));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openGalleryItem(index);
      }
    });
  });

  galleryClose.addEventListener("click", closeGallery);
  galleryPrev.addEventListener("click", () => moveGallery(-1));
  galleryNext.addEventListener("click", () => moveGallery(1));
  galleryLightbox.addEventListener("click", (event) => {
    if (event.target === galleryLightbox) {
      closeGallery();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (!galleryLightbox.hasAttribute("open")) {
      return;
    }

    if (event.key === "ArrowLeft") {
      moveGallery(-1);
    }

    if (event.key === "ArrowRight") {
      moveGallery(1);
    }
  });
}
