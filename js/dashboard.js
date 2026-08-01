// ===== Sidebar Toggle =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.add('active'));
}

if (sidebarClose && sidebar) {
    sidebarClose.addEventListener('click', () => sidebar.classList.remove('active'));
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (sidebar && sidebarToggle && window.innerWidth <= 1024 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// ===== Search functionality =====
const dashSearch = document.getElementById('dashSearch');
if (dashSearch) {
    dashSearch.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // Filter deadline items as a demo
        document.querySelectorAll('.deadline-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query) ? 'flex' : 'none';
        });
    });
}

// ===== Dynamic Welcome Name =====
const welcomeName = document.getElementById('welcomeName');
if (welcomeName) {
    let firstName = 'User'; // Fallback
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const userObj = JSON.parse(userStr);
            const fullName = userObj.fullName || userObj.name || firstName;
            firstName = fullName.split(' ')[0];
        } else {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const fullName = payload.fullName || payload.name || firstName;
                firstName = fullName.split(' ')[0];
            }
        }
    } catch (e) {
        console.error('Error parsing user for dashboard', e);
    }
    welcomeName.textContent = firstName;
}
