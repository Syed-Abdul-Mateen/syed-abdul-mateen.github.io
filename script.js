// ======================================
// 1. TYPING ANIMATION (AI Security, etc.)
// ======================================
const typingText = document.querySelector('.typing-text');
const texts = [
  "AI Security Developer",
  "Python Automation Engineer",
  "Cyber Threat Analyst",
  "Machine Learning Enthusiast",
  "Threat Detection Specialist"
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typingText) return; // Safety check

  const current = texts[textIndex];
  typingText.textContent = isDeleting 
    ? current.substring(0, charIndex--) 
    : current.substring(0, charIndex++);

  if (!isDeleting && charIndex === current.length) {
    isDeleting = true;
    setTimeout(type, 1200);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % texts.length;
  }

  const speed = Math.random() * 50 + 50;
  setTimeout(type, isDeleting ? 40 : speed);
}

// Start typing after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  if (typingText) type();
});

// ======================================
// 2. SCROLL ANIMATIONS (Fade, Slide)
// ======================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
);

// Apply to all animated sections
document.querySelectorAll('.fade-up, .slide-in').forEach((el) => {
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  el.style.opacity = 0;
  el.style.transform = 'translateY(60px)';
  observer.observe(el);
});

// ======================================
// 3. SCROLL TO TOP BUTTON
// ======================================
const scrollToTopBtn = document.getElementById("scrollToTop");
if (scrollToTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Animate skill bars on scroll
const skillBars = document.querySelectorAll('.bar');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.getAttribute('style').split(":")[1];
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
  const originalWidth = bar.style.width;
  bar.style.width = '0';
  skillObserver.observe(bar);
});


// ======================================
// 4. POPUP SYSTEM (For Email/Phone Click)
// ======================================
function showPopup(msg) {
  const popup = document.getElementById("popup");
  if (!popup) return;
  popup.textContent = msg;
  popup.classList.remove("hidden");
  setTimeout(() => popup.classList.add("hidden"), 2000);
}

// Add click listeners to contact items
document.querySelectorAll('.contact-item').forEach(item => {
  item.addEventListener('click', (e) => {
    const text = item.textContent.trim();
    if (text.includes('@')) {
      showPopup('Email copied to clipboard!');
    } else if (text.includes('+91')) {
      showPopup('Calling...');
    }
  });
});

// ======================================
// 5. RESUME BUTTON HOVER ANIMATION
// ======================================
const resumeBtn = document.getElementById("resumeBtn");
if (resumeBtn) {
  const originalHTML = resumeBtn.innerHTML;

  resumeBtn.addEventListener("mouseenter", () => {
    resumeBtn.innerHTML = "View Resume";
  });

  resumeBtn.addEventListener("mouseleave", () => {
    resumeBtn.innerHTML = originalHTML;
  });
}

// ======================================
// 6. PROFILE IMAGE ZOOM (Fullscreen)
// ======================================
const profileImg = document.getElementById('profileImg');
const overlay = document.getElementById('profileOverlay');
const expandedImg = document.getElementById('expandedImg');
const closeBtn = document.getElementById('closeBtn');

if (profileImg && overlay && expandedImg && closeBtn) {
  profileImg.addEventListener('click', () => {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// ======================================
// 7. SKILL RINGS ANIMATION
// ======================================
document.querySelectorAll('.ring').forEach(ring => {
  const percent = parseInt(ring.getAttribute('data-percent') || '0');
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  // Set stroke-dasharray for full circle
  ring.style.border = '12px solid #002b5c';
  ring.style.borderTopColor = '#00a8ff';
  ring.style.transform = `rotate(${percent * 3.6}deg)`;
  ring.style.transition = 'transform 2s cubic-bezier(0.2, 0.8, 0.7, 0.3)';
});

// ======================================
// 8. CANVAS: NEURAL NETWORK BACKGROUND
// ======================================
const canvas = document.getElementById('neural-bg');
if (canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let nodes = [];
  const nodeCount = 120;

  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    });
  }

  // Draw connections
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(0, 168, 255, 0.2)';
    ctx.lineWidth = 0.8;

    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00a8ff';
      ctx.fill();

      // Connect to nearby nodes
      nodes.forEach(other => {
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }

  draw();

  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ======================================
// 9. WINDOW LOAD EVENT (Final Check)
// ======================================
window.addEventListener('load', () => {
  console.log('✅ Portfolio loaded successfully!');
  console.log('🔧 All animations and interactions are active.');
});