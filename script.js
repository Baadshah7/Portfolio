// ⚡ TYPING ANIMATION FOR SOC ROLES
const roles = [
    "Network Security",
    "Ethical Hacking",
    "Digital Forensics",
    "Incident Response"
];
let currentRoleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");
const typingSpeed = 100;
const eraseSpeed = 50;
const delayBetweenRoles = 2000;

function typeAnimation() {
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

// Fire up scripts on DOM content ready
document.addEventListener("DOMContentLoaded", () => {
    typeAnimation();
});