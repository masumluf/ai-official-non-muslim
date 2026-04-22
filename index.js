document.addEventListener("DOMContentLoaded", () => {
    const siteLinks = Object.freeze({
        linkedinCompany: "https://www.linkedin.com/company/ummah-heights",
    });
    const revealItems = document.querySelectorAll("[data-reveal]");
    const slides = Array.from(document.querySelectorAll(".slideshow-slide"));
    const slideshowFrame = document.querySelector(".slideshow-frame");
    const dotsContainer = document.querySelector(".slideshow-dots");
    const slideButtons = Array.from(document.querySelectorAll("[data-slide-action]"));
    const autoSlideDelay = 4000;
    let currentSlideIndex = 0;
    let autoSlideTimer = null;

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add("is-visible"));
    }

    document.querySelectorAll("[data-linkedin-company-link]").forEach(link => {
        link.setAttribute("href", siteLinks.linkedinCompany);
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            const target = targetId ? document.querySelector(targetId) : null;

            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    });

    if (slides.length && dotsContainer) {
        function renderSlide(index) {
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dotsContainer.querySelectorAll(".slideshow-dot").forEach((dot, dotIndex) => {
                dot.classList.toggle("is-active", dotIndex === index);
                dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
            });
        }

        function goToSlide(index) {
            currentSlideIndex = (index + slides.length) % slides.length;
            renderSlide(currentSlideIndex);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideTimer = window.setInterval(() => {
                goToSlide(currentSlideIndex + 1);
            }, autoSlideDelay);
        }

        function stopAutoSlide() {
            if (autoSlideTimer !== null) {
                window.clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        }

        function resetAutoSlide() {
            if (slides.length > 1) {
                startAutoSlide();
            }
        }

        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = `slideshow-dot${index === 0 ? " is-active" : ""}`;
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
            dot.setAttribute("aria-current", index === 0 ? "true" : "false");
            dot.addEventListener("click", () => {
                goToSlide(index);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        slideButtons.forEach(button => {
            button.addEventListener("click", () => {
                const direction = button.getAttribute("data-slide-action");
                goToSlide(direction === "next" ? currentSlideIndex + 1 : currentSlideIndex - 1);
                resetAutoSlide();
            });
        });

        renderSlide(currentSlideIndex);

        if (slideshowFrame) {
            slideshowFrame.addEventListener("mouseenter", stopAutoSlide);
            slideshowFrame.addEventListener("mouseleave", resetAutoSlide);
        }

        slideButtons.forEach(button => {
            button.addEventListener("focus", stopAutoSlide);
            button.addEventListener("blur", resetAutoSlide);
        });

        if (slides.length > 1) {
            startAutoSlide();
        }
    }
});
