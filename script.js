const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');
const sealButton = document.getElementById('sealButton');
let opened = false;

function openInvitation() {
  if (opened) return;
  opened = true;
  sealButton.disabled = true;
  cover.classList.add('opening');

  window.setTimeout(() => {
    invitation.classList.add('visible');
    invitation.setAttribute('aria-hidden', 'false');
    cover.classList.add('opened');
    document.body.style.overflow = 'auto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 550);
}

sealButton.addEventListener('click', openInvitation, { once: true });
sealButton.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') openInvitation();
});

document.body.style.overflow = 'hidden';
