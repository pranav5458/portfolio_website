/* =========================================================
   PRANAV CHAWLA - PORTFOLIO
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. MOBILE NAVIGATION
   ========================================================= */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (navMenu.classList.contains("active")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* =========================================================
   2. CLOSE MOBILE MENU AFTER CLICKING LINK
   ========================================================= */

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (navMenu) {
            navMenu.classList.remove("active");
        }

        const icon = menuToggle?.querySelector("i");

        if (icon) {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

});


/* =========================================================
   3. ACTIVE NAVIGATION LINK
   ========================================================= */

const sections = document.querySelectorAll("section[id]");

function updateActiveNavigation() {

    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            navLinks.forEach(link => {

                link.classList.remove("active");

                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }

            });

        }

    });

}

window.addEventListener("scroll", updateActiveNavigation);


/* =========================================================
   4. NAVBAR SCROLL EFFECT
   ========================================================= */

const navbar = document.querySelector(".navbar");

function handleNavbarScroll() {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.style.boxShadow =
            "0 10px 40px rgba(0, 0, 0, 0.25)";

    } else {

        navbar.style.boxShadow = "none";

    }

}

window.addEventListener("scroll", handleNavbarScroll);


/* =========================================================
   5. SCROLL REVEAL ANIMATION
   ========================================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, .about-grid, .skill-card, .project-card, .timeline-item, .resume-card, .contact-grid"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("reveal-visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =========================================================
   6. ADD REVEAL STYLES
   ========================================================= */

const revealStyle = document.createElement("style");

revealStyle.textContent = `

    .reveal {
        opacity: 0;
        transform: translateY(35px);
        transition:
            opacity 0.7s ease,
            transform 0.7s ease;
    }

    .reveal-visible {
        opacity: 1;
        transform: translateY(0);
    }

    .skill-card:nth-child(2),
    .project-card:nth-child(2) {
        transition-delay: 0.08s;
    }

    .skill-card:nth-child(3),
    .project-card:nth-child(3) {
        transition-delay: 0.16s;
    }

    .skill-card:nth-child(4) {
        transition-delay: 0.24s;
    }

    .skill-card:nth-child(5) {
        transition-delay: 0.32s;
    }

`;

document.head.appendChild(revealStyle);


/* =========================================================
   7. CONTACT FORM
   ========================================================= */

const contactForm = document.getElementById("contact-form");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const message =
            document.getElementById("message").value.trim();


        /* -----------------------------
           FRONTEND VALIDATION
        ----------------------------- */

        if (!name || !email || !message) {

            showFormMessage(
                "Please fill in all fields.",
                "error"
            );

            return;
        }


        if (!validateEmail(email)) {

            showFormMessage(
                "Please enter a valid email address.",
                "error"
            );

            return;
        }


        /* -----------------------------
           DISABLE BUTTON
        ----------------------------- */

        const submitButton =
            contactForm.querySelector('button[type="submit"]');

        const originalButtonText =
            submitButton.innerHTML;

        submitButton.disabled = true;

        submitButton.innerHTML = `
            Sending...
            <i class="fa-solid fa-spinner fa-spin"></i>
        `;


        try {

            /* -----------------------------
               SEND DATA TO BACKEND
            ----------------------------- */

            const response = await fetch(
                "http://localhost:5000/api/contact",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        message
                    })
                }
            );


            const data = await response.json();


            /* -----------------------------
               BACKEND ERROR
            ----------------------------- */

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Something went wrong."
                );

            }


            /* -----------------------------
               SUCCESS
            ----------------------------- */

            showFormMessage(
                "Thanks! Your message has been sent successfully.",
                "success"
            );

            contactForm.reset();


        } catch (error) {

            console.error(
                "Contact form error:",
                error
            );

            showFormMessage(
                "Unable to send your message right now. Please try again or contact me directly by email.",
                "error"
            );

        } finally {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonText;

        }

    });

}


/* =========================================================
   8. EMAIL VALIDATION
   ========================================================= */

function validateEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* =========================================================
   9. FORM MESSAGE
   ========================================================= */

function showFormMessage(message, type) {

    let messageBox =
        document.querySelector(".form-message");


    if (!messageBox) {

        messageBox =
            document.createElement("div");

        messageBox.className =
            "form-message";

        contactForm.appendChild(messageBox);

    }


    messageBox.textContent = message;

    messageBox.className =
        `form-message ${type}`;


    messageBox.style.padding = "12px 15px";
    messageBox.style.marginTop = "5px";
    messageBox.style.borderRadius = "8px";
    messageBox.style.fontSize = "12px";


    if (type === "success") {

        messageBox.style.background =
            "rgba(34, 197, 94, 0.1)";

        messageBox.style.border =
            "1px solid rgba(34, 197, 94, 0.25)";

        messageBox.style.color =
            "#86efac";

    } else {

        messageBox.style.background =
            "rgba(239, 68, 68, 0.1)";

        messageBox.style.border =
            "1px solid rgba(239, 68, 68, 0.25)";

        messageBox.style.color =
            "#fca5a5";

    }


    setTimeout(() => {

        messageBox.style.opacity = "0";

        messageBox.style.transition =
            "opacity 0.5s ease";

        setTimeout(() => {

            messageBox.remove();

        }, 500);

    }, 4000);

}


/* =========================================================
   10. PROJECT CARD TILT EFFECT
   ========================================================= */

const projectCards =
    document.querySelectorAll(".project-card");


projectCards.forEach(card => {

    card.addEventListener("mousemove", event => {

        if (window.innerWidth < 768) return;


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


        const rotateX =
            ((y - centerY) / centerY) * -2;


        const rotateY =
            ((x - centerX) / centerX) * 2;


        card.style.transform =
            `perspective(1000px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-7px)`;

    });


    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "translateY(0)";

    });

});


/* =========================================================
   11. SKILL CARD HOVER
   ========================================================= */

const skillCards =
    document.querySelectorAll(".skill-card");


skillCards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        if (window.innerWidth < 768) return;

        card.style.transform =
            "translateY(-9px)";

    });


    card.addEventListener("mouseleave", () => {

        if (window.innerWidth < 768) return;

        card.style.transform =
            "translateY(0)";

    });

});


/* =========================================================
   12. SMOOTH SCROLL FOR ANCHOR LINKS
   ========================================================= */

const anchorLinks =
    document.querySelectorAll('a[href^="#"]');


anchorLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId =
            this.getAttribute("href");

        if (!targetId || targetId === "#") return;


        const target =
            document.querySelector(targetId);


        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


/* =========================================================
   13. TYPING EFFECT
   ========================================================= */

const heroTitle =
    document.querySelector(".hero h2");


if (heroTitle) {

    const originalText =
        heroTitle.textContent.trim();

    heroTitle.textContent = "";

    let characterIndex = 0;


    function typeText() {

        if (characterIndex < originalText.length) {

            heroTitle.textContent +=
                originalText.charAt(characterIndex);

            characterIndex++;

            setTimeout(typeText, 70);

        }

    }


    setTimeout(typeText, 500);

}


/* =========================================================
   14. CURRENT YEAR
   ========================================================= */

const footerYear =
    document.querySelector(".footer-bottom p");


if (footerYear) {

    const currentYear =
        new Date().getFullYear();

    footerYear.innerHTML =
        `© ${currentYear} Pranav Chawla. All rights reserved.`;

}


/* =========================================================
   15. IMAGE LOAD EFFECT
   ========================================================= */

const profileImages =
    document.querySelectorAll(".profile-image");


profileImages.forEach(image => {

    image.addEventListener("load", () => {

        image.classList.add("image-loaded");

    });

});


/* =========================================================
   16. CONSOLE MESSAGE
   ========================================================= */

console.log(
    "%c👋 Hey there! Welcome to Pranav's Portfolio.",
    "color:#a78bfa;font-size:16px;font-weight:bold;"
);

console.log(
    "%cBuilt with HTML, CSS & JavaScript.",
    "color:#a1a1aa;font-size:12px;"
);


/* =========================================================
   END OF SCRIPT
   ========================================================= */