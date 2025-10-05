document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav-list');
    
    // Función que se ejecuta al hacer clic en el botón
    menuToggle.addEventListener('click', () => {
        // Alterna la clase 'active' en el menú (para mostrar/ocultar)
        mainNav.classList.toggle('active');
        
        // Alterna el estado de accesibilidad del botón
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
});