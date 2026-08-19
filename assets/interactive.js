/**
 * Satyam Singh Portfolio — Interactive Enhancements
 * - Project Image Clickable Links & Permanent State Tracking
 * - Smooth Circular Cursor Follower ("OPEN LINK ↗")
 * - Universal new tab enforcement for external links & Resume PDF
 */

(function initPortfolioInteractive() {
  const PROJECTS_CONFIG = [
    { id: "001", title: "STUDYSYNC", url: "https://trystudysync.vercel.app/" },
    { id: "002", title: "CAREX AI", url: "https://carexai.vercel.app/" },
    { id: "003", title: "EVOLVEX", url: "https://github.com/SATYAM-KS/EvolveX-falcon" },
    { id: "004", title: "BHARAT DONATION", url: "https://bharatdonation.netlify.app/" },
    { id: "005", title: "BITBULB", url: "https://www.bitbulb.tech/" },
    { id: "006", title: "VAULT BANK", url: "https://vault-bank.netlify.app/" }
  ];

  let currentProjectIndex = 0;

  // 1. Create Custom Circle Cursor Follower
  let cursorCircle = document.getElementById('project-cursor-circle');
  if (!cursorCircle) {
    cursorCircle = document.createElement('div');
    cursorCircle.id = 'project-cursor-circle';
    cursorCircle.innerHTML = '<span>OPEN<br>LINK ↗</span>';
    cursorCircle.style.cssText = [
      'position: fixed',
      'top: 0',
      'left: 0',
      'width: 90px',
      'height: 90px',
      'border-radius: 50%',
      'background: rgba(18, 18, 18, 0.88)',
      'backdrop-filter: blur(12px)',
      '-webkit-backdrop-filter: blur(12px)',
      'border: 1px solid rgba(255, 255, 255, 0.3)',
      'color: #ffffff',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'font-family: "Geist Mono", monospace',
      'font-size: 11px',
      'font-weight: 600',
      'letter-spacing: 0.05em',
      'text-align: center',
      'line-height: 1.2',
      'pointer-events: none',
      'transform: translate(-50%, -50%) scale(0)',
      'opacity: 0',
      'transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease',
      'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5)',
      'z-index: 99999'
    ].join(';');
    document.body.appendChild(cursorCircle);
  }

  let mouseX = -100, mouseY = -100;
  let cursorActive = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorActive) {
      cursorCircle.style.left = mouseX + 'px';
      cursorCircle.style.top = mouseY + 'px';
    }
  }, { passive: true });

  function attachProjectInteractions() {
    const workSection = document.querySelector('#work') || document.querySelector('[data-framer-name="section-work"]');
    if (!workSection) return;

    // 1. Detect and track active variant from Framer state
    const workCol = workSection.querySelector('[data-framer-name^="Desktop "]') || workSection.querySelector('.framer-1b0c0sg');
    if (workCol) {
      const framerName = workCol.getAttribute('data-framer-name') || '';
      if (framerName.includes('Desktop 1')) currentProjectIndex = 0;
      else if (framerName.includes('Desktop 2')) currentProjectIndex = 1;
      else if (framerName.includes('Desktop 3')) currentProjectIndex = 2;
      else if (framerName.includes('Desktop 4')) currentProjectIndex = 3;
      else if (framerName.includes('Desktop 5')) currentProjectIndex = 4;
      else if (framerName.includes('Desktop 6')) currentProjectIndex = 5;
    }

    // 2. Attach hover tracking to project title rows
    for (let i = 1; i <= 6; i++) {
      const rows = workSection.querySelectorAll(`[data-framer-name="block-holder-${i}"]`);
      rows.forEach(row => {
        if (row.dataset.rowBound) return;
        row.dataset.rowBound = 'true';
        const pIndex = i - 1;

        row.addEventListener('mouseenter', () => {
          currentProjectIndex = pIndex;
        });

        row.addEventListener('click', (e) => {
          e.preventDefault();
          window.open(PROJECTS_CONFIG[pIndex].url, '_blank', 'noopener,noreferrer');
        });
      });
    }

    // 3. Track Large Preview Image Container & Attach Dynamic Link
    const imgWrapper = workSection.querySelector('[data-framer-name="image-wrapper"]') || workSection.querySelector('.framer-v9vg6j');
    if (imgWrapper && !imgWrapper.dataset.interactiveBound) {
      imgWrapper.dataset.interactiveBound = 'true';
      imgWrapper.style.cursor = 'pointer';

      imgWrapper.addEventListener('mouseenter', () => {
        cursorActive = true;
        cursorCircle.style.left = mouseX + 'px';
        cursorCircle.style.top = mouseY + 'px';
        cursorCircle.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorCircle.style.opacity = '1';

        const imgs = imgWrapper.querySelectorAll('img, [data-framer-name^="img-"]');
        imgs.forEach(im => {
          im.style.filter = 'blur(4px) brightness(0.75)';
          im.style.transform = 'scale(1.03)';
          im.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });
      });

      imgWrapper.addEventListener('mouseleave', () => {
        cursorActive = false;
        cursorCircle.style.transform = 'translate(-50%, -50%) scale(0)';
        cursorCircle.style.opacity = '0';

        const imgs = imgWrapper.querySelectorAll('img, [data-framer-name^="img-"]');
        imgs.forEach(im => {
          im.style.filter = 'none';
          im.style.transform = 'none';
        });
      });

      imgWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        const activeUrl = PROJECTS_CONFIG[currentProjectIndex].url;
        console.log('[Portfolio] Opening active project from image click:', PROJECTS_CONFIG[currentProjectIndex].title, activeUrl);
        window.open(activeUrl, '_blank', 'noopener,noreferrer');
      });
    }

    // 4. Ensure Resume links open /assets/documents/resume.pdf in new tab
    document.querySelectorAll('a').forEach(a => {
      const text = a.textContent.trim().toUpperCase();
      const href = a.getAttribute('href') || '';
      if (text === 'RESUME' || text === '+ RESUME' || href.includes('resume')) {
        a.setAttribute('href', '/assets/documents/resume.pdf');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else if (href.startsWith('http') || href.startsWith('mailto:') || href.endsWith('.pdf')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachProjectInteractions);
  } else {
    attachProjectInteractions();
  }
  window.addEventListener('load', attachProjectInteractions);
  setInterval(attachProjectInteractions, 1500);
})();
