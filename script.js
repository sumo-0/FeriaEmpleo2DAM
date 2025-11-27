// Variables globales
// Mantenemos esta comprobación para proteger las páginas visualmente
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

// URL de tu backend (Ruta relativa desde el HTML)
const API_URL = 'backend/auth.php';

// Objeto Auth para manejar el estado de la sesión en el navegador
const Auth = {
    // Marcar como autenticado en el navegador (tras login exitoso en PHP)
    setAuthenticated: function(username) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', username);
        isAuthenticated = true;
    },

    // Verificar si está autenticado (para protección de rutas en JS)
    isAuthenticated: function() {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    // Cerrar sesión
    logout: function() {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('currentUser');
        isAuthenticated = false;
        window.location.href = 'index.html';
    }
};

// Funciones del modal (Visuales)
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm && registerForm) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector('.auth-tab[onclick*="switchToLogin"]').classList.add('active');
    }
}

function switchToRegister() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm && registerForm) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector('.auth-tab[onclick*="switchToRegister"]').classList.add('active');
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // --- LÓGICA DEL MENÚ HAMBURGUESA ---
    const barsMenu = document.getElementById('barsMenu');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const line1 = document.querySelector('.line1__bars-menu');
    const line2 = document.querySelector('.line2__bars-menu');
    const line3 = document.querySelector('.line3__bars-menu');

    if (barsMenu && hamburgerMenu) {
        barsMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            line1?.classList.toggle('activeline1__bars-menu');
            line2?.classList.toggle('activeline2__bars-menu');
            line3?.classList.toggle('activeline3__bars-menu');
        });
    }

    // --- LÓGICA DE LOGIN (CONECTADO A PHP) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Petición al servidor
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', username: username, password: password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Si PHP dice OK, guardamos estado local y redirigimos
                    Auth.setAuthenticated(username);
                    closeLoginModal();
                    window.location.href = 'empresas.html';
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión con el servidor.');
            });
        });
    }

    // --- LÓGICA DE REGISTRO (CONECTADO A PHP) ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            // Petición al servidor
            fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'register', username: username, password: password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registro exitoso. Ahora inicia sesión.');
                    
                    // Rellenar email y cambiar pestaña
                    const loginEmail = document.getElementById('loginEmail');
                    if (loginEmail) loginEmail.value = username;
                    switchToLogin();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión con el servidor.');
            });
        });
    }

    // --- PROTECCIÓN DE PÁGINA EMPRESAS ---
    if (window.location.pathname.includes('empresas.html') && !Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Manejar clics en enlaces a empresas.html para abrir modal si no está logueado
    document.querySelectorAll('a[href="empresas.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!Auth.isAuthenticated()) {
                e.preventDefault();
                showLoginModal();
            }
        });
    });

    // Cerrar modal al hacer clic fuera (y cerrar menú hamburguesa)
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('loginModal');
        if (e.target === modal) {
            closeLoginModal();
        }

        if (hamburgerMenu && barsMenu && !barsMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            line1?.classList.remove('activeline1__bars-menu');
            line2?.classList.remove('activeline2__bars-menu');
            line3?.classList.remove('activeline3__bars-menu');
        }
    });

    // Botón de cerrar modal (la X)
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', closeLoginModal);
    }
});

// Función de cierre de sesión global (disponible en el HTML)
window.logout = Auth.logout;