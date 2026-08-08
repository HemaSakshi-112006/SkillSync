console.log("Landing Page JS Loaded");

// ===== Theme Toggle (Dark/Light Mode) =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
        // Default to light for this design if no preference, but can check OS
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
const navActions = document.getElementById('navActions');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        if (navLinks) navLinks.classList.toggle('active');
        if (navActions) navActions.classList.toggle('active');
    });
}

// ===== Intersection Observer for Scroll Animations =====
const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Unobserve after animating in once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-section').forEach(section => {
    observer.observe(section);
});

// ===== Smooth Scroll for Nav Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Close mobile menu if open
            if (mobileToggle && mobileToggle.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                if (navLinks) navLinks.classList.remove('active');
                if (navActions) navActions.classList.remove('active');
            }
        }
    });
});
const token = localStorage.getItem("token");
if (token) {
    const authActions = document.getElementById("authActions");
    if (authActions) {
        let fullName = 'User';
        let email = 'user@example.com';
        
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                fullName = userObj.fullName || userObj.name || fullName;
                email = userObj.email || userObj.username || email;
            } else {
                const token = localStorage.getItem('token');
                if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    fullName = payload.fullName || payload.name || fullName;
                    email = payload.email || payload.username || email;
                }
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }

        const getInitials = (name) => {
            if (!name) return 'U';
            return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        };
        const initials = getInitials(fullName);

        authActions.innerHTML = `
            <a href="dashboard.html" class="btn btn-ghost" style="margin-right: 8px;">Dashboard</a>
            <div class="profile-dropdown-container">
                <div class="user-menu" id="userMenuBtn">
                    <div class="user-avatar">${initials}</div>
                    <i class="fas fa-chevron-down dropdown-icon" style="color:var(--color-text)"></i>
                </div>
                
                <div class="profile-dropdown-menu" id="profileDropdown" style="text-align: left;">
                    <div class="dropdown-header">
                        <div class="dropdown-avatar">${initials}</div>
                        <div class="dropdown-user-details">
                            <span class="dropdown-name" style="color:#fff;">${fullName}</span>
                            <span class="dropdown-username">${email}</span>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="profile.html" class="dropdown-item"><i class="fas fa-user"></i> My Profile</a>
                    <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                    <a href="dashboard.html" class="dropdown-item"><i class="fas fa-th-large"></i> Dashboard</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item logout" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            </div>
        `;

        // Profile Dropdown logic
        const userMenuBtn = document.getElementById('userMenuBtn');
        const profileDropdown = document.getElementById('profileDropdown');

        if (userMenuBtn && profileDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userMenuBtn.classList.toggle('active');
                profileDropdown.classList.toggle('show');
            });

            document.addEventListener('click', (e) => {
                if (!profileDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                    userMenuBtn.classList.remove('active');
                    profileDropdown.classList.remove('show');
                }
            });
        }
        
        // Logout logic
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.reload();
            });
        }
    }
    
    // Also update the main Call To Action button
    const ctaStart = document.getElementById('hero-cta-start');
    if (ctaStart) {
        ctaStart.href = "dashboard.html";
        ctaStart.innerHTML = `Go to Dashboard <i class="fas fa-arrow-right"></i>`;
    }
}
