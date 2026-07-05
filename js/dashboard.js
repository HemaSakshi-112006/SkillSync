// ===== Sidebar Toggle =====
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

sidebarToggle.addEventListener('click', () => sidebar.classList.add('active'));
sidebarClose.addEventListener('click', () => sidebar.classList.remove('active'));

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// ===== Search functionality =====
const dashSearch = document.getElementById('dashSearch');
dashSearch.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // Filter deadline items as a demo
    document.querySelectorAll('.deadline-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
});

// ===== Notification Button =====
document.getElementById('notifBtn').addEventListener('click', () => {
    alert('You have 5 new notifications!');
});
