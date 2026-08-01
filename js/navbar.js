class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const currentPath = window.location.pathname;
        const isActive = (path) => currentPath.includes(path) ? 'active' : '';
        const isDashboard = currentPath.endsWith('/') || isActive('dashboard.html');

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

        this.innerHTML = `
        <header class="topbar">
            <div class="topbar-left">
                <a href="index.html" class="topbar-logo">
                    <div class="logo-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                        </svg>
                    </div>
                    <span class="logo-text">Skill<span class="logo-highlight">Sync</span></span>
                </a>
            </div>
            
            <nav class="topbar-nav">
                <a href="index.html" class="nav-item">Home</a>
                <a href="dashboard.html" class="nav-item ${isDashboard ? 'active' : ''}">Dashboard</a>
                <a href="explore.html" class="nav-item ${isActive('explore.html')}">My Projects</a>
                <a href="#" class="nav-item">Calendar</a>
                <a href="#" class="nav-item">AI Assistant</a>
            </nav>

            <div class="topbar-right">
                <button class="topbar-btn" id="notifBtn" aria-label="Notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notif-dot"></span>
                </button>
                
                <div class="profile-dropdown-container">
                    <div class="user-menu" id="userMenuBtn">
                        <div class="user-avatar">${initials}</div>
                        <div class="user-info">
                            <span class="user-name">${fullName}</span>
                        </div>
                        <i class="fas fa-chevron-down dropdown-icon"></i>
                    </div>
                    
                    <div class="profile-dropdown-menu" id="profileDropdown">
                        <div class="dropdown-header">
                            <div class="dropdown-avatar">${initials}</div>
                            <div class="dropdown-user-details">
                                <span class="dropdown-name">${fullName}</span>
                                <span class="dropdown-username">${email}</span>
                            </div>
                        </div>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item"><i class="fas fa-user"></i> My Profile</a>
                        <a href="#" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                        <a href="#" class="dropdown-item"><i class="fas fa-question-circle"></i> Help & Support</a>
                        <div class="dropdown-divider"></div>
                        <a href="index.html" class="dropdown-item logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
            </div>
        </header>
        `;

        this.initScripts();
    }

    initScripts() {
        // Notifications toggle
        const notifBtn = this.querySelector('#notifBtn');
        if (notifBtn) {
            notifBtn.addEventListener('click', () => {
                alert('You have 5 new notifications!');
            });
        }

        // Profile Dropdown logic
        const userMenuBtn = this.querySelector('#userMenuBtn');
        const profileDropdown = this.querySelector('#profileDropdown');

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

        const logoutBtn = this.querySelector('.logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });
        }
    }
}

// Define the custom element
customElements.define('app-navbar', AppNavbar);
