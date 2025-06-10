document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const trigger = document.querySelector('.trigger');

  if (menuIcon && trigger) {
    menuIcon.addEventListener('click', function(event) {
      event.preventDefault();
      trigger.style.display = trigger.style.display === 'block' ? 'none' : 'block';
    });
  }
});