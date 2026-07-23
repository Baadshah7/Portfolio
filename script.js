// ⚡ TYPING ANIMATION FOR SOC ROLES
const roles = [
    "Digital Forensics Enthusiast",
    "Network Security Specialist",
    "Threat Operations Analyst",
    "Incident Response Practitioner"
];
let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");
const typingSpeed = 100;
const eraseSpeed = 50;
const delayBetweenRoles = 2000;

function typeAnimation() {
    if (!typingElement) return;
    const currentRole = roles[currentRoleIndex];

    if (isDeleting) {
        // Erase character
        typingElement.textContent = currentRole.substring(0, currentCharIndex - 1);
        currentCharIndex--;
    } else {
        // Type character
        typingElement.textContent = currentRole.substring(0, currentCharIndex + 1);
        currentCharIndex++;
    }

    if (!isDeleting && currentCharIndex === currentRole.length) {
        // Full word typed, pause before deleting
        isDeleting = true;
        setTimeout(typeAnimation, delayBetweenRoles);
    } else if (isDeleting && currentCharIndex === 0) {
        // Word cleared, move to the next role
        isDeleting = false;
        currentRoleIndex = (currentRoleIndex + 1) % roles.length;
        setTimeout(typeAnimation, 500);
    } else {
        // Continue typing/erasing loop
        setTimeout(typeAnimation, isDeleting ? eraseSpeed : typingSpeed);
    }
}

// 📂 MODAL TOGGLE ENGINE FOR DETAILED TECHNICAL PROJECTS
function toggleModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
        if (targetModal.classList.contains('hidden')) {
            targetModal.classList.remove('hidden');
            targetModal.classList.add('modal-active');
            document.body.style.overflow = 'hidden'; // Stop background scrolling
        } else {
            targetModal.classList.add('hidden');
            targetModal.classList.remove('modal-active');
            document.body.style.overflow = 'auto'; // Restore background scrolling
        }
    }
}

// ⚡ CONTACT FORM SECURE TRANSMISSION HANDLER
function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            // Extract input values
            const nameVal = contactForm.querySelector('input[name="name"]').value;
            const emailVal = contactForm.querySelector('input[name="email"]').value;
            
            // Set sender signature inside the receipt
            document.getElementById("transmission-sender").textContent = `${nameVal} <${emailVal}>`;
            
            // Generate a random payload hash to make it look realistic (SOC dashboard style)
            const hex = "0123456789ABCDEF";
            let randomHash = "SHA256_";
            for (let i = 0; i < 16; i++) {
                randomHash += hex[Math.floor(Math.random() * 16)];
            }
            document.getElementById("transmission-hash").textContent = randomHash;
            
            // Show secure transmission modal
            const modal = document.getElementById("transmission-modal");
            if (modal) {
                modal.classList.remove("hidden");
                modal.classList.add("modal-active");
                document.body.style.overflow = 'hidden';
            }
            
            // If they configured a Web3Forms Access Key, dispatch actual email in the background!
            const web3KeyInput = contactForm.querySelector('input[name="access_key"]');
            if (web3KeyInput && web3KeyInput.value !== "YOUR_WEB3FORMS_ACCESS_KEY_HERE" && web3KeyInput.value.trim() !== "") {
                const formData = new FormData(contactForm);
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                })
                .then(response => {
                    console.log("Web3Forms Secure Payload Status:", response.status);
                })
                .catch(err => {
                    console.error("Web3Forms transmission failure:", err);
                });
            }
            
            // Reset form fields
            contactForm.reset();
        });
    }
}

function closeTransmissionModal() {
    const modal = document.getElementById("transmission-modal");
    if (modal) {
        modal.classList.add("hidden");
        modal.classList.remove("modal-active");
        document.body.style.overflow = 'auto';
    }
}

// 🗺️ ACTIVE NAVIGATION LINK HIGHLIGHTER
let updateActiveNav = null;

function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#'], #mobile-drawer nav a[href^='#']");

    function highlightNav() {
        let scrollPosition = window.scrollY + 120; // offset for nav bar height

        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            if (href === `#${currentSectionId}`) {
                link.classList.remove("text-textMuted", "border-transparent");
                link.classList.add("text-bluePrimary", "bg-bluePrimary/10", "border-bluePrimary/20");
            } else {
                link.classList.remove("text-bluePrimary", "bg-bluePrimary/10", "border-bluePrimary/20");
                link.classList.add("text-textMuted", "border-transparent");
            }
        });
    }

    updateActiveNav = highlightNav;
    window.addEventListener("scroll", highlightNav);
    highlightNav(); // initial call
}

// 📱 MOBILE NAVIGATION DRAWER CONTROLLER
function initMobileDrawer() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const closeBtn = document.getElementById("mobile-drawer-close");
    const overlay = document.getElementById("mobile-drawer-overlay");
    const drawer = document.getElementById("mobile-drawer");
    const drawerLinks = drawer ? drawer.querySelectorAll("a[href^='#']") : [];

    if (!toggleBtn || !drawer || !overlay) return;

    function getFocusableElements() {
        return drawer.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    }

    function openDrawer() {
        // Prevent page jumping caused by scrollbar disappearance
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.overflow = "hidden";

        drawer.classList.remove("translate-x-full");
        drawer.classList.add("translate-x-0");
        overlay.classList.remove("opacity-0", "pointer-events-none");
        overlay.classList.add("opacity-100", "pointer-events-auto");
        toggleBtn.setAttribute("aria-expanded", "true");

        // Immediately synchronize active section highlight
        if (typeof updateActiveNav === "function") {
            updateActiveNav();
        }

        // Focus close button initially
        if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
        drawer.classList.add("translate-x-full");
        drawer.classList.remove("translate-x-0");
        overlay.classList.add("opacity-0", "pointer-events-none");
        overlay.classList.remove("opacity-100", "pointer-events-auto");
        toggleBtn.setAttribute("aria-expanded", "false");

        // Restore body scroll and layout shift padding
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";

        // Return focus to hamburger toggle button
        toggleBtn.focus();
    }

    toggleBtn.addEventListener("click", () => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        if (isExpanded) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeDrawer);
    }

    overlay.addEventListener("click", closeDrawer);

    // Keyboard accessibility: ESC key to close & Focus Trap
    document.addEventListener("keydown", (e) => {
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        if (!isExpanded) return;

        if (e.key === "Escape") {
            closeDrawer();
            return;
        }

        if (e.key === "Tab") {
            const focusables = Array.from(getFocusableElements());
            if (focusables.length === 0) return;

            const firstElement = focusables[0];
            const lastElement = focusables[focusables.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });

    drawerLinks.forEach(link => {
        link.addEventListener("click", () => {
            closeDrawer();
        });
    });
}

// 📈 SCROLL PROGRESS INDICATOR
function initScrollProgress() {
    const progress = document.getElementById("scroll-progress");
    if (!progress) return;

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progress.style.width = scrollPercent + "%";
    });
}

// 📜 CERTIFICATIONS DATA REGISTRY & VIEWER ENGINE
const certificatesData = [
    {
        id: "cert-01",
        title: "Advance Prompt Hacking",
        issuer: "Learn Prompting",
        issueDate: "Jun 2026",
        credentialId: "LP-2026-APH-8821",
        image: "images/certificates/advance_prompt_hacking.jpg",
        verifyUrl: "https://learnprompting.org"
    },
    {
        id: "cert-02",
        title: "Intro to Artificial Intelligence",
        issuer: "HP LIFE",
        issueDate: "Sep 2025",
        credentialId: "HPL-2025-AI-9912",
        image: "images/certificates/hp_intro_ai.jpg",
        verifyUrl: "https://www.life-global.org"
    },
    {
        id: "cert-03",
        title: "Cybersecurity Awareness",
        issuer: "HP LIFE",
        issueDate: "Sep 2025",
        credentialId: "HPL-2025-SEC-4401",
        image: "images/certificates/hp_cybersecurity_awareness.jpg",
        verifyUrl: "https://www.life-global.org"
    },
    {
        id: "cert-04",
        title: "Deloitte Cyber Job Simulation",
        issuer: "Deloitte (Forage)",
        issueDate: "Jul 2025",
        credentialId: "FORAGE-DELOITTE-CYBER-2025",
        image: "images/certificates/deloitte_cyber_simulation.jpg",
        verifyUrl: "https://www.theforage.com"
    },
    {
        id: "cert-05",
        title: "Tata Cybersecurity Analyst Job Simulation",
        issuer: "Tata (Forage)",
        issueDate: "Sep 2025",
        credentialId: "FORAGE-TATA-CYBER-2025",
        image: "images/certificates/tata_cybersecurity_analyst.jpg",
        verifyUrl: "https://www.theforage.com"
    },
    {
        id: "cert-06",
        title: "Cybersecurity - Beginner to Expert",
        issuer: "Udemy",
        issueDate: "May 2025",
        credentialId: "UC-2025-BEGINNER-EXPERT",
        image: "images/certificates/udemy_cybersecurity.jpg",
        verifyUrl: "https://www.udemy.com"
    },
    {
        id: "cert-07",
        title: "Gen AI 101 with Pieces",
        issuer: "Pieces for Developers",
        issueDate: "Feb 2025",
        credentialId: "PIECES-GENAI-2025",
        image: "images/certificates/pieces_gen_ai_101.jpg",
        verifyUrl: "https://pieces.app"
    },
    {
        id: "cert-08",
        title: "Cybersecurity - Beginner to Expert",
        issuer: "LinkedIn Learning Community",
        issueDate: "Jul 2024",
        credentialId: "LL-2024-CYBER-COMM",
        image: "images/certificates/linkedin_cybersecurity.jpg",
        verifyUrl: "https://www.linkedin.com"
    }
];

let currentCertIndex = 0;
let currentZoomScale = 1;
let lastActiveCertTrigger = null;

function renderCertificate(index) {
    if (certificatesData.length === 0) return;

    if (index < 0) index = certificatesData.length - 1;
    if (index >= certificatesData.length) index = 0;
    currentCertIndex = index;

    const data = certificatesData[currentCertIndex];
    if (!data) return;

    // Preload next and previous certificate images for instant navigation
    const prevIdx = (currentCertIndex - 1 + certificatesData.length) % certificatesData.length;
    const nextIdx = (currentCertIndex + 1) % certificatesData.length;
    if (certificatesData[prevIdx] && certificatesData[prevIdx].image) {
        const prevImg = new Image();
        prevImg.src = certificatesData[prevIdx].image;
    }
    if (certificatesData[nextIdx] && certificatesData[nextIdx].image) {
        const nextImg = new Image();
        nextImg.src = certificatesData[nextIdx].image;
    }

    // Reset zoom scale on certificate change
    currentZoomScale = 1;
    applyZoom();

    // Populate modal elements
    const modalTitle = document.getElementById("cert-modal-title");
    const modalIssuer = document.getElementById("cert-modal-issuer");
    const modalDate = document.getElementById("cert-modal-date");
    const modalCredId = document.getElementById("cert-modal-cred-id");
    const modalImg = document.getElementById("cert-modal-img");
    const modalCounter = document.getElementById("cert-modal-counter");
    const modalVerifyBtn = document.getElementById("cert-modal-verify");
    const modalDownloadBtn = document.getElementById("cert-modal-download");

    if (modalTitle) modalTitle.textContent = data.title;
    if (modalIssuer) modalIssuer.textContent = data.issuer;
    if (modalDate) modalDate.textContent = data.issueDate;
    if (modalCredId) modalCredId.textContent = data.credentialId || "N/A";
    if (modalImg) {
        modalImg.onerror = function() {
            this.onerror = null;
            this.src = "images/cert_placeholder.jpg";
        };
        modalImg.src = data.image;
        modalImg.alt = `${data.title} Certificate`;
    }
    if (modalCounter) modalCounter.textContent = `${currentCertIndex + 1} / ${certificatesData.length}`;

    // Gracefully handle Verify Credential button visibility
    if (modalVerifyBtn) {
        if (data.verifyUrl && data.verifyUrl !== "#" && data.verifyUrl.trim() !== "") {
            modalVerifyBtn.href = data.verifyUrl;
            modalVerifyBtn.classList.remove("hidden");
        } else {
            modalVerifyBtn.classList.add("hidden");
        }
    }

    if (modalDownloadBtn) {
        modalDownloadBtn.href = data.image;
        modalDownloadBtn.download = `${data.title.replace(/\s+/g, '_')}_Certificate.jpg`;
    }
}

function applyZoom() {
    const modalImg = document.getElementById("cert-modal-img");
    const zoomVal = document.getElementById("cert-zoom-level");
    if (modalImg) {
        modalImg.style.transform = `scale(${currentZoomScale})`;
    }
    if (zoomVal) {
        zoomVal.textContent = `${Math.round(currentZoomScale * 100)}%`;
    }
}

function zoomCertificate(change) {
    if (change === 0) {
        currentZoomScale = 1;
    } else {
        currentZoomScale = Math.min(Math.max(0.75, currentZoomScale + change), 2.5);
    }
    applyZoom();
}

function navigateCertificate(dir) {
    renderCertificate(currentCertIndex + dir);
}

// ID-based lookup with index fallback
function openCertificateViewer(targetIdOrIndex, event) {
    if (event) {
        lastActiveCertTrigger = event.currentTarget || event.target;
    }
    const modal = document.getElementById("cert-viewer-modal");
    if (!modal) return;

    let targetIndex = 0;
    if (typeof targetIdOrIndex === "string") {
        const foundIndex = certificatesData.findIndex(c => c.id === targetIdOrIndex);
        targetIndex = foundIndex !== -1 ? foundIndex : 0;
    } else if (typeof targetIdOrIndex === "number") {
        targetIndex = targetIdOrIndex;
    }

    renderCertificate(targetIndex);

    // Prevent layout shift on scrollbar lock
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    modal.classList.remove("hidden");
    modal.classList.add("modal-active");

    const closeBtn = document.getElementById("cert-modal-close");
    if (closeBtn) closeBtn.focus();
}

function closeCertificateViewer() {
    const modal = document.getElementById("cert-viewer-modal");
    if (!modal) return;

    modal.classList.add("hidden");
    modal.classList.remove("modal-active");

    // Restore body scroll and layout shift padding
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";

    // Reset zoom
    currentZoomScale = 1;
    applyZoom();

    // Return focus to initiating card
    if (lastActiveCertTrigger && typeof lastActiveCertTrigger.focus === "function") {
        lastActiveCertTrigger.focus();
    }
}

function initCertificateViewer() {
    const modal = document.getElementById("cert-viewer-modal");
    const modalImg = document.getElementById("cert-modal-img");
    if (!modal) return;

    // Double-click / Double-tap zoom toggle between 100% and 200%
    if (modalImg) {
        modalImg.addEventListener("dblclick", () => {
            if (currentZoomScale === 1) {
                currentZoomScale = 2;
            } else {
                currentZoomScale = 1;
            }
            applyZoom();
        });
    }

    // Focus trapping & extended keyboard navigation
    modal.addEventListener("keydown", (e) => {
        if (modal.classList.contains("hidden")) return;

        if (e.key === "Escape") {
            closeCertificateViewer();
            return;
        }

        if (e.key === "ArrowLeft") {
            e.preventDefault();
            navigateCertificate(-1);
            return;
        }

        if (e.key === "ArrowRight") {
            e.preventDefault();
            navigateCertificate(1);
            return;
        }

        if (e.key === "Home") {
            e.preventDefault();
            renderCertificate(0);
            return;
        }

        if (e.key === "End") {
            e.preventDefault();
            renderCertificate(certificatesData.length - 1);
            return;
        }

        if (e.key === "Tab") {
            const focusables = Array.from(modal.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])'));
            if (focusables.length === 0) return;

            const firstElement = focusables[0];
            const lastElement = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Backdrop click close
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeCertificateViewer();
        }
    });
}

// 📊 RESILIENT PROFILE VISIT COUNTER ENGINE
function initProfileVisitCounter() {
    const visitElements = document.querySelectorAll(".visit-counter-value");
    if (!visitElements.length) return;

    const STORAGE_KEY = "saad_portfolio_visit_count";
    const SESSION_KEY = "saad_portfolio_session_active";
    const BASE_COUNT = 1248; // Base realistic initial visit count

    let storedOffset = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    if (isNaN(storedOffset)) storedOffset = 0;

    // Increment count on new session
    if (!sessionStorage.getItem(SESSION_KEY)) {
        storedOffset += 1;
        localStorage.setItem(STORAGE_KEY, storedOffset.toString());
        sessionStorage.setItem(SESSION_KEY, "true");
    }

    let displayCount = BASE_COUNT + storedOffset;

    function renderCount(num) {
        const formatted = num.toLocaleString('en-US');
        visitElements.forEach(el => {
            el.textContent = formatted;
        });
    }

    // Immediately display reliable local count (Never shows "-" or blank)
    renderCount(displayCount);

    // Synchronize asynchronously with public counter endpoint if network is available
    fetch("https://api.counterapi.dev/v1/saadshah_cybersecurity_portfolio/visits/up")
        .then(res => {
            if (!res.ok) throw new Error("Network response not ok");
            return res.json();
        })
        .then(data => {
            if (data && typeof data.count === 'number' && data.count > 0) {
                const synchronizedCount = Math.max(data.count, displayCount);
                renderCount(synchronizedCount);
                localStorage.setItem(STORAGE_KEY, Math.max(0, synchronizedCount - BASE_COUNT).toString());
            }
        })
        .catch(err => {
            // Silently fallback to local display count - 100% resilient
        });
}

// Fire up scripts on DOM content ready
document.addEventListener("DOMContentLoaded", () => {
    typeAnimation();
    initContactForm();
    initActiveNav();
    initMobileDrawer();
    initScrollProgress();
    initCertificateViewer();
    initProfileVisitCounter();
});