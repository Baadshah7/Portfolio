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
function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");

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

    window.addEventListener("scroll", highlightNav);
    highlightNav(); // initial call
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

// Fire up scripts on DOM content ready
document.addEventListener("DOMContentLoaded", () => {
    typeAnimation();
    initContactForm();
    initActiveNav();
    initScrollProgress();
    initBackToTop();
    initDynamicYear();
    initPremiumCursor();
    initVisitorCounter();
});
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

// 👁️ VISITOR COUNTER ANIMATION & FETCH
async function initVisitorCounter() {
    const counterEl = document.getElementById('visitor-count');
    if (!counterEl) return;

    // PLACEHOLDER: The user needs to replace YOUR_GOATCOUNTER_CODE with their actual site code!
    const GOATCOUNTER_CODE = 'YOUR_GOATCOUNTER_CODE'; 
    const url = `https://${GOATCOUNTER_CODE}.goatcounter.com/counter//Portfolio/.json`;

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("GoatCounter API failed");
        
        const data = await response.json();
        let totalVisits = 0;
        
        // GoatCounter returns numbers with spaces for thousands (e.g. "1 274")
        if (data && data.count) {
             totalVisits = parseInt(data.count.replace(/\D/g, '')) || 0;
        }

        // Animate counting
        animateValue(counterEl, 0, totalVisits, 700);

    } catch (error) {
        console.warn("Visitor counter fetch failed or timed out:", error);
        counterEl.textContent = '—';
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // Easing function (easeOutQuart) for premium slowing down effect
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        obj.innerHTML = currentVal.toLocaleString();
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString();
        }
    };
    window.requestAnimationFrame(step);
}
