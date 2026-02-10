window.addEventListener('pageshow', (event) => {
    // If we're coming from history (back/forward), re-initialize to check auth state
    initNavbar();
});

function initNavbar() {
    const userString = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    let user = null;

    try {
        if (userString) user = JSON.parse(userString);
    } catch (e) {
        console.error("Error parsing user data");
    }

    // Normalize path for robust matching (handles case-sensitivity, clean URLs, and trailing slashes)
    const path = window.location.pathname.toLowerCase();
    const filename = path.split('/').pop() || 'index';
    const cleanName = filename.replace('.html', '');

    // List of pages with their canonical "clean" names
    const publicOnlyPages = ['login', 'register-sponsor', 'register-creator'];
    const protectedPages = ['dashboard', 'profile', 'edit-profile', 'discover'];

    const isPublicOnly = publicOnlyPages.includes(cleanName);
    const isProtected = protectedPages.includes(cleanName);

    // 1. Redirection Logic (Check token and basic user structure)
    const isAuthenticated = user && token && (user.email || user.id);

    if (isAuthenticated) {
        if (isPublicOnly) {
            window.location.replace('dashboard.html');
            return;
        }
    } else {
        if (isProtected) {
            window.location.replace('login.html?message=auth_required');
            return;
        }
    }

    // 2. Update Navbar UI
    updateNavbarUI(user);

    // 3. Update Hero CTAs (if on landing page)
    updateHeroCTAs(user);

    // 4. Dynamic Logo Redirection
    const logoLinks = document.querySelectorAll('#logo-link');
    logoLinks.forEach(link => {
        link.href = isAuthenticated ? 'dashboard.html' : 'index.html';
    });
}

function updateHeroCTAs(user) {
    if (!user) return;

    const heroCtas = document.querySelector('.hero-ctas');
    const finalCtas = document.querySelector('.cta-buttons');

    const authenticatedBtns = `
        <a href="dashboard.html" class="btn btn-primary">Go to Dashboard</a>
    `;

    if (heroCtas) heroCtas.innerHTML = authenticatedBtns;
    if (finalCtas) finalCtas.innerHTML = authenticatedBtns;
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
                            <span class="avatar-initials">${user.firstName[0]}</span>
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
                        Logout
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

// Ensure navbar initializes on DOM load and script load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}
