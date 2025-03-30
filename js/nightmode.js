document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nightModeIcon');
  const htmlEl = document.documentElement;

  // Set initial icon based on current mode
  const isDark = localStorage.getItem('nightMode') === 'true';
  toggle.textContent = isDark ? '☀️' : '🌙';

  toggle.addEventListener('click', () => {
    const newDarkState = htmlEl.classList.toggle('night-mode');
    localStorage.setItem('nightMode', newDarkState);
    htmlEl.style.colorScheme = newDarkState ? 'dark' : 'light';
    toggle.textContent = newDarkState ? '☀️' : '🌙';
  });
});