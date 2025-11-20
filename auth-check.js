// Verificar autenticación al cargar la página
window.addEventListener('load', function() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = 'index.html';
    }
});