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

// Fire up scripts on DOM content ready
document.addEventListener("DOMContentLoaded", () => {
    typeAnimation();
    initContactForm();
    initActiveNav();
    initScrollProgress();
});