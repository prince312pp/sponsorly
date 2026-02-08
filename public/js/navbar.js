document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
});

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    const user = JSON.parse(localStorage.getItem('user'));

    // 1. Update Navbar based on Auth State
    updateNavbarUI(user);

    // 3. Dynamic Logo Redirection
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                // For logged in users, clicking logo takes them to dashboard
                e.preventDefault();
                if (window.location.pathname.includes('dashboard.html')) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                // For guests, clicking logo takes them to index.html
                if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('sposnsorly/')) {
                    // Stay on page and scroll to top if already on index
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    e.preventDefault();
                    window.location.href = 'index.html';
                }
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
        // Authenticated State (consistent across all pages)
        navHtml = `
            <li><a href="dashboard.html">Dashboard</a></li>
            <li><a href="discover.html">Discover</a></li>
        `;

        if (navAuth) {
            navAuth.innerHTML = `
                <div class="nav-auth-group">
                    <div class="profile-dropdown">
                        <button class="profile-icon" id="profile-toggle" title="User Menu">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                        <div class="dropdown-menu" id="dropdown-menu">
                            <div class="dropdown-header">
                                <span class="user-name">${user.firstName} ${user.lastName}</span>
                                <span class="user-email">${user.email}</span>
                            </div>
                            <div class="dropdown-divider"></div>
                            <a href="profile.html">My Profile</a>
                            <a href="edit-profile.html">Edit Profile</a>
                            <div class="dropdown-divider"></div>
                            <a href="#" onclick="logout()" class="logout-link">Logout</a>
                        </div>
                    </div>
                    <a href="#" onclick="logout()" class="btn-logout-main" title="Logout">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span class="desktop-only">Logout</span>
                    </a>
                </div>
            `;

            // Add toggle logic
            const toggle = document.getElementById('profile-toggle');
            const menu = document.getElementById('dropdown-menu');
            if (toggle && menu) {
                toggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    menu.classList.toggle('active');
                });

                document.addEventListener('click', () => {
                    menu.classList.remove('active');
                });
            }
        }
    } else {
        // Guest State
        navHtml = `
            <li><a href="index.html#how-it-works">How it Works</a></li>
            <li><a href="discover.html">Discover</a></li>
            <li class="mobile-only"><a href="login.html">Dashboard</a></li>
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
