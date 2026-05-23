/* ============================================================
   THE LAST LESSON — JavaScript
   Alphonse Daudet | Feedback Form Logic
   ============================================================ */

'use strict';

// ── Floating Particles ──────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 20;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left           = Math.random() * 100 + 'vw';
    p.style.width          = (Math.random() * 3 + 2) + 'px';
    p.style.height         = p.style.width;
    p.style.animationDuration  = (Math.random() * 15 + 12) + 's';
    p.style.animationDelay     = (Math.random() * 10) + 's';
    p.style.opacity        = '0';
    // Vary shapes: some are squares (quill ink), circles (dust)
    if (Math.random() > 0.6) {
      p.style.borderRadius = '0';
      p.style.transform = 'rotate(45deg)';
    }
    container.appendChild(p);
  }
})();

// ── Star Rating Logic ───────────────────────────────────────
const ratingFields = [
  'comprehension', 'theme', 'character', 'history',
  'expression', 'oral', 'creativity', 'visual',
  'research', 'relevance'
];

const ratingValues = {};
ratingFields.forEach(name => { ratingValues[name] = 0; });

function initStarRating(containerId) {
  const container = document.getElementById('rating-' + containerId);
  if (!container) return;
  const stars      = container.querySelectorAll('.star');
  const hiddenInput = container.querySelector('input[type="hidden"]');

  stars.forEach(star => {
    const val = parseInt(star.dataset.value);

    star.addEventListener('mouseover', () => {
      stars.forEach(s => {
        const sv = parseInt(s.dataset.value);
        s.classList.toggle('hovered', sv <= val);
      });
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hovered'));
    });

    star.addEventListener('click', () => {
      ratingValues[containerId] = val;
      hiddenInput.value = val;
      stars.forEach(s => {
        const sv = parseInt(s.dataset.value);
        s.classList.toggle('selected', sv <= val);
      });
      clearError('err-' + containerId);
      updateScoreSummary();
    });
  });
}

ratingFields.forEach(initStarRating);

// ── Score Summary ───────────────────────────────────────────
function updateScoreSummary() {
  const vals  = Object.values(ratingValues).filter(v => v > 0);
  const avg   = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  const total = ratingFields.length;

  const scoreValue = document.getElementById('avg-score');
  const scoreBar   = document.getElementById('score-bar');
  const scoreGrade = document.getElementById('score-grade');

  if (vals.length === 0) {
    scoreValue.textContent = '—';
    scoreBar.style.width   = '0%';
    scoreGrade.textContent = 'Rate all criteria above';
    return;
  }

  scoreValue.textContent = avg.toFixed(1);
  scoreBar.style.width   = (avg / 5 * 100) + '%';

  const rated    = vals.length;
  const progress = `${rated}/${total} criteria rated`;

  if (rated < total) {
    scoreGrade.textContent = progress;
  } else {
    if (avg >= 4.5)      scoreGrade.textContent = '🌟 Outstanding Performance';
    else if (avg >= 3.5) scoreGrade.textContent = '✨ Excellent Work';
    else if (avg >= 2.5) scoreGrade.textContent = '👍 Good Effort';
    else if (avg >= 1.5) scoreGrade.textContent = '📋 Satisfactory';
    else                 scoreGrade.textContent = '🔧 Needs Improvement';
  }
}

// ── Grade Selector ──────────────────────────────────────────
const gradeBtns    = document.querySelectorAll('.grade-btn');
const finalGradeInput = document.getElementById('final-grade');

gradeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    gradeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    finalGradeInput.value = btn.dataset.grade;
    clearError('err-grade');
  });
});

// ── Impression Selector ─────────────────────────────────────
const impressionBtns  = document.querySelectorAll('.impression-btn');
const impressionInput = document.getElementById('overall-impression');

impressionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    impressionBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    impressionInput.value = btn.dataset.val;
  });
});

// (char counters removed — qualitative feedback section deleted)

// ── Error Helpers ───────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

function markInvalid(inputId, errId, msg) {
  const input = document.getElementById(inputId);
  if (input) input.classList.add('invalid');
  showError(errId, msg);
}

function markValid(inputId) {
  const input = document.getElementById(inputId);
  if (input) input.classList.remove('invalid');
}

// ── Validation ──────────────────────────────────────────────
function validate() {
  let valid = true;

  // Ratings — all must be rated
  ratingFields.forEach(field => {
    if (!ratingValues[field]) {
      showError('err-' + field, 'Please rate this criterion.');
      valid = false;
    } else {
      clearError('err-' + field);
    }
  });

  // Grade
  if (!finalGradeInput.value) {
    showError('err-grade', 'Please assign a final grade.');
    valid = false;
  } else { clearError('err-grade'); }

  // Consent
  const consent = document.getElementById('consent-check').checked;
  if (!consent) {
    showError('err-consent', 'You must confirm your assessment is independent and honest.');
    valid = false;
  } else { clearError('err-consent'); }

  return valid;
}

// ── Form Submission ─────────────────────────────────────────
const form = document.getElementById('mainFeedbackForm');
const successModal = document.getElementById('success-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validate()) {
    // Brief visual feedback then redirect to confirmation page
    const btn = document.getElementById('btn-submit');
    btn.innerHTML = '<span class="btn-text">Submitting…</span>';
    btn.style.opacity = '0.7';
    btn.disabled = true;
    setTimeout(() => {
      window.location.href = 'thank-you.html';
    }, 600);
  } else {
    // Scroll to first error
    const firstError = form.querySelector('.field-error:not(:empty)');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});

modalCloseBtn.addEventListener('click', () => {
  closeModal(successModal);
  form.reset();
  resetAll();
});

// ── Preview ─────────────────────────────────────────────────
const previewBtn      = document.getElementById('btn-preview');
const previewModal    = document.getElementById('preview-modal');
const previewContent  = document.getElementById('preview-content');
const previewCloseBtn = document.getElementById('preview-close-btn');

function buildPreview() {
  const get = id => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  const gradeLabels = {
    'A+':'A+ (Outstanding)', 'A':'A (Excellent)', 'B+':'B+ (Very Good)',
    'B':'B (Good)', 'C+':'C+ (Above Average)', 'C':'C (Average)', 'D':'D (Below Average)'
  };
  const impLabels = {
    'outstanding':'🌟 Outstanding', 'excellent':'✨ Excellent',
    'good':'👍 Good', 'satisfactory':'📋 Satisfactory', 'needs-work':'🔧 Needs Work'
  };
  const awardLabels = {
    'yes':'Yes, highly recommended',
    'maybe':'Possibly, with minor revisions',
    'no':'Not at this stage'
  };

  const ratingLabel = v => v ? '★'.repeat(v) + '☆'.repeat(5-v) + ` (${v}/5)` : 'Not rated';

  let html = '';

  // Student (fixed)
  html += `<div class="preview-section-title">Student Information</div>`;
  html += row('Student Name', 'Piyush Kumar');
  html += row('Class', "12 'I'");
  html += row('Roll No.', '27');
  html += row('Academic Session', '2026 – 27');
  html += row('School', 'Chinmaya Vidyalaya, Bokaro');

  // Ratings
  html += `<div class="preview-section-title">Evaluation Ratings</div>`;
  const ratingNames = {
    comprehension:'Comprehension', theme:'Theme Analysis', character:'Character Analysis',
    history:'Historical Context', expression:'Written Expression', oral:'Oral Presentation',
    creativity:'Creativity', visual:'Visual Presentation', research:'Research', relevance:'Relevance'
  };
  ratingFields.forEach(f => {
    html += row(ratingNames[f], ratingLabel(ratingValues[f]));
  });

  const vals = Object.values(ratingValues).filter(v => v > 0);
  const avg  = vals.length ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '—';
  html += row('Average Score', avg + ' / 5.0');

  // Grade
  html += `<div class="preview-section-title">Final Grade</div>`;
  html += row('Grade', gradeLabels[finalGradeInput.value] || '—');
  const mo = get('marks-obtained'), mt = get('marks-total');
  if (mo && mt) html += row('Marks', `${mo} / ${mt}`);

  // Impression
  html += `<div class="preview-section-title">Overall Impression</div>`;
  const award = document.querySelector('input[name="award_rec"]:checked');
  html += row('Award Recommendation', awardLabels[award?.value] || '—');
  html += row('Overall Impression', impLabels[impressionInput.value] || '—');

  previewContent.innerHTML = html;
}

function row(key, val) {
  return `<div class="preview-row"><span class="preview-key">${key}</span><span class="preview-val">${val}</span></div>`;
}

previewBtn.addEventListener('click', () => {
  buildPreview();
  openModal(previewModal);
});

previewCloseBtn.addEventListener('click', () => closeModal(previewModal));

// ── Reset ───────────────────────────────────────────────────
function resetAll() {
  // Reset stars
  ratingFields.forEach(name => {
    ratingValues[name] = 0;
    const container = document.getElementById('rating-' + name);
    if (container) {
      container.querySelectorAll('.star').forEach(s => s.classList.remove('selected', 'hovered'));
      const hi = container.querySelector('input[type="hidden"]');
      if (hi) hi.value = '';
    }
  });

  // Reset grade buttons
  gradeBtns.forEach(b => b.classList.remove('active'));
  finalGradeInput.value = '';

  // Reset impression buttons
  impressionBtns.forEach(b => b.classList.remove('active'));
  impressionInput.value = '';

  // Clear all errors
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

  // Reset score
  updateScoreSummary();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('btn-reset').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the entire form? All data will be lost.')) {
    form.reset();
    resetAll();
  }
});

// ── Modal Helpers ───────────────────────────────────────────
function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
[successModal, previewModal].forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  });
});

// Close modal on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    [successModal, previewModal].forEach(m => {
      if (m.classList.contains('active')) closeModal(m);
    });
  }
});

// ── Smooth Scroll for CTA ───────────────────────────────────
document.querySelector('.hero-cta')?.addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('feedback-form')?.scrollIntoView({ behavior: 'smooth' });
});

// ── Intersection Observer: animate cards on scroll ──────────
const cards = document.querySelectorAll('.form-card, .theme-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

cards.forEach(card => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(30px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

document.getElementById('consent-check').addEventListener('change', function() {
  if (this.checked) clearError('err-consent');
});

console.log(
  '%c✦ The Last Lesson — Feedback Form ✦',
  'font-family: Georgia, serif; font-size: 14px; color: #c8963e; background: #1a1209; padding: 8px 16px; border-left: 3px solid #c8963e;'
);
console.log(
  '%c"When a people are enslaved, as long as they hold fast to their language it is as if they had the key to their prison." — M. Hamel',
  'font-style: italic; color: #7a5c45;'
);
