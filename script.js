const coverScreen = document.getElementById('coverScreen');
const invitationScreen = document.getElementById('invitationScreen');
const sealButton = document.getElementById('sealButton');
const closeInvitation = document.getElementById('closeInvitation');
const rsvpForm = document.getElementById('rsvpForm');
const formStatus = document.getElementById('formStatus');

let opening = false;

function openInvitation() {
  if (opening || document.body.classList.contains('invitation-open')) return;
  opening = true;
  sealButton.disabled = true;
  coverScreen.classList.add('opening');

  window.setTimeout(() => {
    document.body.classList.add('invitation-open');
    invitationScreen.setAttribute('aria-hidden', 'false');
    window.scrollTo(0, 0);
  }, 1000);

  window.setTimeout(() => {
    coverScreen.classList.add('cover-finished');
    opening = false;
  }, 1850);
}

function returnToCover() {
  coverScreen.classList.remove('cover-finished', 'opening');
  document.body.classList.remove('invitation-open');
  invitationScreen.setAttribute('aria-hidden', 'true');
  sealButton.disabled = false;
  opening = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

sealButton.addEventListener('click', openInvitation);
closeInvitation.addEventListener('click', returnToCover);

// Paste your deployed Google Apps Script Web App URL between the quotes.
const GOOGLE_SCRIPT_URL = '';

rsvpForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = rsvpForm.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(rsvpForm).entries());
  data.timestamp = new Date().toISOString();

  submitButton.disabled = true;
  formStatus.className = 'form-status';
  formStatus.textContent = 'Sending your RSVP…';

  try {
    if (!GOOGLE_SCRIPT_URL) {
      throw new Error('RSVP setup is not complete yet. Add your Google Apps Script Web App URL in script.js.');
    }

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data)
    });

    formStatus.classList.add('success');
    formStatus.textContent = 'Thank you! Your RSVP has been received.';
    rsvpForm.reset();
  } catch (error) {
    formStatus.classList.add('error');
    formStatus.textContent = error.message || 'We could not send your RSVP. Please try again.';
  } finally {
    submitButton.disabled = false;
  }
});
