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

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header-menu');
    
    // Get the initial height of the header. This is the scroll threshold.
    const stickyPoint = header.offsetHeight; 

    // Find the nearest placeholder (or content section) to insert the spacer
    const nextSibling = header.nextElementSibling;
    
    // 1. Create and insert the placeholder element dynamically
    const placeholder = document.createElement('div');
    placeholder.classList.add('header-placeholder');
    header.parentNode.insertBefore(placeholder, nextSibling);


    // 2. Define the scroll function
    function handleScroll() {
        // window.pageYOffset is the current scroll position from the top
        if (window.pageYOffset > stickyPoint) {
            // Add the sticky class if the user scrolls past the header's original height
            header.classList.add('sticky-active');
        } else {
            // Remove the sticky class if the user scrolls back to the top
            header.classList.remove('sticky-active');
        }
    }

    // 3. Attach the function to the scroll event
    window.addEventListener('scroll', handleScroll);

    // Run once on load to catch initial page position (if page loads scrolled down)
    handleScroll();
});