// --- Event Listener Setup (Waits for DOM) ---
document.addEventListener('DOMContentLoaded', function() {
  const htmlEl = document.documentElement;
  const storageKey = 'fontSizePercent';
  const defaultFontSize = 100; // Default size in percent
  const minSize = 70; // Minimum font size percentage
  const maxSize = 150; // Maximum font size percentage
  const step = 20; // Change font size by 20% each time

  const decreaseBtn = document.getElementById('fontSizeDecrease');
  const resetBtn = document.getElementById('fontSizeReset');
  const increaseBtn = document.getElementById('fontSizeIncrease');

  if (!decreaseBtn || !resetBtn || !increaseBtn) {
    // console.error('Fontsize Script: Could not find one or more font size buttons!'); // Optional for prod
    return;
  }

  function applyFontSizeOnClick(sizePercent) {
    const newSize = Math.max(minSize, Math.min(maxSize, sizePercent));
    htmlEl.style.fontSize = `${newSize}%`;
    localStorage.setItem(storageKey, newSize.toString());
  }

  function getCurrentSizePercent() {
    const currentStyle = htmlEl.style.fontSize;
    if (currentStyle && currentStyle.endsWith('%')) {
        const parsedFromStyle = parseFloat(currentStyle);
        if (!isNaN(parsedFromStyle)) {
            return parsedFromStyle;
        }
    }
    const saved = localStorage.getItem(storageKey);
    if (saved !== null && saved !== undefined) {
        const parsedFromStorage = parseFloat(saved);
        if (!isNaN(parsedFromStorage)) {
            return parsedFromStorage;
        }
    }
    return defaultFontSize;
  }

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

});