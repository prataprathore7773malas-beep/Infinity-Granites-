/* =========================================================
   INFINITY GRANITES
   FAST + PREMIUM + NON-BLOCKING JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
     BASIC HELPERS
  ========================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    Array.from(parent.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =========================================================
     1. FAST PRELOADER
  ========================================================= */

  const preloader = $(
    "#pageLoader, .page-loader, #preloader, .preloader"
  );

  if (preloader) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        preloader.classList.add("loaded");

        setTimeout(() => {
          if (preloader && preloader.parentNode) {
            preloader.remove();
          }
        }, 650);
      }, 250);
    });
  }


  /* =========================================================
     2. FORCE EAGER IMAGE LOADING

     No lazy loading anywhere.
  ========================================================= */

  const allImages = $$("img");

  allImages.forEach((img) => {
    img.loading = "eager";
    img.decoding = "async";

    img.removeAttribute("data-src");
    img.removeAttribute("data-srcset");

    if (img.getAttribute("loading") === "lazy") {
      img.setAttribute("loading", "eager");
    }

    img.classList.add("image-ready");

    img.addEventListener(
      "error",
      () => {
        img.classList.add("image-error");
        img.setAttribute("data-missing", "true");
      },
      { once: true }
    );
  });


  /* =========================================================
     3. HERO IMAGE PRELOAD

     Video preload is handled by the Hero <video> elements.
     We do not create additional video requests here.
  ========================================================= */

  const heroFiles = [
    "h1.png",
    "h2.png",
    "h3.png",
    "h4.png",
    "h5.png",
    "h6.png"
  ];

  const heroPreload = heroFiles.map((src, index) => {
    const image = new Image();

    image.decoding = "async";

    if (index === 0) {
      image.fetchPriority = "high";
    }

    image.src = src;

    return image;
  });


  /* =========================================================
     4. HEADER + MOBILE MENU
  ========================================================= */

  const header = $(".site-header, .site-header#siteHeader");
  const menuToggle = $("#menuToggle");
  const mobileMenu = $("#mobileMenu");
  const mobileLinks = $$(".mobile-nav a");

  function closeMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");

    mobileMenu.classList.remove("open");

    document.body.classList.remove("menu-open");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const opened = mobileMenu.classList.toggle("open");

      menuToggle.classList.toggle("active", opened);

      menuToggle.setAttribute(
        "aria-expanded",
        opened ? "true" : "false"
      );

      document.body.classList.toggle(
        "menu-open",
        opened
      );
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }


  /* =========================================================
     5. HEADER SCROLL STATE
  ========================================================= */

  function updateHeader() {
    if (!header) return;

    header.classList.toggle(
      "scrolled",
      window.scrollY > 35
    );
  }

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* =========================================================
     6. SMOOTH ANCHOR NAVIGATION
  ========================================================= */

  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetID = link.getAttribute("href");

      if (!targetID || targetID === "#") {
        return;
      }

      const target = $(targetID);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });


  /* =========================================================
     7. HERO SLIDER

     SEQUENCE:

     i.mp4
     h1.png
     h2.png
     h3.png
     b.mp4
     h4.png
     h5.png
     h6.png

     Images = 5.2 seconds
     Videos = full natural duration
  ========================================================= */

  const heroSlides = $$(".hero-slide");
  const heroCurrent = $("#heroCurrent");

  let heroIndex = 0;
  let heroTimer = null;

  const HERO_IMAGE_DURATION = 5200;


  /* ---------------------------------------------------------
     CLEAR HERO TIMER
  --------------------------------------------------------- */

  function clearHeroTimer() {
    if (heroTimer) {
      clearTimeout(heroTimer);
      heroTimer = null;
    }
  }


  /* ---------------------------------------------------------
     STOP ALL HERO VIDEOS
  --------------------------------------------------------- */

  function stopHeroVideos() {
    $$(".hero-slide video").forEach((video) => {
      video.pause();

      try {
        video.currentTime = 0;
      } catch (error) {
        // Ignore browser restrictions.
      }
    });
  }


  /* ---------------------------------------------------------
     IMAGE TIMER
  --------------------------------------------------------- */

  function scheduleHeroImage() {
    clearHeroTimer();

    heroTimer = setTimeout(() => {
      renderHero(heroIndex + 1);
    }, HERO_IMAGE_DURATION);
  }


  /* ---------------------------------------------------------
     RENDER HERO
  --------------------------------------------------------- */

  function renderHero(index) {
    if (!heroSlides.length) return;

    clearHeroTimer();
    stopHeroVideos();

    heroIndex =
      (index + heroSlides.length) %
      heroSlides.length;


    /* -------------------------------------------------------
       ACTIVE SLIDE
    ------------------------------------------------------- */

    heroSlides.forEach((slide, i) => {
      const active =
        i === heroIndex;

      slide.classList.toggle(
        "active",
        active
      );

      slide.setAttribute(
        "aria-hidden",
        active ? "false" : "true"
      );
    });


    /* -------------------------------------------------------
       COUNTER
    ------------------------------------------------------- */

    if (heroCurrent) {
      heroCurrent.textContent =
        String(
          heroIndex + 1
        ).padStart(
          2,
          "0"
        );
    }


    /* -------------------------------------------------------
       CURRENT SLIDE
    ------------------------------------------------------- */

    const currentSlide =
      heroSlides[heroIndex];

    if (!currentSlide) {
      return;
    }


    const currentVideo =
      $("video", currentSlide);


    /* =======================================================
       VIDEO SLIDE

       Play video completely.
       On "ended" -> next slide.
    ======================================================= */

    if (currentVideo) {

      currentVideo.muted = true;
      currentVideo.playsInline = true;
      currentVideo.preload = "auto";

      try {
        currentVideo.currentTime = 0;
      } catch (error) {
        // Ignore browser restrictions.
      }


      const handleVideoEnd = () => {

        if (
          heroSlides[heroIndex] !==
          currentSlide
        ) {
          return;
        }

        renderHero(
          heroIndex + 1
        );
      };


      currentVideo.addEventListener(
        "ended",
        handleVideoEnd,
        {
          once: true
        }
      );


      const playPromise =
        currentVideo.play();


      /*
        If browser blocks autoplay,
        fallback to image timing so
        Hero never gets stuck.
      */

      if (
        playPromise &&
        typeof playPromise.catch ===
          "function"
      ) {

        playPromise.catch(() => {
          scheduleHeroImage();
        });

      }

      return;
    }


    /* =======================================================
       IMAGE SLIDE
    ======================================================= */

    scheduleHeroImage();
  }


  /* ---------------------------------------------------------
     START HERO
  --------------------------------------------------------- */

  renderHero(0);


  /* =========================================================
     8. HERO SWIPE
  ========================================================= */

  const hero = $(".hero");

  if (
    hero &&
    heroSlides.length > 1
  ) {

    let touchStartX = 0;


    hero.addEventListener(
      "touchstart",
      (event) => {
        touchStartX =
          event.changedTouches[0].clientX;
      },
      {
        passive: true
      }
    );


    hero.addEventListener(
      "touchend",
      (event) => {

        const touchEndX =
          event.changedTouches[0].clientX;

        const distance =
          touchEndX - touchStartX;


        if (
          Math.abs(distance) <
          45
        ) {
          return;
        }


        if (distance < 0) {

          renderHero(
            heroIndex + 1
          );

        } else {

          renderHero(
            heroIndex - 1
          );

        }

      },
      {
        passive: true
      }
    );
  }


  /* =========================================================
     9. PRODUCT / COLLECTION SLIDERS

     IMPORTANT:
     - NO AUTO SLIDER
     - MANUAL BUTTONS ONLY
     - MOBILE SWIPE ONLY
     - NEVER MOVE THE WHOLE PAGE
  ========================================================= */

  const productSliders =
    $$(".product-slider");

  productSliders.forEach((slider) => {

    const track =
      $(".product-track", slider);

    const cards =
      $$(".product-card", slider);

    const prev =
      $(".slider-prev", slider);

    const next =
      $(".slider-next", slider);

    const progress =
      $(".slider-progress span", slider);

    if (
      !track ||
      !cards.length
    ) {
      return;
    }

    let index = 0;


    /* ---------------------------------------------------------
       VISIBLE CARDS
    --------------------------------------------------------- */

    function getVisible() {

      if (
        window.innerWidth <=
        600
      ) {
        return 1;
      }

      if (
        window.innerWidth <=
        900
      ) {
        return 2;
      }

      return 5;
    }


    /* ---------------------------------------------------------
       GAP
    --------------------------------------------------------- */

    function getGap() {

      const styles =
        window.getComputedStyle(
          track
        );

      return (
        parseFloat(
          styles.columnGap
        ) ||
        parseFloat(
          styles.gap
        ) ||
        0
      );
    }


    /* ---------------------------------------------------------
       MOVE PRODUCT TRACK

       shouldScroll=true ONLY after
       manual user interaction.
    --------------------------------------------------------- */

    function moveTo(
      newIndex,
      shouldScroll = false
    ) {

      const visible =
        getVisible();


      const maxIndex =
        Math.max(
          0,
          cards.length -
          visible
        );


      index =
        Math.max(
          0,
          Math.min(
            newIndex,
            maxIndex
          )
        );


      /* -------------------------------------------------------
         MOBILE

         IMPORTANT:
         Never use card.scrollIntoView()
         because it moves the WHOLE page.
      ------------------------------------------------------- */

      if (
        window.innerWidth <=
        600
      ) {

        const card =
          cards[index];


        if (
          card &&
          shouldScroll
        ) {

          const trackRect =
            track.getBoundingClientRect();

          const cardRect =
            card.getBoundingClientRect();


          const maxScroll =
            Math.max(
              0,
              track.scrollWidth -
              track.clientWidth
            );


          const targetLeft =
            track.scrollLeft +
            (
              cardRect.left -
              trackRect.left
            );


          track.scrollTo({
            left:
              Math.min(
                maxScroll,
                Math.max(
                  0,
                  targetLeft
                )
              ),

            behavior:
              reduceMotion
                ? "auto"
                : "smooth"
          });
        }
      }


      /* -------------------------------------------------------
         DESKTOP / TABLET
      ------------------------------------------------------- */

      else {

        const cardWidth =
          cards[0]
            .getBoundingClientRect()
            .width;


        const distance =
          index *
          (
            cardWidth +
            getGap()
          );


        track.style.transform =
          `translate3d(-${distance}px,0,0)`;
      }


      /* -------------------------------------------------------
         PROGRESS
      ------------------------------------------------------- */

      if (progress) {

        const total =
          Math.max(
            1,
            cards.length -
            visible
          );


        const percent =
          (
            (index + 1) /
            (total + 1)
          ) * 100;


        progress.style.width =
          `${Math.min(
            100,
            percent
          )}%`;
      }
    }


    /* ---------------------------------------------------------
       NEXT
    --------------------------------------------------------- */

    function nextSlide() {

      const visible =
        getVisible();


      const targetIndex =
        index >=
        cards.length -
        visible

          ? 0

          : index + 1;


      moveTo(
        targetIndex,
        true
      );
    }


    /* ---------------------------------------------------------
       PREVIOUS
    --------------------------------------------------------- */

    function previousSlide() {

      const visible =
        getVisible();


      const targetIndex =
        index <= 0

          ? Math.max(
              0,
              cards.length -
              visible
            )

          : index - 1;


      moveTo(
        targetIndex,
        true
      );
    }


    /* ---------------------------------------------------------
       MANUAL NEXT
    --------------------------------------------------------- */

    if (next) {

      next.addEventListener(
        "click",
        () => {
          nextSlide();
        }
      );
    }


    /* ---------------------------------------------------------
       MANUAL PREVIOUS
    --------------------------------------------------------- */

    if (prev) {

      prev.addEventListener(
        "click",
        () => {
          previousSlide();
        }
      );
    }


    /* ---------------------------------------------------------
       INITIAL STATE

       Never scroll page on load.
    --------------------------------------------------------- */

    moveTo(
      0,
      false
    );


    /* =======================================================
       MOBILE TOUCH SWIPE
    ======================================================= */

    let startX = 0;
    let endX = 0;


    track.addEventListener(
      "touchstart",
      (event) => {

        startX =
          event.changedTouches[0].clientX;

      },
      {
        passive: true
      }
    );


    track.addEventListener(
      "touchend",
      (event) => {

        endX =
          event.changedTouches[0].clientX;


        const distance =
          endX - startX;


        if (
          Math.abs(distance) <
          45
        ) {
          return;
        }


        if (
          distance < 0
        ) {

          nextSlide();

        } else {

          previousSlide();

        }

      },
      {
        passive: true
      }
    );


    /* =======================================================
       RESIZE

       Never scroll page on resize.
    ======================================================= */

    window.addEventListener(
      "resize",
      () => {

        moveTo(
          index,
          false
        );

      },
      {
        passive: true
      }
    );

  });


  /* =========================================================
     10. STONE FINDER
  ========================================================= */

  const finder =
    $(".finder-panel");

  if (finder) {

    const steps =
      $$(".finder-step", finder);

    const buttons =
      $$(".finder-options button", finder);

    const result =
      $("#finderResult");

    const stepCounter =
      $("#finderStep");

    const progress =
      $("#finderProgress");

    const resultTitle =
      $("#finderResultTitle");

    const resultText =
      $("#finderResultText");

    let currentStep = 0;

    const choices = [];


    function showFinderStep(
      step
    ) {

      if (
        !steps.length
      ) {
        return;
      }


      currentStep =
        Math.max(
          0,
          Math.min(
            step,
            steps.length - 1
          )
        );


      steps.forEach(
        (item, i) => {

          item.classList.toggle(
            "active",
            i === currentStep
          );

        }
      );


      if (stepCounter) {

        stepCounter.textContent =
          `${String(
            currentStep + 1
          ).padStart(
            2,
            "0"
          )} / ${String(
            steps.length
          ).padStart(
            2,
            "0"
          )}`;

      }


      if (progress) {

        progress.style.width =
          `${(
            (
              currentStep +
              1
            ) /
            steps.length
          ) * 100}%`;
      }
    }


    function getRecommendation() {

      const values =
        choices.map(
          (item) =>
            item || ""
        );


      let title =
        "Signature Stone";


      let description =
        "Your choices point towards a stone with strong natural character and architectural presence.";


      if (
        values.includes(
          "Bold"
        ) ||
        values.includes(
          "Commercial"
        )
      ) {

        title =
          "The Architectural Choice";


        description =
          "A stronger, more expressive stone direction suits a project where material becomes part of the identity.";

      }


      else if (
        values.includes(
          "Elegant"
        ) ||
        values.includes(
          "Minimal"
        )
      ) {

        title =
          "The Refined Choice";


        description =
          "A clean and elegant stone direction can create a restrained, sophisticated architectural feel.";

      }


      else if (
        values.includes(
          "Natural"
        ) ||
        values.includes(
          "Facade"
        )
      ) {

        title =
          "The Natural Choice";


        description =
          "A stone with stronger natural character is a compelling direction for a warm and authentic space.";

      }


      return {
        title,
        description
      };
    }


    buttons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const step =
              Number(
                button
                  .closest(
                    ".finder-step"
                  )
                  ?.dataset.step ||
                1
              );


            const value =
              button.dataset.value ||
              button.textContent.trim();


            choices[
              step - 1
            ] = value;


            $$(
              ".finder-options button",
              button.closest(
                ".finder-step"
              )
            ).forEach(
              (item) => {

                item.classList.remove(
                  "selected"
                );

              }
            );


            button.classList.add(
              "selected"
            );


            if (
              step >=
              steps.length
            ) {

              const recommendation =
                getRecommendation();


              if (resultTitle) {

                resultTitle.textContent =
                  recommendation.title;

              }


              if (resultText) {

                resultText.textContent =
                  recommendation.description;

              }


              steps.forEach(
                (item) => {

                  item.classList.remove(
                    "active"
                  );

                }
              );


              if (result) {

                result.classList.add(
                  "show"
                );

              }


              if (stepCounter) {

                stepCounter.textContent =
                  "RESULT";

              }


              if (progress) {

                progress.style.width =
                  "100%";

              }


              return;
            }


            setTimeout(
              () => {
                showFinderStep(
                  step
                );
              },
              220
            );

          }
        );

      }
    );


    showFinderStep(0);
  }


  /* =========================================================
     11. APPLICATION CARDS
  ========================================================= */

  const applicationCards =
    $$(".application-card");

  applicationCards.forEach(
    (card) => {

      card.addEventListener(
        "click",
        () => {

          applicationCards.forEach(
            (item) => {

              item.classList.remove(
                "active"
              );

            }
          );


          card.classList.add(
            "active"
          );


          const application =
            card.dataset.application;


          const discoverSection =
            $("#discover");


          if (
            discoverSection &&
            application
          ) {

            discoverSection.dataset.selectedApplication =
              application;

          }

        }
      );

    }
  );


  /* =========================================================
     12. WHY INFINITY REVEAL
  ========================================================= */

  const whyItems =
    $$(".why-item");

  if (
    "IntersectionObserver" in
    window
  ) {

    const whyObserver =
      new IntersectionObserver(
        (
          entries,
          observer
        ) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              whyItems.forEach(
                (item, i) => {

                  item.style.transitionDelay =
                    `${i * 70}ms`;


                  item.classList.add(
                    "visible",
                    "revealed"
                  );

                }
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:
            0.15
        }
      );


    const whySection =
      $("#why-infinity");


    if (whySection) {

      whyObserver.observe(
        whySection
      );

    }

  }


  /* =========================================================
     13. SCROLL REVEAL
  ========================================================= */

  const revealItems =
    $$(".reveal");

  if (
    "IntersectionObserver" in
    window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (
          entries,
          observer
        ) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                "visible",
                "revealed"
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold:
            0.08,

          rootMargin:
            "0px 0px -40px 0px"
        }
      );


    revealItems.forEach(
      (item) => {

        revealObserver.observe(
          item
        );

      }
    );

  }


  else {

    revealItems.forEach(
      (item) => {

        item.classList.add(
          "visible",
          "revealed"
        );

      }
    );

  }


  /* =========================================================
     14. FAQ ACCORDION
  ========================================================= */

  const faqItems =
    $$(".faq-item");

  faqItems.forEach(
    (item) => {

      const question =
        $(".faq-question", item);

      const answer =
        $(".faq-answer", item);


      if (
        !question ||
        !answer
      ) {
        return;
      }


      if (
        item.classList.contains(
          "active"
        )
      ) {

        answer.style.maxHeight =
          `${answer.scrollHeight}px`;

      }


      question.addEventListener(
        "click",
        () => {

          const wasActive =
            item.classList.contains(
              "active"
            );


          faqItems.forEach(
            (other) => {

              other.classList.remove(
                "active"
              );


              const otherAnswer =
                $(".faq-answer", other);


              if (otherAnswer) {

                otherAnswer.style.maxHeight =
                  null;

              }

            }
          );


          if (!wasActive) {

            item.classList.add(
              "active"
            );


            answer.style.maxHeight =
              `${answer.scrollHeight}px`;

          }

        }
      );

    }
  );


  /* =========================================================
     15. REVIEWS SLIDER
  ========================================================= */

  const reviewSlider =
    $("#reviewsSlider");

  if (reviewSlider) {

    const slides =
      $$(".review-slide", reviewSlider);

    const prev =
      $("#reviewPrev");

    const next =
      $("#reviewNext");

    const dots =
      $$(".review-dots button");


    let reviewIndex = 0;
    let reviewTimer = null;


    function renderReview(
      index
    ) {

      if (
        !slides.length
      ) {
        return;
      }


      reviewIndex =
        (
          index +
          slides.length
        ) %
        slides.length;


      slides.forEach(
        (slide, i) => {

          slide.classList.toggle(
            "active",
            i === reviewIndex
          );

        }
      );


      dots.forEach(
        (dot, i) => {

          dot.classList.toggle(
            "active",
            i === reviewIndex
          );

        }
      );

    }


    function startReviewAuto() {

      if (
        reduceMotion
      ) {
        return;
      }


      clearInterval(
        reviewTimer
      );


      reviewTimer =
        setInterval(
          () => {

            renderReview(
              reviewIndex + 1
            );

          },
          6500
        );

    }


    if (prev) {

      prev.addEventListener(
        "click",
        () => {

          renderReview(
            reviewIndex - 1
          );

          startReviewAuto();

        }
      );

    }


    if (next) {

      next.addEventListener(
        "click",
        () => {

          renderReview(
            reviewIndex + 1
          );

          startReviewAuto();

        }
      );

    }


    dots.forEach(
      (dot, index) => {

        dot.addEventListener(
          "click",
          () => {

            renderReview(
              index
            );

            startReviewAuto();

          }
        );

      }
    );


    renderReview(0);

    startReviewAuto();

  }


  /* =========================================================
     16. REVIEW SWIPE
  ========================================================= */

  if (reviewSlider) {

    let startX = 0;


    reviewSlider.addEventListener(
      "touchstart",
      (event) => {

        startX =
          event.changedTouches[0].clientX;

      },
      {
        passive: true
      }
    );


    reviewSlider.addEventListener(
      "touchend",
      (event) => {

        const endX =
          event.changedTouches[0].clientX;


        const distance =
          endX - startX;


        if (
          Math.abs(distance) <
          45
        ) {
          return;
        }


        if (
          distance < 0
        ) {

          $("#reviewNext")?.click();

        } else {

          $("#reviewPrev")?.click();

        }

      },
      {
        passive: true
      }
    );

  }


  /* =========================================================
     17. PRODUCT QUICK VIEW MODAL
  ========================================================= */

  const modal =
    $("#productModal");

  const modalImage =
    $("#modalProductImage");

  const modalName =
    $("#modalProductName");

  const modalFinish =
    $("#modalProductFinish");

  const modalIndex =
    $("#modalProductIndex");

  const productOpenButtons =
    $$(".product-open");


  function closeProductModal() {

    if (!modal) {
      return;
    }


    modal.classList.remove(
      "open"
    );


    modal.setAttribute(
      "aria-hidden",
      "true"
    );


    document.body.classList.remove(
      "modal-open"
    );
  }


  productOpenButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const card =
            button.closest(
              ".product-card"
            );


          if (
            !card ||
            !modal
          ) {
            return;
          }


          const image =
            $(".product-image img", card);


          const name =
            $(".product-info h4", card);


          const finish =
            $(".product-info p", card);


          const number =
            $(".product-image > span", card);


          if (
            modalImage &&
            image
          ) {

            modalImage.src =
              image.currentSrc ||
              image.src;


            modalImage.alt =
              image.alt ||
              "Granite";

          }


          if (
            modalName &&
            name
          ) {

            modalName.textContent =
              name.textContent;

          }


          if (
            modalFinish &&
            finish
          ) {

            modalFinish.textContent =
              finish.textContent;

          }


          if (
            modalIndex &&
            number
          ) {

            modalIndex.textContent =
              number.textContent;

          }


          modal.classList.add(
            "open"
          );


          modal.setAttribute(
            "aria-hidden",
            "false"
          );


          document.body.classList.add(
            "modal-open"
          );

        }
      );

    }
  );


  $$(
    "[data-close-modal]",
    modal
  ).forEach(
    (element) => {

      element.addEventListener(
        "click",
        (event) => {

          event.preventDefault();

          closeProductModal();

        }
      );

    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Escape"
      ) {

        closeProductModal();

      }

    }
  );


  /* =========================================================
     18. ENQUIRY -> WHATSAPP
  ========================================================= */

  const enquiryForm =
    $("#enquiryForm");


  if (enquiryForm) {

    enquiryForm.addEventListener(
      "submit",
      (event) => {

        event.preventDefault();


        const getValue =
          (name) => {

            const field =
              enquiryForm.elements[
                name
              ];


            return field
              ? field.value.trim()
              : "";

          };


        const name =
          getValue("name");


        const phone =
          getValue("phone");


        const email =
          getValue("email");


        const company =
          getValue("company");


        const requirement =
          getValue(
            "requirement"
          );


        const product =
          getValue("product");


        const message =
          getValue("message");


        const whatsappText =
`Hello Infinity Granites,

I would like to enquire about your granite.

Name: ${name}
Phone: ${phone}
Email: ${email}
Company: ${company}
Requirement: ${requirement}
Granite / Product: ${product}
Message: ${message}`;


        const whatsappNumber =
          "919462761833";


        const whatsappURL =
          `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            whatsappText
          )}`;


        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );

      }
    );

  }


  /* =========================================================
     19. SCROLL PROGRESS
  ========================================================= */

  const scrollProgress =
    $("#scrollProgress");


  function updateScrollProgress() {

    if (!scrollProgress) {
      return;
    }


    const documentHeight =
      document.documentElement
        .scrollHeight -
      window.innerHeight;


    if (
      documentHeight <=
      0
    ) {

      scrollProgress.style.width =
        "0%";

      return;
    }


    const percent =
      (
        window.scrollY /
        documentHeight
      ) * 100;


    scrollProgress.style.width =
      `${Math.min(
        100,
        Math.max(
          0,
          percent
        )
      )}%`;
  }


  window.addEventListener(
    "scroll",
    updateScrollProgress,
    {
      passive: true
    }
  );


  updateScrollProgress();


  /* =========================================================
     20. LIGHTWEIGHT CURSOR EFFECT
  ========================================================= */

  if (
    !reduceMotion &&
    window.innerWidth >
      1000
  ) {

    const interactive =
      $(
        ".product-card, .application-card, .why-item, .circle-link"
      );


    interactive.forEach(
      (item) => {

        item.addEventListener(
          "mousemove",
          (event) => {

            const rect =
              item.getBoundingClientRect();


            const x =
              (
                (
                  event.clientX -
                  rect.left
                ) /
                rect.width
              ) * 100;


            const y =
              (
                (
                  event.clientY -
                  rect.top
                ) /
                rect.height
              ) * 100;


            item.style.setProperty(
              "--mouse-x",
              `${x}%`
            );


            item.style.setProperty(
              "--mouse-y",
              `${y}%`
            );

          },
          {
            passive: true
          }
        );

      }
    );

  }


  /* =========================================================
     21. LIGHTWEIGHT IMAGE PARALLAX
  ========================================================= */

  const parallaxImages =
    $(
      ".vision-image img, .story-image img"
    );


  if (
    !reduceMotion &&
    window.innerWidth >
      900 &&
    parallaxImages.length
  ) {

    let rafID = null;


    function updateImageParallax() {

      const viewport =
        window.innerHeight;


      parallaxImages.forEach(
        (image) => {

          const rect =
            image.getBoundingClientRect();


          if (
            rect.bottom <
              0 ||
            rect.top >
              viewport
          ) {

            return;

          }


          const center =
            rect.top +
            rect.height / 2;


          const delta =
            (
              viewport / 2 -
              center
            ) * 0.025;


          image.style.transform =
            `translate3d(0, ${delta}px, 0)`;

        }
      );


      rafID = null;
    }


    window.addEventListener(
      "scroll",
      () => {

        if (
          rafID !== null
        ) {
          return;
        }


        rafID =
          requestAnimationFrame(
            updateImageParallax
          );

      },
      {
        passive: true
      }
    );

  }


  /* =========================================================
     22. MAGNETIC BUTTONS
  ========================================================= */

  if (
    !reduceMotion &&
    window.innerWidth >
      1100
  ) {

    $$(".magnetic").forEach(
      (button) => {

        button.addEventListener(
          "mousemove",
          (event) => {

            const rect =
              button.getBoundingClientRect();


            const x =
              event.clientX -
              rect.left -
              rect.width / 2;


            const y =
              event.clientY -
              rect.top -
              rect.height / 2;


            button.style.transform =
              `translate(${x * 0.08}px, ${y * 0.08}px)`;

          }
        );


        button.addEventListener(
          "mouseleave",
          () => {

            button.style.transform =
              "";

          }
        );

      }
    );

  }


  /* =========================================================
     23. ACTIVE NAVIGATION
  ========================================================= */

  const sections =
    $$("main section[id]");


  const navLinks =
    $(
      ".desktop-nav a, .mobile-nav a"
    );


  if (
    sections.length &&
    "IntersectionObserver" in
      window
  ) {

    const navObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              const id =
                `#${entry.target.id}`;


              navLinks.forEach(
                (link) => {

                  link.classList.toggle(
                    "active",
                    link.getAttribute(
                      "href"
                    ) === id
                  );

                }
              );

            }
          );

        },
        {
          threshold:
            0.2,

          rootMargin:
            "-20% 0px -65% 0px"
        }
      );


    sections.forEach(
      (section) => {

        navObserver.observe(
          section
        );

      }
    );

  }


  /* =========================================================
     24. RESIZE SAFETY
  ========================================================= */

  let resizeTimer;


  window.addEventListener(
    "resize",
    () => {

      clearTimeout(
        resizeTimer
      );


      resizeTimer =
        setTimeout(
          () => {

            if (
              window.innerWidth >
                900 &&
              mobileMenu?.classList.contains(
                "open"
              )
            ) {

              closeMobileMenu();

            }


            faqItems.forEach(
              (item) => {

                if (
                  !item.classList.contains(
                    "active"
                  )
                ) {
                  return;
                }


                const answer =
                  $(".faq-answer", item);


                if (answer) {

                  answer.style.maxHeight =
                    `${answer.scrollHeight}px`;

                }

              }
            );

          },
          120
        );

    },
    {
      passive: true
    }
  );


  /* =========================================================
     25. CURRENT YEAR
  ========================================================= */

  const year =
    $("#year");


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =========================================================
     26. TAB VISIBILITY

     Pause Hero video/timer when tab is hidden.
  ========================================================= */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
      ) {

        clearHeroTimer();


        $$(".hero-slide video")
          .forEach(
            (video) => {

              video.pause();

            }
          );


        return;
      }


      const currentSlide =
        heroSlides[
          heroIndex
        ];


      const currentVideo =
        currentSlide
          ? $("video", currentSlide)
          : null;


      if (currentVideo) {

        currentVideo
          .play()
          .catch(
            () => {
              scheduleHeroImage();
            }
          );

      } else {

        scheduleHeroImage();

      }

    }
  );


  /* =========================================================
     27. REMOVE OLD LAZY-LOADER ARTIFACTS

     If old HTML/CSS left lazy attributes,
     clear them here.
  ========================================================= */

  $$(
    '[loading="lazy"], [data-src], [data-srcset]'
  ).forEach(
    (element) => {

      if (
        element.tagName ===
        "IMG"
      ) {

        element.loading =
          "eager";


        element.removeAttribute(
          "data-src"
        );


        element.removeAttribute(
          "data-srcset"
        );

      }

    }
  );


  /* =========================================================
     28. INITIAL IMAGE REQUEST

     Existing images only.
     Hero videos are NOT requested again here.
  ========================================================= */

  const knownImages = [

    "logo.png",


    "h1.png",
    "h2.png",
    "h3.png",
    "h4.png",
    "h5.png",
    "h6.png",


    "owner.jpeg",
    "about.jpeg",


    "maj.jpeg",
    "fis.jpeg",
    "pea.jpeg",
    "pbl.jpeg",
    "asi.jpeg",


    "par.jpeg",
    "tig.jpeg",
    "mat.jpeg",
    "bag.jpeg",
    "him.jpeg",


    "pwh.jpeg",
    "ice.jpeg",
    "bij.jpeg",
    "mark.jpeg",
    "mar.jpeg",


    "jam.jpeg",
    "chi.jpeg",
    "app.jpeg",
    "coi.jpeg",
    "raj.jpeg",


    "pp.jpg",


    "project1.jpeg",
    "project2.jpeg",
    "project3.jpeg",
    "project4.jpeg"

  ];


  knownImages.forEach(
    (src, index) => {

      const img =
        new Image();


      img.decoding =
        "async";


      if (
        index < 6
      ) {

        img.fetchPriority =
          "high";

      }


      img.src =
        src;

    }
  );


  /* =========================================================
     29. CONSOLE
  ========================================================= */

  console.log(
    "%c INFINITY GRANITES ",
    "background:#2b1f15;color:#e5c77f;font-size:16px;padding:7px 12px;border-radius:4px;"
  );


  console.log(
    "%c Fast premium site initialized ",
    "color:#806044;font-size:11px;"
  );

});
