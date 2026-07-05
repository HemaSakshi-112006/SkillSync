// ===== Toggle Login/Register =====
function showRegister(e) {
    e.preventDefault();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}
function showLogin(e) {
    e.preventDefault();
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Check URL hash on load
if (window.location.hash === '#register') {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// ===== Toggle Password Visibility =====
function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ===== Form Handlers (Dummy) =====
function handleLogin(e) {
    e.preventDefault();
    // Redirect to dashboard as dummy action
    window.location.href = 'dashboard.html';
}
function handleRegister(e) {
    e.preventDefault();
    window.location.href = 'dashboard.html';
}
