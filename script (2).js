/* ============================================================
   LAMIEN DIGITAL — script.js
   ============================================================ */

/* ─── CONFIGURATION ─── */
const WA_NUMBER = '22655757299'; // Numéro WhatsApp sans le +

/* ─────────────────────────────────────────────
   1. NAVIGATION
───────────────────────────────────────────── */
let navOpen = false;

function toggleNav() {
  navOpen = !navOpen;
  document.getElementById('hbg').classList.toggle('open', navOpen);
  document.getElementById('mobMenu').classList.toggle('open', navOpen);
}

function closeNav() {
  navOpen = false;
  document.getElementById('hbg').classList.remove('open');
  document.getElementById('mobMenu').classList.remove('open');
}

// Fermer le menu en cliquant en dehors
document.addEventListener('click', function(e) {
  const nav = document.querySelector('nav');
  const mob = document.getElementById('mobMenu');
  if (!nav.contains(e.target) && !mob.contains(e.target)) {
    closeNav();
  }
});

// Changer l'apparence de la nav au scroll
window.addEventListener('scroll', function() {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('stb').classList.toggle('show', window.scrollY > 600);
}, { passive: true });

/* ─────────────────────────────────────────────
   2. SCROLL FLUIDE (tous les liens ancres)
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    const target = this.getAttribute('href');
    if (target && target.length > 1) {
      const el = document.querySelector(target);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
        closeNav();
      }
    }
  });
});

/* ─────────────────────────────────────────────
   3. ANIMATIONS AU SCROLL (Reveal)
───────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function(el) {
  revealObserver.observe(el);
});

/* ─────────────────────────────────────────────
   4. COMPTEURS ANIMÉS
───────────────────────────────────────────── */
function animateCounter(el, target, duration) {
  let current = 0;
  const step = target / (duration / 16);
  const timer = setInterval(function() {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

let countersDone = false;
const heroObserver = new IntersectionObserver(function(entries) {
  if (entries[0].isIntersecting && !countersDone) {
    countersDone = true;
    document.querySelectorAll('[data-count]').forEach(function(el) {
      animateCounter(el, parseInt(el.dataset.count), 1600);
    });
  }
});
const heroSection = document.querySelector('.hero');
if (heroSection) heroObserver.observe(heroSection);

/* ─────────────────────────────────────────────
   5. FAQ ACCORDÉON
───────────────────────────────────────────── */
function tFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  // Fermer tous les items ouverts
  document.querySelectorAll('.faq-item').forEach(function(i) {
    i.classList.remove('open');
  });
  // Ouvrir celui cliqué si ce n'était pas déjà ouvert
  if (!isOpen) {
    item.classList.add('open');
  }
}

/* ─────────────────────────────────────────────
   6. DÉTAILS PRODUITS
───────────────────────────────────────────── */
function toggleDet(btn, id) {
  const detail = document.getElementById(id);
  const isOpen = detail.classList.contains('open');
  detail.classList.toggle('open', !isOpen);
  btn.classList.toggle('opened', !isOpen);
}

/* ─────────────────────────────────────────────
   7. FILTRE BOUTIQUE
───────────────────────────────────────────── */
function filterProd(btn, cat) {
  // Mettre à jour les boutons
  document.querySelectorAll('.fb').forEach(function(b) {
    b.classList.remove('on');
  });
  btn.classList.add('on');

  // Filtrer les produits
  document.querySelectorAll('.prd').forEach(function(card) {
    if (cat === 'all' || card.dataset.cat === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ─────────────────────────────────────────────
   8. FORMULAIRE DE CONTACT → WHATSAPP
───────────────────────────────────────────── */
function sendForm() {
  // Récupérer les champs
  const nomEl      = document.getElementById('fn');
  const telEl      = document.getElementById('fp');
  const serviceEl  = document.getElementById('fs');
  const messageEl  = document.getElementById('fm');
  const btnEl      = document.getElementById('submitBtn');
  const btnText    = document.getElementById('btnText');

  // Nettoyer les erreurs précédentes
  clearErrors();

  const nom      = nomEl.value.trim();
  const tel      = telEl.value.trim();
  const service  = serviceEl.value || 'Non précisé';
  const message  = messageEl.value.trim();

  // ── Validation ──
  let valid = true;

  if (!nom) {
    showError(nomEl, 'Veuillez saisir votre nom complet.');
    valid = false;
  }

  if (!tel) {
    showError(telEl, 'Veuillez saisir votre numéro de téléphone.');
    valid = false;
  } else if (!/^[\d\s\+\-]{8,}$/.test(tel)) {
    showError(telEl, 'Numéro de téléphone invalide.');
    valid = false;
  }

  if (!message) {
    showError(messageEl, 'Veuillez saisir votre message.');
    valid = false;
  } else if (message.length < 10) {
    showError(messageEl, 'Votre message est trop court (minimum 10 caractères).');
    valid = false;
  }

  if (!valid) return;

  // ── Construction du message WhatsApp ──
  const waMessage =
    `Bonjour LAMIEN DIGITAL ! 👋\n\n` +
    `👤 *Nom :* ${nom}\n` +
    `📱 *Téléphone :* ${tel}\n` +
    `🔧 *Service :* ${service}\n` +
    `💬 *Message :* ${message}\n\n` +
    `_Message envoyé depuis le site web_`;

  // ── Encodage et ouverture WhatsApp ──
  const encodedMessage = encodeURIComponent(waMessage);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

  // Feedback visuel : désactiver le bouton
  btnEl.disabled = true;
  btnText.textContent = 'Ouverture WhatsApp...';

  // Ouvrir WhatsApp dans un nouvel onglet
  window.open(waUrl, '_blank');

  // Afficher le message de succès après 800ms
  setTimeout(function() {
    document.getElementById('cForm').style.display = 'none';
    document.getElementById('formOk').style.display = 'block';
    // Scroll vers le message de succès
    document.getElementById('formOk').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 800);
}

/* ── Helpers de validation ── */
function showError(field, msg) {
  field.classList.add('field-error');
  const span = document.createElement('span');
  span.className = 'error-msg';
  span.textContent = msg;
  field.parentElement.appendChild(span);
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(function(el) {
    el.classList.remove('field-error');
  });
  document.querySelectorAll('.error-msg').forEach(function(el) {
    el.remove();
  });
}

// Effacer l'erreur d'un champ dès que l'utilisateur tape
['fn', 'fp', 'fs', 'fm'].forEach(function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', function() {
      this.classList.remove('field-error');
      const err = this.parentElement.querySelector('.error-msg');
      if (err) err.remove();
    });
  }
});

/* ─────────────────────────────────────────────
   9. PERMETTRE L'ENVOI AVEC ENTRÉE (textarea : Ctrl+Entrée)
───────────────────────────────────────────── */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && e.ctrlKey) {
    const form = document.getElementById('cForm');
    if (form && form.style.display !== 'none') {
      sendForm();
    }
  }
});
