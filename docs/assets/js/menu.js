document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.getElementById('main-nav-list');

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
        menuToggle.setAttribute('aria-expanded', !isExpanded);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header-menu');
    const stickyPoint = header.offsetHeight; 
    const nextSibling = header.nextElementSibling;
    
    const placeholder = document.createElement('div');
    placeholder.classList.add('header-placeholder');
    header.parentNode.insertBefore(placeholder, nextSibling);

    function handleScroll() {
        if (window.pageYOffset > stickyPoint) {
            header.classList.add('sticky-active');
        } else {
            header.classList.remove('sticky-active');
        }
    }

    window.addEventListener('scroll', handleScroll);

    handleScroll();
});