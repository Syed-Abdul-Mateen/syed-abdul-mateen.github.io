// Typing Animation for Tagline
const typingText = document.querySelector('.typing-text');
const texts = [
  "AI Security Developer",
  "Python Automation Engineer",
  "Cyber Threat Analyst"
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentText = texts[textIndex];
  
  if (isDeleting) {
    typingText.textContent = currentText.substring(0, charIndex--);
  } else {
    typingText.textContent = currentText.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, 1200);
    return;
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  const speed = Math.random() * 100 + 50;
  setTimeout(type, speed);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typingText) type();

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = 0;
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    observer.observe(section);
  });
});