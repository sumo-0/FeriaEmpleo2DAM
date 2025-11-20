// Variables globales
let isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

// Objeto Auth para manejar la autenticación
const Auth = {
    // Obtener usuarios del localStorage
    getUsers: function() {
        try {
            return JSON.parse(localStorage.getItem('users')) || {};
        } catch {
            return {};
        }
    },

    // Guardar usuarios en localStorage
    saveUser: function(username, password) {
        const users = this.getUsers();
        users[username] = password;
        localStorage.setItem('users', JSON.stringify(users));
    },

    // Verificar credenciales
    checkCredentials: function(username, password) {
        const users = this.getUsers();
        return users[username] === password;
    },

    // Marcar como autenticado
    setAuthenticated: function(username) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', username);
        isAuthenticated = true;
    },

    // Verificar si está autenticado
    isAuthenticated: function() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }
};

// Funciones del modal
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
    // Elementos del menú hamburguesa
    const barsMenu = document.getElementById('barsMenu');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const line1 = document.querySelector('.line1__bars-menu');
    const line2 = document.querySelector('.line2__bars-menu');
    const line3 = document.querySelector('.line3__bars-menu');

    // Configurar menú hamburguesa
    if (barsMenu && hamburgerMenu) {
        barsMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            line1?.classList.toggle('activeline1__bars-menu');
            line2?.classList.toggle('activeline2__bars-menu');
            line3?.classList.toggle('activeline3__bars-menu');
        });
    }

    // Formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (Auth.checkCredentials(username, password)) {
                Auth.setAuthenticated(username);
                closeLoginModal();
                window.location.href = 'empresas.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }

    // Formulario de registro
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

            const users = Auth.getUsers();
            if (users[username]) {
                alert('El usuario ya existe');
                return;
            }

            Auth.saveUser(username, password);
            alert('Registro exitoso');
            
            const loginEmail = document.getElementById('loginEmail');
            if (loginEmail) {
                loginEmail.value = username;
            }
            switchToLogin();
        });
    }

    // Proteger acceso a empresas.html
    if (window.location.pathname.includes('empresas.html') && !Auth.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    // Manejar clics en enlaces a empresas.html
    document.querySelectorAll('a[href="empresas.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (!Auth.isAuthenticated()) {
                e.preventDefault();
                showLoginModal();
            }
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('loginModal');
        if (e.target === modal) {
            closeLoginModal();
        }

        // Cerrar menú hamburguesa al hacer clic fuera
        if (hamburgerMenu && barsMenu && !barsMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            hamburgerMenu.classList.remove('active');
            line1?.classList.remove('activeline1__bars-menu');
            line2?.classList.remove('activeline2__bars-menu');
            line3?.classList.remove('activeline3__bars-menu');
        }
    });

    // Botón de cerrar modal
    const closeButton = document.querySelector('.close');
    if (closeButton) {
        closeButton.addEventListener('click', closeLoginModal);
    }
});

// Función de cierre de sesión global
window.logout = function() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    isAuthenticated = false;
    window.location.href = 'index.html';
};