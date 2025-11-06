const barsMenu = document.getElementById('barsMenu');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const line1 = document.querySelector('.line1__bars-menu');
const line2 = document.querySelector('.line2__bars-menu');
const line3 = document.querySelector('.line3__bars-menu');

barsMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('active');
  line1.classList.toggle('activeline1__bars-menu');
  line2.classList.toggle('activeline2__bars-menu');
  line3.classList.toggle('activeline3__bars-menu');
});

// Cerrar si se hace clic fuera
window.addEventListener('click', (e) => {
  if (!barsMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    hamburgerMenu.classList.remove('active');
    line1.classList.remove('activeline1__bars-menu');
    line2.classList.remove('activeline2__bars-menu');
    line3.classList.remove('activeline3__bars-menu');
  }
});