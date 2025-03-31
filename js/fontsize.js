// --- Initial Load Logic (Runs Immediately) ---
const htmlEl = document.documentElement;
const storageKey = 'fontSizePercent';
const defaultFontSize = 100; // Default size in percent
const minSize = 70; // Minimum font size percentage
const maxSize = 150; // Maximum font size percentage

// Function to apply font size (needed for initial load)
function applyInitialFontSize(sizePercent) {
  const newSize = Math.max(minSize, Math.min(maxSize, sizePercent));
  htmlEl.style.fontSize = `${newSize}%`;
  // We only *set* localStorage here if applying the initial value,
  // otherwise, it's handled by the button clicks later.
  // localStorage.setItem(storageKey, newSize); // Avoid setting it again if already loaded
}

// Apply stored size immediately
const savedSizePercent = localStorage.getItem(storageKey);
if (savedSizePercent) {
  applyInitialFontSize(parseFloat(savedSizePercent));
} else {
  // Optional: Apply default if nothing is saved, though CSS should handle this.
  // applyInitialFontSize(defaultFontSize);
}


// --- Event Listener Setup (Waits for DOM) ---
document.addEventListener('DOMContentLoaded', function() {
  // Note: Re-getting html element inside DOMContentLoaded might be redundant
  // but ensures it's available if the script execution context changes.
  // Using the already defined htmlEl is likely fine.
  const decreaseBtn = document.getElementById('fontSizeDecrease');
  const resetBtn = document.getElementById('fontSizeReset');
  const increaseBtn = document.getElementById('fontSizeIncrease');

  // Check if buttons were found
  if (!decreaseBtn || !resetBtn || !increaseBtn) {
    console.error('Fontsize Script: Could not find one or more font size buttons!');
    return; // Stop if buttons aren't found
  }

  const step = 10; // Change font size by 10% each time

  // Function to apply font size on click (slightly different from initial)
  function applyFontSizeOnClick(sizePercent) {
    const newSize = Math.max(minSize, Math.min(maxSize, sizePercent));
    htmlEl.style.fontSize = `${newSize}%`;
    localStorage.setItem(storageKey, newSize); // Set storage on interaction
  }

  // Function to get the current size percentage (needed for clicks)
  function getCurrentSizePercent() {
    // Read directly from the applied style if possible, fallback to storage/default
    const currentStyle = htmlEl.style.fontSize;
     if (currentStyle && currentStyle.includes('%')) {
       return parseFloat(currentStyle);
     }
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return parseFloat(saved);
    }
    return defaultFontSize; // Fallback
  }


  // --- Event Listeners ---
  decreaseBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const currentSize = getCurrentSizePercent();
    applyFontSizeOnClick(currentSize - step);
  });

  resetBtn.addEventListener('click', (event) => {
    event.preventDefault();
    applyFontSizeOnClick(defaultFontSize);
  });

  increaseBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const currentSize = getCurrentSizePercent();
    applyFontSizeOnClick(currentSize + step);
  });

}); // End DOMContentLoaded