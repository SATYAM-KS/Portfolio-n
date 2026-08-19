/**
 * Satyam Singh Portfolio — Contact Form Controller
 * Powered by EmailJS (https://www.emailjs.com)
 * Single Dispatch: Sends the welcome / confirmation email directly to the VISITOR
 */

// Safe polyfill for setSelectionRange to prevent InvalidStateError on email/number inputs
if (typeof HTMLInputElement !== 'undefined' && HTMLInputElement.prototype.setSelectionRange) {
  const origSetSelectionRange = HTMLInputElement.prototype.setSelectionRange;
  HTMLInputElement.prototype.setSelectionRange = function(start, end, direction) {
    try {
      return origSetSelectionRange.apply(this, arguments);
    } catch (err) {
      // Gracefully ignore InvalidStateError on email/number input types
    }
  };
}

// =========================================================================
// ⚙️ EMAILJS CONFIGURATION (SENDS TO VISITOR ONLY)
// =========================================================================
const EMAILJS_CONFIG = {
  publicKey: "EotGfHN3M5enFmb_3",
  serviceId: "service_ev9nolq",
  templateId: "template_bueefo4",        // Template ID for the email sent to visitor
  fallbackTemplateId: "template_1i18tmd",// Alternate template ID if needed
  senderEmail: "contact.ksatyam@gmail.com",
  senderName: "Satyam Singh"
};

(function initContactForm() {
  console.log('[EmailJS] Initializing portfolio contact system (Visitor Dispatch)...');

  if (window.emailjs && EMAILJS_CONFIG.publicKey) {
    try {
      emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
      console.log('[EmailJS] Initialized successfully');
    } catch (e) {
      console.warn('[EmailJS] Init warning:', e);
    }
  }

  function showToast(message, type = 'success') {
    let toast = document.getElementById('contact-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'contact-toast';
      toast.style.cssText = [
        'position: fixed',
        'bottom: 24px',
        'right: 24px',
        'z-index: 9999',
        'padding: 16px 28px',
        'border-radius: 12px',
        'font-family: "Geist Mono", monospace',
        'font-size: 13px',
        'letter-spacing: 0.02em',
        'box-shadow: 0 12px 40px rgba(0,0,0,0.5)',
        'transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'transform: translateY(100px)',
        'opacity: 0',
        'backdrop-filter: blur(16px)',
        '-webkit-backdrop-filter: blur(16px)'
      ].join(';');
      document.body.appendChild(toast);
    }

    if (type === 'success') {
      toast.style.backgroundColor = 'rgba(18, 18, 18, 0.95)';
      toast.style.border = '1px solid rgba(255, 255, 255, 0.25)';
      toast.style.color = '#ffffff';
    } else if (type === 'warning') {
      toast.style.backgroundColor = 'rgba(32, 24, 10, 0.95)';
      toast.style.border = '1px solid rgba(245, 158, 11, 0.5)';
      toast.style.color = '#fbbf24';
    } else {
      toast.style.backgroundColor = 'rgba(38, 14, 14, 0.95)';
      toast.style.border = '1px solid rgba(239, 68, 68, 0.5)';
      toast.style.color = '#f87171';
    }

    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
    }, 5500);
  }

  let isSubmitting = false;

  async function handleContactSubmit(formElement) {
    if (isSubmitting) return;

    const scope = formElement || document.querySelector('#contact') || document;
    const nameInput = scope.querySelector('input[name="Name"]') || scope.querySelector('input[placeholder*="DOE" i]') || scope.querySelector('input[type="text"]:not([name="website"]):not([name="company"])');
    const emailInput = scope.querySelector('input[name="Email"]') || scope.querySelector('input[type="email"]') || scope.querySelector('input[placeholder*="@" i]');
    const messageInput = scope.querySelector('textarea') || scope.querySelector('input[name="Message"]') || scope.querySelector('.framer-d9hwwp textarea');
    
    const submitBtn = scope.querySelector('button[type="submit"]') || scope.querySelector('.framer-d47dl') || scope.querySelector('.framer-hkp3eh-container');
    const textSpan = submitBtn ? submitBtn.querySelector('.framer-1h72kra-container span') : null;
    const originalText = textSpan ? textSpan.textContent : "LET'S CHAT";

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    console.log('[EmailJS] Submitting form. Email will be sent to visitor:', email);

    // Validation
    if (!name) {
      showToast('Please enter your name.', 'warning');
      if (nameInput) nameInput.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      if (emailInput) emailInput.focus();
      return;
    }

    if (!message) {
      showToast('Please describe what you are building.', 'warning');
      if (messageInput) messageInput.focus();
      return;
    }

    isSubmitting = true;
    if (textSpan) textSpan.textContent = 'SENDING...';
    if (submitBtn) submitBtn.style.pointerEvents = 'none';

    // Parameters explicitly targeting the VISITOR as recipient
    const visitorParams = {
      // Recipient (The Visitor)
      to_email: email,
      to_name: name,
      user_email: email,
      user_name: name,
      email: email,
      name: name,

      // Sender (Satyam Singh)
      from_name: EMAILJS_CONFIG.senderName,
      from_email: EMAILJS_CONFIG.senderEmail,
      reply_to: EMAILJS_CONFIG.senderEmail,

      // Message Content
      user_message: message,
      message: message,
      project_description: message,
      project_brief: message,
      portfolio_url: window.location.origin
    };

    try {
      console.log('[EmailJS] Dispatching email to visitor:', email, 'using template:', EMAILJS_CONFIG.templateId);
      
      let res;
      try {
        res = await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          visitorParams,
          EMAILJS_CONFIG.publicKey
        );
      } catch (firstErr) {
        console.warn('[EmailJS] Primary template failed, trying fallback template:', firstErr);
        if (EMAILJS_CONFIG.fallbackTemplateId) {
          res = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.fallbackTemplateId,
            visitorParams,
            EMAILJS_CONFIG.publicKey
          );
        } else {
          throw firstErr;
        }
      }

      console.log('[EmailJS] Email sent successfully to visitor:', res);

      // Success feedback
      if (textSpan) textSpan.textContent = 'THANK YOU! ✓';
      showToast(`✓ Thank you, ${name}! A confirmation email has been sent to ${email}.`, 'success');

      // Clear inputs
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (messageInput) messageInput.value = '';

    } catch (err) {
      console.error('[EmailJS] Send error:', err);
      if (textSpan) textSpan.textContent = 'ERROR ✗';
      showToast('Failed to send email. Please check your email address.', 'error');
    } finally {
      isSubmitting = false;
      setTimeout(() => {
        if (textSpan) textSpan.textContent = originalText;
        if (submitBtn) submitBtn.style.pointerEvents = 'auto';
      }, 4000);
    }
  }

  // 1. Global Capture-Phase Submit Interceptor
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form && (form.classList.contains('framer-ah0bij') || form.closest('#contact'))) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      handleContactSubmit(form);
    }
  }, true);

  // 2. Global Capture-Phase Click Interceptor for Submit Button
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('button[type="submit"]') || 
                e.target.closest('.framer-d47dl') || 
                e.target.closest('.framer-hkp3eh-container');
    
    if (btn && btn.closest('#contact')) {
      e.preventDefault();
      e.stopPropagation();
      const form = btn.closest('form') || document.querySelector('#contact form');
      handleContactSubmit(form);
    }
  }, true);

})();
