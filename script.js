/* =========================================================
   INFINITY GRANITES
   PREMIUM WEBSITE JAVASCRIPT
   Matched to current HTML structure
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =========================================================
       PAGE LOADER
    ========================================================= */

    const loader = document.querySelector(".page-loader");

    window.addEventListener("load", () => {

        setTimeout(() => {

            if (loader) {
                loader.classList.add("loaded");
            }

        }, 900);

    });


    /* =========================================================
       HEADER SCROLL EFFECT
    ========================================================= */

    const header = document.querySelector(".site-header");

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 70) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNavigation =
        document.querySelector(".mobile-navigation");

    if (menuToggle && mobileNavigation) {

        menuToggle.addEventListener("click", () => {

            menuToggle.classList.toggle("active");
            mobileNavigation.classList.toggle("active");

            document.body.classList.toggle(
                "menu-open",
                mobileNavigation.classList.contains("active")
            );

        });


        mobileNavigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    menuToggle.classList.remove("active");
                    mobileNavigation.classList.remove("active");
                    document.body.classList.remove("menu-open");

                });

            });

    }


    /* =========================================================
       HERO SLIDER
    ========================================================= */

    const heroSlides =
        document.querySelectorAll(".hero-slide");

    const heroCurrent =
        document.getElementById("heroCurrent");

    const heroTotal =
        document.getElementById("heroTotal");

    let heroIndex = 0;

    if (heroSlides.length) {

        if (heroTotal) {

            heroTotal.textContent =
                String(heroSlides.length).padStart(2, "0");

        }

        heroSlides.forEach((slide, index) => {

            slide.classList.toggle(
                "active",
                index === 0
            );

        });


        function showHeroSlide(index) {

            heroSlides.forEach((slide, i) => {

                slide.classList.toggle(
                    "active",
                    i === index
                );

            });

            if (heroCurrent) {

                heroCurrent.textContent =
                    String(index + 1).padStart(2, "0");

            }

        }


        setInterval(() => {

            heroIndex++;

            if (heroIndex >= heroSlides.length) {
                heroIndex = 0;
            }

            showHeroSlide(heroIndex);

        }, 6000);

    }


    /* =========================================================
       HERO IMAGE PRELOAD
    ========================================================= */

    document
        .querySelectorAll(".hero-slide")
        .forEach(slide => {

            const image =
                slide.getAttribute("data-image");

            if (!image) return;

            const preload =
                new Image();

            preload.src = image;

            slide.style.backgroundImage =
                `url("${image}")`;

        });


    /* =========================================================
       PRODUCT SLIDER
       
       IMPORTANT:
       NO ARROWS
       NO BUTTONS
       CURSOR MOVEMENT = SLIDER MOVEMENT
    ========================================================= */

    const productSlider =
        document.getElementById("productSlider");

    if (productSlider) {

        let targetScroll = 0;
        let currentScroll = 0;
        let isInside = false;

        productSlider.addEventListener(
            "mouseenter",
            () => {

                isInside = true;

            }
        );


        productSlider.addEventListener(
            "mouseleave",
            () => {

                isInside = false;

            }
        );


        productSlider.addEventListener(
            "mousemove",
            event => {

                if (!isInside) return;

                const rect =
                    productSlider.getBoundingClientRect();

                const mouseX =
                    event.clientX - rect.left;

                let percentage =
                    mouseX / rect.width;

                percentage =
                    Math.max(
                        0,
                        Math.min(1, percentage)
                    );

                const maxScroll =
                    productSlider.scrollWidth -
                    productSlider.clientWidth;

                targetScroll =
                    percentage * maxScroll;

            }
        );


        function animateProductSlider() {

            if (isInside) {

                currentScroll +=
                    (
                        targetScroll -
                        currentScroll
                    ) * 0.08;

                productSlider.scrollLeft =
                    currentScroll;

            }

            requestAnimationFrame(
                animateProductSlider
            );

        }

        animateProductSlider();


        /* =====================================================
           TOUCH SWIPE
        ===================================================== */

        let touchStartX = 0;
        let touchStartScroll = 0;

        productSlider.addEventListener(
            "touchstart",
            event => {

                touchStartX =
                    event.touches[0].clientX;

                touchStartScroll =
                    productSlider.scrollLeft;

            },
            {
                passive: true
            }
        );


        productSlider.addEventListener(
            "touchmove",
            event => {

                const currentX =
                    event.touches[0].clientX;

                const distance =
                    touchStartX - currentX;

                productSlider.scrollLeft =
                    touchStartScroll + distance;

            },
            {
                passive: true
            }
        );

    }


    /* =========================================================
       PRODUCT CARD PARALLAX
    ========================================================= */

    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            const image =
                card.querySelector(
                    ".product-image img"
                );

            if (!image) return;


            card.addEventListener(
                "mousemove",
                event => {

                    if (window.innerWidth < 900) {
                        return;
                    }

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX - rect.left;

                    const y =
                        event.clientY - rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const moveX =
                        (x - centerX) / 35;

                    const moveY =
                        (y - centerY) / 35;

                    image.style.transform =
                        `scale(1.06)
                         translate(${moveX}px, ${moveY}px)`;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    image.style.transform =
                        "scale(1) translate(0,0)";

                }
            );

        });


    /* =========================================================
       STONE FINDER
    ========================================================= */

    const finder =
        document.querySelector(".finder-interface");

    const finderQuestions =
        document.querySelectorAll(
            ".finder-question"
        );

    const finderResult =
        document.querySelector(".finder-result");

    let finderStep = 0;


    function showFinderStep(index) {

        finderQuestions.forEach(
            (question, i) => {

                question.classList.toggle(
                    "active",
                    i === index
                );

            }
        );

    }


    if (
        finder &&
        finderQuestions.length
    ) {

        showFinderStep(0);


        finderQuestions.forEach(
            (question, questionIndex) => {

                const options =
                    question.querySelectorAll(
                        ".finder-options span"
                    );


                options.forEach(option => {

                    option.addEventListener(
                        "click",
                        () => {

                            options.forEach(
                                item => {
                                    item.classList.remove(
                                        "selected"
                                    );
                                }
                            );

                            option.classList.add(
                                "selected"
                            );


                            setTimeout(() => {

                                if (
                                    questionIndex <
                                    finderQuestions.length - 1
                                ) {

                                    finderStep++;

                                    showFinderStep(
                                        finderStep
                                    );

                                } else {

                                    finderQuestions.forEach(
                                        item => {
                                            item.style.display =
                                                "none";
                                        }
                                    );

                                    if (finderResult) {

                                        finderResult.classList.add(
                                            "active"
                                        );

                                    }

                                }

                            }, 400);

                        }
                    );

                });

            }
        );

    }


    /* =========================================================
       VISUALIZER
       
       Uses product images already present in collection.
       Creates subtle image interaction.
    ========================================================= */

    const visualizer =
        document.querySelector(
            ".visualizer-preview"
        );

    const visualizerImage =
        visualizer
            ? visualizer.querySelector("img")
            : null;


    if (
        visualizer &&
        visualizerImage
    ) {

        visualizer.addEventListener(
            "mousemove",
            event => {

                if (window.innerWidth < 900) {
                    return;
                }

                const rect =
                    visualizer.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const moveX =
                    (x - 0.5) * 10;

                const moveY =
                    (y - 0.5) * 10;

                visualizerImage.style.transform =
                    `scale(1.04)
                     translate(${moveX}px, ${moveY}px)`;

            }
        );


        visualizer.addEventListener(
            "mouseleave",
            () => {

                visualizerImage.style.transform =
                    "scale(1) translate(0,0)";

            }
        );

    }


    /* =========================================================
       FAQ ACCORDION
    ========================================================= */

    const faqItems =
        document.querySelectorAll(
            ".faq-item"
        );

    faqItems.forEach(item => {

        const question =
            item.querySelector(
                ".faq-question"
            );

        const answer =
            item.querySelector(
                ".faq-answer"
            );


        if (
            !question ||
            !answer
        ) {
            return;
        }


        question.addEventListener(
            "click",
            () => {

                const isActive =
                    item.classList.contains(
                        "active"
                    );


                faqItems.forEach(
                    other => {

                        other.classList.remove(
                            "active"
                        );

                        const otherAnswer =
                            other.querySelector(
                                ".faq-answer"
                            );

                        if (otherAnswer) {

                            otherAnswer.style.maxHeight =
                                null;

                        }

                    }
                );


                if (!isActive) {

                    item.classList.add(
                        "active"
                    );

                    answer.style.maxHeight =
                        answer.scrollHeight + "px";

                }

            }
        );

    });


    /* =========================================================
       CUSTOM CURSOR
    ========================================================= */

    const cursorDot =
        document.querySelector(
            ".cursor-dot"
        );

    const cursorRing =
        document.querySelector(
            ".cursor-ring"
        );


    if (
        cursorDot &&
        cursorRing &&
        window.innerWidth > 900
    ) {

        let mouseX = 0;
        let mouseY = 0;

        let ringX = 0;
        let ringY = 0;


        document.addEventListener(
            "mousemove",
            event => {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;

                cursorDot.style.left =
                    mouseX + "px";

                cursorDot.style.top =
                    mouseY + "px";

            }
        );


        function animateCursor() {

            ringX +=
                (mouseX - ringX) * 0.12;

            ringY +=
                (mouseY - ringY) * 0.12;


            cursorRing.style.left =
                ringX + "px";

            cursorRing.style.top =
                ringY + "px";


            requestAnimationFrame(
                animateCursor
            );

        }

        animateCursor();


        const interactiveElements =
            document.querySelectorAll(
                "a, button, .product-card, .application-item, .finder-options span, .comparison-column"
            );


        interactiveElements.forEach(
            element => {

                element.addEventListener(
                    "mouseenter",
                    () => {

                        cursorRing.classList.add(
                            "active"
                        );

                    }
                );


                element.addEventListener(
                    "mouseleave",
                    () => {

                        cursorRing.classList.remove(
                            "active"
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       SMOOTH INTERNAL NAVIGATION
    ========================================================= */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight;


                    window.scrollTo({
                        top:
                            targetPosition,
                        behavior:
                            "smooth"
                    });

                }
            );

        });


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal, .reveal-left, .reveal-right"
        );


    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "visible"
                );

            }
        );

    }


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".main-nav a[href^='#']"
        );


    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver" in window
    ) {

        const navObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const sectionId =
                                entry.target.id;


                            navLinks.forEach(
                                link => {

                                    link.classList.remove(
                                        "active"
                                    );


                                    if (
                                        link.getAttribute(
                                            "href"
                                        ) ===
                                        `#${sectionId}`
                                    ) {

                                        link.classList.add(
                                            "active"
                                        );

                                    }

                                }
                            );

                        }
                    );

                },
                {
                    rootMargin:
                        "-35% 0px -55% 0px"
                }
            );


        sections.forEach(
            section => {

                navObserver.observe(
                    section
                );

            }
        );

    }


    /* =========================================================
       IMAGE LAZY LOADING
    ========================================================= */

    document
        .querySelectorAll("img")
        .forEach(image => {

            if (
                !image.hasAttribute(
                    "loading"
                )
            ) {

                image.setAttribute(
                    "loading",
                    "lazy"
                );

            }

        });


    /* =========================================================
       IMAGE ERROR HANDLING
    ========================================================= */

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "image-error"
                    );

                    image.style.objectFit =
                        "cover";

                }
            );

        });


    /* =========================================================
       APPLICATION ITEM MOTION
    ========================================================= */

    document
        .querySelectorAll(
            ".application-item"
        )
        .forEach(item => {

            item.addEventListener(
                "mousemove",
                event => {

                    if (
                        window.innerWidth < 900
                    ) {
                        return;
                    }


                    const rect =
                        item.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;


                    const rotateX =
                        ((y / rect.height) - .5) *
                        -3;

                    const rotateY =
                        ((x / rect.width) - .5) *
                        3;


                    item.style.transform =
                        `perspective(900px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)`;

                }
            );


            item.addEventListener(
                "mouseleave",
                () => {

                    item.style.transform =
                        "";

                }
            );

        });


    /* =========================================================
       COMPARISON INTERACTION
    ========================================================= */

    document
        .querySelectorAll(
            ".comparison-column"
        )
        .forEach(column => {

            column.addEventListener(
                "mouseenter",
                () => {

                    column.classList.add(
                        "active"
                    );

                }
            );


            column.addEventListener(
                "mouseleave",
                () => {

                    column.classList.remove(
                        "active"
                    );

                }
            );

        });


    /* =========================================================
       CONTACT FORMS
    ========================================================= */

    document
        .querySelectorAll("form")
        .forEach(form => {

            form.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    const button =
                        form.querySelector(
                            'button[type="submit"]'
                        );


                    if (!button) {
                        return;
                    }


                    const original =
                        button.innerHTML;


                    button.innerHTML =
                        `REQUEST RECEIVED
                         <span>✓</span>`;


                    button.disabled = true;


                    setTimeout(() => {

                        button.innerHTML =
                            original;

                        button.disabled =
                            false;

                    }, 3500);

                }
            );

        });


    /* =========================================================
       ESCAPE KEY
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }


            if (
                menuToggle &&
                mobileNavigation
            ) {

                menuToggle.classList.remove(
                    "active"
                );

                mobileNavigation.classList.remove(
                    "active"
                );

                document.body.classList.remove(
                    "menu-open"
                );

            }


            faqItems.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                    const answer =
                        item.querySelector(
                            ".faq-answer"
                        );

                    if (answer) {

                        answer.style.maxHeight =
                            null;

                    }

                }
            );

        }
    );


    /* =========================================================
       RESIZE HANDLING
    ========================================================= */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(() => {

                    if (
                        window.innerWidth <= 900 &&
                        cursorDot &&
                        cursorRing
                    ) {

                        cursorDot.style.display =
                            "none";

                        cursorRing.style.display =
                            "none";

                    }

                }, 150);

        }
    );


    /* =========================================================
       FINAL READY STATE
    ========================================================= */

    document.body.classList.add(
        "website-ready"
    );


    console.log(
        "Infinity Granites — Premium Website Loaded Successfully"
    );

});
