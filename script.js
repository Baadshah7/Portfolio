
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
        category: "ai",
        issueDate: "Jun 2026",
        credentialId: "v5szp9i8rx",
        image: "images/certificates/Advance Prompt Hacking.pdf",
        verifyUrl: "https://learnprompting.org"
    },
    {
        id: "cert-02",
        title: "AI for Beginners",
        issuer: "HP LIFE",
        category: "ai",
        issueDate: "Sep 2025",
        credentialId: "5e4581d0-ecee-45d5-86e7-3be6656e1e28",
        image: "images/certificates/AI for Beginner (HP).pdf",
        verifyUrl: "#"
    },
    {
        id: "cert-03",
        title: "Introduction to Cybersecurity Awareness",
        issuer: "HP LIFE",
        category: "cybersecurity",
        issueDate: "Sep 2025",
        credentialId: "acb07944-f469-4551-b822-2eecf6e52bd3",
        image: "images/certificates/Intro to Cyber Awareness (HP).pdf",
        verifyUrl: "#"
    },
    {
        id: "cert-04",
        title: "Deloitte Cyber Job Simulation",
        issuer: "Deloitte (Forage)",
        category: "cybersecurity",
        issueDate: "Jul 2025",
        credentialId: "FORAGE-DELOITTE-CYBER-2025",
        image: "images/certificates/Deloitte Cyber Job Simulation.pdf",
        verifyUrl: "https://www.theforage.com"
    },
    {
        id: "cert-05",
        title: "Tata Cybersecurity Analyst Job Simulation",
        issuer: "Tata (Forage)",
        category: "cybersecurity",
        issueDate: "Sep 2025",
        credentialId: "FORAGE-TATA-CYBER-2025",
        image: "images/certificates/Tata Cyber Job Simulation.pdf",
        verifyUrl: "https://www.theforage.com"
    },
    {
        id: "cert-06",
        title: "Cybersecurity - Beginner to Expert",
        issuer: "Udemy",
        category: "cybersecurity",
        issueDate: "May 2025",
        credentialId: "UC-2025-BEGINNER-EXPERT",
        image: "images/certificates/Cybersecurity Beginner (Udemy).pdf",
        verifyUrl: "https://www.udemy.com"
    },
    {
        id: "cert-07",
        title: "ChatGPT for Everyone",
        issuer: "Learn Prompting",
        category: "ai",
        issueDate: "Jun 2026",
        credentialId: "8gxlchwhxt",
        image: "images/certificates/Chatgpt Certificate.pdf",
        verifyUrl: "https://learnprompting.org"
    },
    {
        id: "cert-08",
        title: "Cybersecurity - Beginner to Expert",
        issuer: "LinkedIn Learning Community",
        category: "cybersecurity",
        issueDate: "Jul 2024",
        credentialId: "LL-2024-CYBER-COMM",
        image: "images/certificates/Cybersecurity Beginner to Expert.pdf",
        verifyUrl: "https://www.linkedin.com"
    },
    {
        id: "cert-09",
        title: "Unthink Hackathon",
        issuer: "M. H. Saboo Siddik College of Engineering",
        category: "hackathon",
        issueDate: "Apr 2026",
        credentialId: "UNTHINK-2026",
        image: "images/certificates/Unthink Hackathon.pdf",
        verifyUrl: "#"
    },
    {
        id: "cert-10",
        title: "VES-Hack-It",
        issuer: "Unstop",
        category: "hackathon",
        issueDate: "July 2025",
        credentialId: "VES-HACKIT-2026",
        image: "images/certificates/VES Hacakthon Certificate (Unstop) .pdf",
        verifyUrl: "#"
    },
    {
        id: "cert-11",
        title: "Hacker's Gambit CTF",
        issuer: "Jaihind College of Engineering",
        category: "event",
        issueDate: "Aug 2025",
        credentialId: "HG-CTF-2025",
        image: "images/certificates/Hacker's Gambit CTF.pdf",
        verifyUrl: "#"
    },
    {
        id: "cert-12",
        title: "Co-author of Anthology Midnight Thoughts",
        issuer: "Everlasting Publication",
        category: "event",
        issueDate: "2026",
        credentialId: "ISBN 978-81-69026-22-2",
        image: "images/certificates/Midnight Thoughts Book.pdf",
        verifyUrl: "#"
    },
    {
        id: "cert-13",
        title: "Multicorn Paper Presentation - Multiagent System for Clinical Assistance with Human-in-the-Loop",
        issuer: "Thakur College of Engineering and Technology",
        category: "event",
        issueDate: "Mar 2026",
        credentialId: "TCET-MULTICORN-2026",
        image: "images/certificates/Multicorn Certificate.pdf",
        verifyUrl: "#"
    }
];

let currentCertIndex = 0;
let currentZoomScale = 1;
let lastActiveCertTrigger = null;
window.currentActiveCategory = "all"; // Global filter category

function getFilteredCertificates() {
    if (!window.currentActiveCategory || window.currentActiveCategory === "all") {
        return certificatesData;
    }
    return certificatesData.filter(c => c.category === window.currentActiveCategory);
}

function renderCertificate(index) {
    const filtered = getFilteredCertificates();
    if (filtered.length === 0) return;

    if (index < 0) index = filtered.length - 1;
    if (index >= filtered.length) index = 0;
    currentCertIndex = index;

    const data = filtered[currentCertIndex];
    if (!data) return;

    // Preload next and previous certificate images for instant navigation
    const prevIdx = (currentCertIndex - 1 + filtered.length) % filtered.length;
    const nextIdx = (currentCertIndex + 1) % filtered.length;
    if (filtered[prevIdx] && filtered[prevIdx].image) {
        const prevImg = new Image();
        prevImg.src = filtered[prevIdx].image;
    }
    if (filtered[nextIdx] && filtered[nextIdx].image) {
        const nextImg = new Image();
        nextImg.src = filtered[nextIdx].image;
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
    
    let modalPdf = document.getElementById("cert-modal-pdf");
    if (data.image && data.image.toLowerCase().endsWith(".pdf")) {
        if (modalImg) modalImg.classList.add("hidden");
        if (!modalPdf) {
            modalPdf = document.createElement("iframe");
            modalPdf.id = "cert-modal-pdf";
            modalPdf.className = "w-full h-[70vh] rounded-lg border border-slate700/60 shadow-xl bg-slate900";
            if (modalImg && modalImg.parentNode) {
                modalImg.parentNode.appendChild(modalPdf);
            }
        }
        modalPdf.src = data.image;
        modalPdf.classList.remove("hidden");
    } else {
        if (modalPdf) modalPdf.classList.add("hidden");
        if (modalImg) {
            modalImg.classList.remove("hidden");
            modalImg.onerror = function() {
                this.onerror = null;
                this.src = "images/cert_placeholder.jpg";
            };
            modalImg.src = data.image;
            modalImg.alt = `${data.title} Certificate`;
        }
    }
    if (modalCounter) modalCounter.textContent = `${currentCertIndex + 1} / ${filtered.length}`;

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
        const ext = data.image.toLowerCase().endsWith(".pdf") ? "pdf" : "jpg";
        modalDownloadBtn.download = `${data.title.replace(/\s+/g, '_')}_Certificate.${ext}`;
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

// ID-based lookup with index fallback within the filtered category
function openCertificateViewer(targetIdOrIndex, event) {
    if (event) {
        lastActiveCertTrigger = event.currentTarget || event.target;
    }
    const modal = document.getElementById("cert-viewer-modal");
    if (!modal) return;

    // Detect active filter pill and update global filter state
    const activePill = document.querySelector(".cert-filter-pill.active-pill");
    window.currentActiveCategory = activePill ? activePill.getAttribute("data-filter") : "all";

    const filtered = getFilteredCertificates();
    let targetIndex = 0;
    if (typeof targetIdOrIndex === "string") {
        const foundIndex = filtered.findIndex(c => c.id === targetIdOrIndex);
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

// 📊 REAL-TIME LIVE VISITOR COUNTER ENGINE
async function initLiveVisitorCounter() {
    const counterElements = document.querySelectorAll(".visit-counter-value, #visitor-count");
    if (!counterElements.length) return;

    const STORAGE_KEY = "saad_shah_portfolio_visit_counter_v2";
    const API_ENDPOINT = "https://api.counterapi.dev/v1/baadshah7_portfolio_v2/visits/up";
    const BASE_OFFSET = 0; // Starts clean from 0 and saves live visits

    // 1. Load cached count or start cleanly at 0
    let storedCount = parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    if (isNaN(storedCount) || storedCount < 0) {
        storedCount = 0;
    }

    // Increment locally on every page visit/refresh for instant response
    let currentDisplayCount = storedCount + 1;
    localStorage.setItem(STORAGE_KEY, currentDisplayCount.toString());

    // Immediately render current local count
    renderAll(currentDisplayCount);

    // 2. Asynchronously hit global server counter API to register hit & persist server total
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4-second timeout

        const response = await fetch(API_ENDPOINT, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data && typeof data.count === "number" && data.count > 0) {
                // Calculate synchronized global count (starting from 0)
                const serverGlobalCount = BASE_OFFSET + data.count;
                const finalCount = Math.max(serverGlobalCount, currentDisplayCount);

                if (finalCount > currentDisplayCount) {
                    const prevCount = currentDisplayCount;
                    currentDisplayCount = finalCount;
                    localStorage.setItem(STORAGE_KEY, currentDisplayCount.toString());
                    animateValueAll(counterElements, prevCount, currentDisplayCount, 800);
                } else {
                    localStorage.setItem(STORAGE_KEY, currentDisplayCount.toString());
                }
            }
        }
    } catch (err) {
        // Silently fallback to local display count - 100% resilient
    }

    function renderAll(val) {
        const formatted = val.toLocaleString("en-US");
        counterElements.forEach(el => {
            el.textContent = formatted;
        });
    }

    function animateValueAll(elements, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 4); // smooth easeOutQuart
            const currentVal = Math.floor(easeProgress * (end - start) + start);
            const formatted = currentVal.toLocaleString("en-US");

            elements.forEach(el => {
                el.textContent = formatted;
            });

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                renderAll(end);
            }
        };
        window.requestAnimationFrame(step);
    }
}

// 🚀 BACK TO TOP BUTTON
function initBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove("opacity-0", "translate-y-10", "pointer-events-none");
            backToTopBtn.classList.add("opacity-100", "translate-y-0", "cursor-pointer");
        } else {
            backToTopBtn.classList.add("opacity-0", "translate-y-10", "pointer-events-none");
            backToTopBtn.classList.remove("opacity-100", "translate-y-0", "cursor-pointer");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// 📅 DYNAMIC COPYRIGHT YEAR
function initDynamicYear() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// 🏷️ CERTIFICATION REGISTRY DYNAMIC FILTER & COUNT ENGINE
function initCertificateFilters() {
    const filterPills = document.querySelectorAll(".cert-filter-pill");
    const certCards = document.querySelectorAll(".cert-card");
    if (!filterPills.length || !certCards.length) return;

    // 1. Automatically calculate category counts from certificatesData array
    const counts = {
        all: certificatesData.length,
        cybersecurity: 0,
        ai: 0,
        hackathon: 0,
        event: 0
    };

    certificatesData.forEach(cert => {
        if (cert.category && counts.hasOwnProperty(cert.category)) {
            counts[cert.category]++;
        }
    });

    // 2. Populate count numbers inside filter pills
    filterPills.forEach(pill => {
        const cat = pill.getAttribute("data-filter");
        const countSpan = pill.querySelector(".cert-filter-count");
        if (countSpan && counts.hasOwnProperty(cat)) {
            countSpan.textContent = `(${counts[cat]})`;
        }
    });

    // 3. Category filtering handler with smooth 60fps fade out / fade in
    function setCategory(targetCategory, targetPill) {
        filterPills.forEach(p => {
            p.classList.remove("active-pill", "bg-bluePrimary", "text-white", "shadow-lg", "shadow-bluePrimary/25");
            p.classList.add("inactive-pill", "bg-slate800/80", "text-textMuted", "border", "border-slate700/60");
            p.setAttribute("aria-selected", "false");
        });

        targetPill.classList.remove("inactive-pill", "bg-slate800/80", "text-textMuted", "border", "border-slate700/60");
        targetPill.classList.add("active-pill", "bg-bluePrimary", "text-white", "shadow-lg", "shadow-bluePrimary/25");
        targetPill.setAttribute("aria-selected", "true");

        // Fade out non-matching cards and fade in matching ones
        certCards.forEach(card => {
            const cardCat = card.getAttribute("data-category");
            const matches = targetCategory === "all" || cardCat === targetCategory;

            if (matches) {
                card.style.display = "flex";
                requestAnimationFrame(() => {
                    card.style.opacity = "1";
                    card.style.transform = "scale(1)";
                    card.style.pointerEvents = "auto";
                });
            } else {
                card.style.opacity = "0";
                card.style.transform = "scale(0.95)";
                card.style.pointerEvents = "none";
                setTimeout(() => {
                    if (card.style.opacity === "0") {
                        card.style.display = "none";
                    }
                }, 280);
            }
        });
    }

    // Attach click and keyboard events
    filterPills.forEach(pill => {
        pill.addEventListener("click", () => {
            const category = pill.getAttribute("data-filter");
            setCategory(category, pill);
        });

        pill.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pill.click();
            }
        });
    });
}

// 🎯 PREMIUM CUSTOM CURSOR
function initPremiumCursor() {
    // Disable on mobile/touch screens
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    // Accessibility: Disable if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('cursor-enabled');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = false;

    // Throttle via requestAnimationFrame
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isMoving) {
            isMoving = true;
            requestAnimationFrame(renderCursor);
        }
    });

    const LERP_FACTOR = 0.18;

    function renderCursor() {
        if (document.hidden) {
            isMoving = false;
            return;
        }

        // Dot follows instantly
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

        // Ring follows with Lerp
        ringX += (mouseX - ringX) * LERP_FACTOR;
        ringY += (mouseY - ringY) * LERP_FACTOR;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

        // Continue loop if ring is still catching up (threshold 0.1px)
        if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
            requestAnimationFrame(renderCursor);
        } else {
            isMoving = false;
        }
    }

    // Interactive Hover Effects
    const interactives = document.querySelectorAll('a, button, input, textarea, select, summary, [role="button"], [data-cursor], .hover-lift');
    
    interactives.forEach(el => {
        el.addEventListener('pointerenter', () => {
            ring.classList.add('cursor-hover');
            // Check if it's a special card/button to add pulse glow
            if (el.classList.contains('hover-lift') || el.classList.contains('bg-slate-900')) {
                ring.classList.add('cursor-glow');
            }
        });
        
        el.addEventListener('pointerleave', () => {
            ring.classList.remove('cursor-hover');
            ring.classList.remove('cursor-glow');
        });
    });

    // Handle visibility pause/resume
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !isMoving) {
            isMoving = true;
            requestAnimationFrame(renderCursor);
        }
    });
}

/* ==================================================
   PREMIUM CYBER BOOT ANIMATION MODULE
   ================================================== */
const checks = [
    "[INITIALIZING CYBERSECURITY PORTFOLIO...]",
    "✔ Loading Security Modules",
    "✔ Initializing Threat Intelligence",
    "✔ Loading Digital Forensics Toolkit",
    "✔ Verifying Certificates",
    "✔ Connecting Secure Dashboard",
    "✔ Portfolio Ready"
];

let activeTimeouts = [];
let animationFrameId = null;
let bootScrollY = 0;

function lockScroll() {
    bootScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${bootScrollY}px`;
    document.body.style.width = "100%";
}

function unlockScroll() {
    if (document.body.style.position === "fixed") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, bootScrollY);
    }
}

function cleanupBoot() {
    activeTimeouts.forEach(clearTimeout);
    activeTimeouts = [];
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
}

function skipAnimation() {
    cleanupBoot();
    
    const bootScreen = document.getElementById("boot-screen");
    if (bootScreen) {
        bootScreen.style.display = "none";
        bootScreen.remove();
    }
    
    unlockScroll();
    
    try {
        sessionStorage.setItem("bootPlayed", "true");
    } catch (e) {
        // Fallback for private browsing mode
    }
    
    document.documentElement.classList.remove("boot-active");
    document.documentElement.classList.add("boot-skipped");
    
    initializeAllComponents();
}

function handleKeyDown(e) {
    if (e.key === "Escape") {
        skipAnimation();
    }
}

function handleVisibilityChange() {
    if (document.hidden) {
        skipAnimation();
    }
}

function startBootSequence() {
    const bootScreen = document.getElementById("boot-screen");
    const terminalEl = document.getElementById("boot-terminal");
    const activeLineEl = document.getElementById("boot-active-line");
    const fillEl = document.getElementById("boot-progress-fill");
    const textEl = document.getElementById("boot-progress-text");
    const progressContainer = document.getElementById("boot-progress-container");
    const brandingEl = document.getElementById("boot-branding");
    
    if (!bootScreen || !terminalEl || !activeLineEl || !fillEl || !textEl || !progressContainer || !brandingEl) {
        skipAnimation();
        return;
    }
    
    lockScroll();
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Progress Bar Animation (0.0s to 2.0s)
    const duration = 2000;
    let startTimestamp = null;
    let lastPercent = -1;
    
    function updateProgress(progressVal) {
        const percentInt = Math.floor(progressVal * 100);
        fillEl.style.width = `${progressVal * 100}%`;
        if (percentInt !== lastPercent) {
            lastPercent = percentInt;
            textEl.textContent = `${percentInt}%`;
        }
    }
    
    function animateProgressBar(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        
        updateProgress(progress);
        
        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animateProgressBar);
        }
    }
    animationFrameId = requestAnimationFrame(animateProgressBar);
    
    // Status Checks sequentially
    function typeLine(index) {
        if (index >= checks.length) return;
        const checkText = checks[index];
        const lineDiv = document.createElement("div");
        lineDiv.className = "boot-line show";
        if (index > 0) {
            lineDiv.classList.add("success");
            lineDiv.innerHTML = `<span class="checkmark">✔</span><span class="line-text"></span>`;
        } else {
            lineDiv.innerHTML = `<span class="line-text"></span>`;
        }
        
        const textSpan = lineDiv.querySelector(".line-text");
        terminalEl.insertBefore(lineDiv, activeLineEl);
        
        let charIdx = 0;
        const fullText = index === 0 ? checkText : checkText.substring(2);
        
        function typeChar() {
            if (charIdx < fullText.length) {
                textSpan.textContent += fullText[charIdx];
                charIdx++;
                terminalEl.scrollTop = terminalEl.scrollHeight;
                const typingTimeout = setTimeout(typeChar, 5);
                activeTimeouts.push(typingTimeout);
            }
        }
        typeChar();
    }
    
    checks.forEach((_, index) => {
        const timeoutId = setTimeout(() => {
            typeLine(index);
        }, index * 250);
        activeTimeouts.push(timeoutId);
    });
    
    // 2.0s: Hide progress & terminal, show final branding sequence
    const brandingTimeout = setTimeout(() => {
        terminalEl.style.display = "none";
        progressContainer.style.display = "none";
        brandingEl.style.display = "flex";
    }, 2000);
    activeTimeouts.push(brandingTimeout);
    
    // 2.5s: Begin fadeout, unlock scroll, init component animations
    const fadeTimeout = setTimeout(() => {
        bootScreen.classList.add("boot-fade-out");
        unlockScroll();
        initializeAllComponents();
        try {
            sessionStorage.setItem("bootPlayed", "true");
        } catch (e) {
            // Private browsing fallback
        }
    }, 2500);
    activeTimeouts.push(fadeTimeout);
    
    // 3.0s: Remove DOM element and cleanup
    const removeTimeout = setTimeout(() => {
        cleanupBoot();
        bootScreen.remove();
        document.documentElement.classList.remove("boot-active");
        document.documentElement.classList.add("boot-skipped");
    }, 3000);
    activeTimeouts.push(removeTimeout);
}

function initializeAllComponents() {
    initContactForm();
    initActiveNav();
    initMobileDrawer();
    initScrollProgress();
    initCertificateViewer();
    initCertificateFilters();
    initLiveVisitorCounter();
    initBackToTop();
    initDynamicYear();
    initPremiumCursor();
}

// Fire up scripts on DOM content ready
document.addEventListener("DOMContentLoaded", () => {
    const isSkipped = document.documentElement.classList.contains("boot-skipped");
    if (isSkipped) {
        initializeAllComponents();
    } else {
        startBootSequence();
    }
});