/* =========================================================
   INFINITY GRANITES — PREMIUM INTERACTIONS
   Vanilla JS | Fast | Mobile Friendly
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =========================================================
     MOBILE NAVIGATION
  ========================================================= */

  const menuToggle = $(
    ".menu-toggle, .nav-toggle, .mobile-menu-toggle, [data-menu-toggle]"
  );

  const navMenu = $(
    ".nav-menu, .nav-links, .navigation, [data-nav]"
  );

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
      document.body.classList.toggle("menu-open");
    });

    $$(".nav-menu a, .nav-links a, .navigation a", navMenu).forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
    });
  }


  /* =========================================================
     SMOOTH SCROLL
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetID = link.getAttribute("href");

      if (!targetID || targetID === "#") return;

      const target = $(targetID);

      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }
    });
  });


  /* =========================================================
     NAVBAR SCROLL EFFECT
  ========================================================= */

  const header = $(
    "header, .site-header, .navbar, .main-header"
  );

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });


  /* =========================================================
     HERO SLIDER
     Supports:
     .hero-slide
     .hero-next
     .hero-prev
     .hero-dot
  ========================================================= */

  const heroSlides = $$(".hero-slide");
  const heroNext = $(".hero-next, [data-hero-next]");
  const heroPrev = $(".hero-prev, [data-hero-prev]");
  const heroDots = $$(".hero-dot, [data-hero-dot]");

  let heroIndex = 0;
  let heroTimer = null;

  function showHero(index) {
    if (!heroSlides.length) return;

    heroIndex =
      (index + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === heroIndex);
      slide.setAttribute(
        "aria-hidden",
        i === heroIndex ? "false" : "true"
      );
    });

    heroDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === heroIndex);
    });
  }

  function startHeroAuto() {
    if (prefersReducedMotion || heroSlides.length < 2) return;

    clearInterval(heroTimer);

    heroTimer = setInterval(() => {
      showHero(heroIndex + 1);
    }, 5500);
  }

  if (heroSlides.length) {
    showHero(0);
    startHeroAuto();
  }

  if (heroNext) {
    heroNext.addEventListener("click", () => {
      showHero(heroIndex + 1);
      startHeroAuto();
    });
  }

  if (heroPrev) {
    heroPrev.addEventListener("click", () => {
      showHero(heroIndex - 1);
      startHeroAuto();
    });
  }

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showHero(index);
      startHeroAuto();
    });
  });


  /* =========================================================
     HERO TOUCH SWIPE
  ========================================================= */

  const hero = $(".hero, .hero-section");

  if (hero && heroSlides.length > 1) {
    let startX = 0;
    let endX = 0;

    hero.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    hero.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].screenX;

        const distance = endX - startX;

        if (Math.abs(distance) < 50) return;

        if (distance < 0) {
          showHero(heroIndex + 1);
        } else {
          showHero(heroIndex - 1);
        }

        startHeroAuto();
      },
      { passive: true }
    );
  }


  /* =========================================================
     PRODUCT CATEGORY SLIDERS
     
     Works with common structures:
     
     .product-slider
       .product-track
       .product-card
       .slider-next
       .slider-prev
  ========================================================= */

  const productSliders = $$(".product-slider, .products-slider, [data-slider]");

  productSliders.forEach((slider) => {
    const track = $(
      ".product-track, .products-track, .slider-track",
      slider
    );

    const cards = $$(
      ".product-card, .product-item, .stone-card",
      slider
    );

    const next = $(
      ".slider-next, .product-next, [data-next]",
      slider
    );

    const prev = $(
      ".slider-prev, .product-prev, [data-prev]",
      slider
    );

    const dots = $$(".slider-dot, .product-dot", slider);

    if (!track || cards.length < 2) return;

    let current = 0;

    const getVisibleCards = () => {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    };

    const moveSlider = (index) => {
      const visible = getVisibleCards();

      const maxIndex = Math.max(
        0,
        cards.length - visible
      );

      current = Math.max(
        0,
        Math.min(index, maxIndex)
      );

      const cardWidth =
        cards[0].getBoundingClientRect().width;

      const gap =
        parseFloat(getComputedStyle(track).gap) || 0;

      track.style.transform =
        `translate3d(-${current * (cardWidth + gap)}px, 0, 0)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === current);
      });
    };

    if (next) {
      next.addEventListener("click", () => {
        const visible = getVisibleCards();

        if (current >= cards.length - visible) {
          moveSlider(0);
        } else {
          moveSlider(current + 1);
        }
      });
    }

    if (prev) {
      prev.addEventListener("click", () => {
        if (current <= 0) {
          moveSlider(cards.length - getVisibleCards());
        } else {
          moveSlider(current - 1);
        }
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        moveSlider(i);
      });
    });

    /* Touch Swipe */

    let startX = 0;
    let currentX = 0;

    track.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );

    track.addEventListener(
      "touchend",
      (e) => {
        currentX = e.changedTouches[0].clientX;

        const distance = currentX - startX;

        if (Math.abs(distance) < 45) return;

        if (distance < 0) {
          const visible = getVisibleCards();

          if (current >= cards.length - visible) {
            moveSlider(0);
          } else {
            moveSlider(current + 1);
          }
        } else {
          if (current <= 0) {
            moveSlider(cards.length - getVisibleCards());
          } else {
            moveSlider(current - 1);
          }
        }
      },
      { passive: true }
    );

    /* Recalculate after resize */

    window.addEventListener(
      "resize",
      () => {
        moveSlider(current);
      },
      { passive: true }
    );

    moveSlider(0);
  });


  /* =========================================================
     GENERIC AUTO SLIDERS
  ========================================================= */

  productSliders.forEach((slider) => {
    const auto =
      slider.dataset.autoplay !== "false";

    if (!auto || prefersReducedMotion) return;

    let interval = Number(
      slider.dataset.interval || 5000
    );

    if (interval < 2500) interval = 2500;

    const next = $(
      ".slider-next, .product-next, [data-next]",
      slider
    );

    if (!next) return;

    let timer = setInterval(() => {
      next.click();
    }, interval);

    slider.addEventListener("mouseenter", () => {
      clearInterval(timer);
    });

    slider.addEventListener("mouseleave", () => {
      timer = setInterval(() => {
        next.click();
      }, interval);
    });

    slider.addEventListener("touchstart", () => {
      clearInterval(timer);
    }, { passive: true });

    slider.addEventListener("touchend", () => {
      timer = setInterval(() => {
        next.click();
      }, interval);
    }, { passive: true });
  });


  /* =========================================================
     SCROLL REVEAL
  ========================================================= */

  const revealElements = $$(
    ".reveal, .reveal-up, .reveal-left, .reveal-right, .fade-in, [data-reveal]"
  );

  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("revealed");

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("revealed");
    });
  }


  /* =========================================================
     STAGGERED CARDS
  ========================================================= */

  const staggerGroups = $$(
    ".product-grid, .category-grid, .services-grid, .projects-grid, .reviews-grid"
  );

  if ("IntersectionObserver" in window) {
    const staggerObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const children = [...entry.target.children];

          children.forEach((child, index) => {
            child.style.setProperty(
              "--delay",
              `${index * 90}ms`
            );

            child.classList.add("stagger-visible");
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.1
      }
    );

    staggerGroups.forEach((group) => {
      staggerObserver.observe(group);
    });
  }


  /* =========================================================
     IMAGE LOAD EFFECT
  ========================================================= */

  $$("img").forEach((img) => {
    if (img.complete) {
      img.classList.add("loaded");
    } else {
      img.addEventListener(
        "load",
        () => img.classList.add("loaded"),
        { once: true }
      );
    }

    img.addEventListener(
      "error",
      () => img.classList.add("image-error"),
      { once: true }
    );
  });


  /* =========================================================
     PREMIUM IMAGE TILT
     Desktop only
  ========================================================= */

  if (!prefersReducedMotion) {
    const tiltCards = $$(".tilt-card, .premium-card, .product-card");

    tiltCards.forEach((card) => {
      let raf = null;

      card.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 1000) return;

        if (raf) cancelAnimationFrame(raf);

        raf = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();

          const x =
            (e.clientX - rect.left) / rect.width - 0.5;

          const y =
            (e.clientY - rect.top) / rect.height - 0.5;

          card.style.setProperty(
            "--rotate-x",
            `${y * -5}deg`
          );

          card.style.setProperty(
            "--rotate-y",
            `${x * 5}deg`
          );

          card.classList.add("tilting");
        });
      });

      card.addEventListener("mouseleave", () => {
        card.classList.remove("tilting");

        card.style.setProperty(
          "--rotate-x",
          "0deg"
        );

        card.style.setProperty(
          "--rotate-y",
          "0deg"
        );
      });
    });
  }


  /* =========================================================
     PARALLAX — LIGHTWEIGHT
  ========================================================= */

  const parallaxElements = $$(
    ".parallax, [data-parallax]"
  );

  if (
    !prefersReducedMotion &&
    parallaxElements.length &&
    window.innerWidth > 768
  ) {
    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;

      parallaxElements.forEach((element) => {
        const speed =
          Number(element.dataset.speed || 0.08);

        const rect =
          element.getBoundingClientRect();

        const center =
          rect.top + rect.height / 2;

        const offset =
          (window.innerHeight / 2 - center) * speed;

        element.style.transform =
          `translate3d(0, ${offset}px, 0)`;
      });

      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
  }


  /* =========================================================
     COUNTERS
  ========================================================= */

  const counters = $$(
    ".counter, [data-counter]"
  );

  function animateCounter(element) {
    const target = Number(
      element.dataset.counter ||
      element.textContent.replace(/[^\d.]/g, "")
    );

    if (!Number.isFinite(target)) return;

    const suffix =
      element.dataset.suffix || "";

    const prefix =
      element.dataset.prefix || "";

    const duration = 1600;
    const startTime = performance.now();

    function update(time) {
      const progress = Math.min(
        (time - startTime) / duration,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      const value =
        Math.floor(target * eased);

      element.textContent =
        `${prefix}${value.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.6
      }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  }


  /* =========================================================
     FAQ ACCORDION
  ========================================================= */

  const faqItems = $$(
    ".faq-item, .faq-card, [data-faq]"
  );

  faqItems.forEach((item) => {
    const question = $(
      ".faq-question, .faq-title, [data-faq-question]",
      item
    );

    const answer = $(
      ".faq-answer, .faq-content, [data-faq-answer]",
      item
    );

    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen =
        item.classList.contains("active");

      /* Close other FAQs */

      faqItems.forEach((other) => {
        if (other === item) return;

        other.classList.remove("active");

        const otherAnswer = $(
          ".faq-answer, .faq-content, [data-faq-answer]",
          other
        );

        if (otherAnswer) {
          otherAnswer.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("active");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("active");

        answer.style.maxHeight =
          `${answer.scrollHeight}px`;
      }
    });
  });


  /* =========================================================
     STONE FINDER / APPLICATION TABS
  ========================================================= */

  const tabGroups = $$(".tab-group, [data-tabs]");

  tabGroups.forEach((group) => {
    const buttons = $$(
      ".tab-btn, .tab-button, [data-tab]",
      group
    );

    const contents = $$(
      ".tab-content, [data-tab-content]",
      group
    );

    if (!buttons.length || !contents.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target =
          button.dataset.tab ||
          button.getAttribute("data-target");

        buttons.forEach((btn) =>
          btn.classList.remove("active")
        );

        contents.forEach((content) =>
          content.classList.remove("active")
        );

        button.classList.add("active");

        const content =
          $(`[data-tab-content="${target}"]`, group) ||
          $(`#${target}`, group);

        if (content) {
          content.classList.add("active");
        }
      });
    });
  });


  /* =========================================================
     STONE COMPARISON
  ========================================================= */

  const comparisonButtons = $$(
    ".comparison-option, [data-comparison]"
  );

  comparisonButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const group =
        button.closest(
          ".comparison-section, .comparison-wrapper, [data-comparison-group]"
        );

      if (!group) return;

      $$(".comparison-option, [data-comparison]", group)
        .forEach((item) => {
          item.classList.remove("active");
        });

      button.classList.add("active");

      const target =
        button.dataset.comparison ||
        button.dataset.target;

      if (!target) return;

      $$(
        ".comparison-result, [data-comparison-result]",
        group
      ).forEach((result) => {
        result.classList.toggle(
          "active",
          result.dataset.comparisonResult === target ||
          result.id === target
        );
      });
    });
  });


  /* =========================================================
     REVIEW SLIDER
  ========================================================= */

  const reviewSections = $$(
    ".reviews-slider, .testimonial-slider, [data-reviews]"
  );

  reviewSections.forEach((section) => {
    const cards = $$(
      ".review-card, .testimonial-card, .review-item",
      section
    );

    const next = $(
      ".review-next, .testimonial-next, [data-review-next]",
      section
    );

    const prev = $(
      ".review-prev, .testimonial-prev, [data-review-prev]",
      section
    );

    if (cards.length < 2) return;

    let index = 0;

    const showReview = (newIndex) => {
      index =
        (newIndex + cards.length) % cards.length;

      cards.forEach((card, i) => {
        card.classList.toggle(
          "active",
          i === index
        );
      });
    };

    showReview(0);

    if (next) {
      next.addEventListener("click", () => {
        showReview(index + 1);
      });
    }

    if (prev) {
      prev.addEventListener("click", () => {
        showReview(index - 1);
      });
    }

    if (!prefersReducedMotion) {
      setInterval(() => {
        showReview(index + 1);
      }, 6500);
    }
  });


  /* =========================================================
     LAZY LOAD FALLBACK
  ========================================================= */

  const lazyImages = $$("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const img = entry.target;

          if (img.dataset.src) {
            img.src = img.dataset.src;
          }

          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }

          img.removeAttribute("data-src");
          img.removeAttribute("data-srcset");

          observer.unobserve(img);
        });
      },
      {
        rootMargin: "250px"
      }
    );

    lazyImages.forEach((img) =>
      imageObserver.observe(img)
    );
  }


  /* =========================================================
     IMAGE LIGHTBOX
     Product / project images
  ========================================================= */

  const lightboxTriggers = $$(
    ".lightbox-trigger, [data-lightbox]"
  );

  const lightbox = $(
    ".lightbox, #lightbox"
  );

  if (lightbox && lightboxTriggers.length) {
    const lightboxImage = $(
      ".lightbox-image, #lightbox-image",
      lightbox
    );

    const closeLightbox = $(
      ".lightbox-close, [data-lightbox-close]",
      lightbox
    );

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const image =
          trigger.dataset.lightbox ||
          trigger.getAttribute("src");

        if (!image || !lightboxImage) return;

        lightboxImage.src = image;

        lightbox.classList.add("active");
        document.body.classList.add("lightbox-open");
      });
    });

    const close = () => {
      lightbox.classList.remove("active");
      document.body.classList.remove("lightbox-open");
    };

    if (closeLightbox) {
      closeLightbox.addEventListener("click", close);
    }

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
      }
    });
  }


  /* =========================================================
     CONTACT / WHATSAPP
  ========================================================= */

  const enquiryForms = $$(
    "#enquiryForm, .enquiry-form, [data-enquiry-form]"
  );

  const whatsappNumber = "919XXXXXXXXX";

  enquiryForms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name =
        $('[name="name"]', form)?.value.trim() || "";

      const phone =
        $('[name="phone"]', form)?.value.trim() || "";

      const email =
        $('[name="email"]', form)?.value.trim() || "";

      const message =
        $('[name="message"]', form)?.value.trim() || "";

      const text =
`Hello Infinity Granites,

I would like to enquire about your granite products.

Name: ${name}
Phone: ${phone}
Email: ${email}
Requirement: ${message}`;

      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );
    });
  });


  /* =========================================================
     COPY EMAIL
  ========================================================= */

  $$("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", async () => {
      const email =
        button.dataset.copyEmail ||
        "granitesinfinity@gmail.com";

      try {
        await navigator.clipboard.writeText(email);

        const original =
          button.textContent;

        button.textContent = "Copied";

        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      } catch {
        window.location.href =
          `mailto:${email}`;
      }
    });
  });


  /* =========================================================
     MOUSE GLOW
     Premium desktop effect
  ========================================================= */

  const glowSections = $$(
    ".glow-section, .premium-section, [data-glow]"
  );

  if (!prefersReducedMotion && window.innerWidth > 900) {
    glowSections.forEach((section) => {
      section.addEventListener("mousemove", (e) => {
        const rect =
          section.getBoundingClientRect();

        section.style.setProperty(
          "--mouse-x",
          `${e.clientX - rect.left}px`
        );

        section.style.setProperty(
          "--mouse-y",
          `${e.clientY - rect.top}px`
        );
      });
    });
  }


  /* =========================================================
     MAGNETIC BUTTONS
  ========================================================= */

  if (!prefersReducedMotion && window.innerWidth > 1000) {
    $$(".magnetic").forEach((button) => {
      button.addEventListener("mousemove", (e) => {
        const rect =
          button.getBoundingClientRect();

        const x =
          e.clientX -
          rect.left -
          rect.width / 2;

        const y =
          e.clientY -
          rect.top -
          rect.height / 2;

        button.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });

      button.addEventListener("mouseleave", () => {
        button.style.transform = "";
      });
    });
  }


  /* =========================================================
     ACTIVE SECTION NAVIGATION
  ========================================================= */

  const sections = $$(
    "main section[id], section[id]"
  );

  const navLinks = $$(
    '.nav-menu a[href^="#"], .nav-links a[href^="#"], header a[href^="#"]'
  );

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") ===
                `#${entry.target.id}`
            );
          });
        });
      },
      {
        threshold: 0.25,
        rootMargin: "-20% 0px -60% 0px"
      }
    );

    sections.forEach((section) =>
      sectionObserver.observe(section)
    );
  }


  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const backTop = $(
    ".back-to-top, #backToTop, [data-back-top]"
  );

  if (backTop) {
    const toggleBackTop = () => {
      backTop.classList.toggle(
        "visible",
        window.scrollY > 600
      );
    };

    toggleBackTop();

    window.addEventListener(
      "scroll",
      toggleBackTop,
      { passive: true }
    );

    backTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion
          ? "auto"
          : "smooth"
      });
    });
  }


  /* =========================================================
     CURRENT YEAR
  ========================================================= */

  $$("[data-year], #year").forEach((element) => {
    element.textContent =
      new Date().getFullYear();
  });


  /* =========================================================
     PRELOADER
  ========================================================= */

  const preloader = $(
    ".preloader, #preloader, [data-preloader]"
  );

  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("loaded");

        setTimeout(() => {
          preloader.remove();
        }, 700);
      }, 250);
    });
  }


  /* =========================================================
     3D CARD SHINE
  ========================================================= */

  if (!prefersReducedMotion && window.innerWidth > 900) {
    $$(".shine-card, .product-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect =
          card.getBoundingClientRect();

        const x =
          ((e.clientX - rect.left) /
            rect.width) *
          100;

        const y =
          ((e.clientY - rect.top) /
            rect.height) *
          100;

        card.style.setProperty(
          "--shine-x",
          `${x}%`
        );

        card.style.setProperty(
          "--shine-y",
          `${y}%`
        );
      });
    });
  }


  /* =========================================================
     PREVENT BROKEN HASH ON LOAD
  ========================================================= */

  if (window.location.hash) {
    setTimeout(() => {
      const target =
        $(window.location.hash);

      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "auto"
        });
      }
    }, 100);
  }


  /* =========================================================
     PERFORMANCE:
     PAUSE HEAVY EFFECTS WHEN TAB HIDDEN
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        clearInterval(heroTimer);
      } else {
        startHeroAuto();
      }
    }
  );


  /* =========================================================
     CONSOLE BRAND
  ========================================================= */

  console.log(
    "%c INFINITY GRANITES ",
    "font-size:18px;font-weight:bold;"
  );

  console.log(
    "%c Premium Natural Stone Experience",
    "font-size:12px;"
  );

});
