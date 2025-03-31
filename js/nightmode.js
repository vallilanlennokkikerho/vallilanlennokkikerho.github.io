// --- Initial Load Logic (Runs Immediately) ---
const htmlElImmediate = document.documentElement;
const nightModeStorageKey = 'nightMode';

function applyInitialNightMode() {
  const isDark = localStorage.getItem(nightModeStorageKey) === 'true';
  if (isDark) {
    htmlElImmediate.classList.add('night-mode');
    htmlElImmediate.style.colorScheme = 'dark';
  } else {
    // Ensure light mode defaults are set if not dark
    // htmlElImmediate.classList.remove('night-mode'); // Should be default state
    htmlElImmediate.style.colorScheme = 'light';
  }
}

applyInitialNightMode(); // Apply theme class and color-scheme immediately

// --- Event Listener and Icon Setup (Waits for DOM) ---
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nightModeIcon');
  // Can re-use htmlElImmediate or get it again
  const htmlEl = document.documentElement;

  if (!toggle) {
    console.error("Nightmode Script: Could not find night mode toggle icon.");
    return; // Stop if icon isn't found
  }

  // Set initial icon based on the *currently applied* class state
  const isCurrentlyDark = htmlEl.classList.contains('night-mode');
  toggle.textContent = isCurrentlyDark ? '☀️' : '🌙';

  // --- Event Listener ---
  toggle.addEventListener('click', () => {
    // Toggle class returns true if class was added, false if removed
    const newDarkState = htmlEl.classList.toggle('night-mode');
    localStorage.setItem(nightModeStorageKey, newDarkState);
    htmlEl.style.colorScheme = newDarkState ? 'dark' : 'light';
    toggle.textContent = newDarkState ? '☀️' : '🌙';
  });
});