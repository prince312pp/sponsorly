document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
});

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Update Navbar based on Auth State
    updateNavbarUI(user);

    // 2. Hamburger Toggle Logic
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

function updateNavbarUI(user) {
    const navLinks = document.querySelector('.nav-links');
    const navAuth = document.querySelector('.nav-auth');

    if (!navLinks) return;

    let navHtml = '';
    if (user) {
        // Authenticated State
        if (window.location.pathname.includes('dashboard.html') ||
            window.location.pathname.includes('discover.html') ||
            window.location.pathname.includes('profile.html') ||
            window.location.pathname.includes('edit-profile.html')) {

            navHtml = `
                <li><a href="dashboard.html">Dashboard</a></li>
                <li><a href="discover.html">Discover</a></li>
                <li><a href="profile.html">Profile</a></li>
                <li class="mobile-only"><a href="#" onclick="logout()">Logout</a></li>
            `;
        } else {
            navHtml = `
                <li><a href="index.html#how-it-works">How it Works</a></li>
                <li><a href="index.html#about">About</a></li>
                <li><a href="dashboard.html">Dashboard</a></li>
                <li class="mobile-only"><a href="#" onclick="logout()">Logout</a></li>
            `;
        }

        if (navAuth) {
            navAuth.innerHTML = `
                <a href="profile.html" class="profile-icon" title="My Profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </a>
            `;
        }
    } else {
        // Guest State
        navHtml = `
            <li><a href="index.html#how-it-works">How it Works</a></li>
            <li><a href="index.html#about">About</a></li>
            <li><a href="contact.html">Contact</a></li>
        `;
        if (navAuth) {
            navAuth.innerHTML = `<a href="login.html" class="btn-signin">Sign In</a>`;
        }
    }

    navLinks.innerHTML = navHtml;

    // Highlight active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.querySelectorAll('a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href.startsWith('index.html#'))) {
            a.classList.add('active');
        }
    });
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    window.location.replace('login.html');
}
