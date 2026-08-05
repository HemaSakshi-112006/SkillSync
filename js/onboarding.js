/**
 * SkillSync Onboarding JavaScript
 * Handles multi-step flow, chips, validation, autosave & data collection
 */

// ============================================================
// STATE
// ============================================================
const TOTAL_STEPS = 7;       // welcome & complete are not counted
let currentStep = 0;          // 0 = welcome, 1-7 = steps, 8 = complete
let onboardingData = {};

// ============================================================
// STEP LABELS (for progress bar)
// ============================================================
const STEP_LABELS = [
    'Profile',
    'Academic',
    'Skills',
    'Interests',
    'Collaboration',
    'Portfolio',
    'AI Setup'
];

// ============================================================
// DOM REFS
// ============================================================
const allCards = () => document.querySelectorAll('.ob-card');
const progressFill = document.getElementById('progressFill');
const progressContainer = document.getElementById('progressContainer');
const stepLabel = document.getElementById('stepLabel');
const stepCounter = document.getElementById('stepCounter');
const dots = document.querySelectorAll('.progress-step-dot');
const autosaveToast = document.getElementById('autosaveToast');

// ============================================================
// NAVIGATION
// ============================================================
function showStep(step) {
    currentStep = step;
    allCards().forEach(c => c.classList.remove('active'));
    const target = document.querySelector(`[data-step="${step}"]`);
    if (target) target.classList.add('active');

    // Progress bar
    if (step === 0) {
        progressContainer.style.display = 'none';
    } else if (step >= 1 && step <= TOTAL_STEPS) {
        progressContainer.style.display = 'block';
        const pct = Math.round(((step - 1) / TOTAL_STEPS) * 100);
        progressFill.style.width = pct + '%';
        stepLabel.textContent = STEP_LABELS[step - 1];
        stepCounter.textContent = `Step ${step} of ${TOTAL_STEPS}`;
        dots.forEach((d, i) => {
            d.classList.remove('done', 'active');
            if (i + 1 < step) d.classList.add('done');
            else if (i + 1 === step) d.classList.add('active');
        });
    } else {
        // Complete screen
        progressContainer.style.display = 'none';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Back/Next helpers
function nextStep() {
    if (currentStep < TOTAL_STEPS + 1) showStep(currentStep + 1);
}
function prevStep() {
    if (currentStep > 0) showStep(currentStep - 1);
}

// ============================================================
// CHIP SELECTOR
// ============================================================
function initChips() {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('selected');
            triggerAutosave();
        });
    });
}

function getSelectedChips(containerSelector) {
    return [...document.querySelectorAll(`${containerSelector} .chip.selected`)]
        .map(c => c.dataset.value);
}

// ============================================================
// RADIO GROUPS
// ============================================================
function initRadios() {
    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.addEventListener('click', () => {
            const group = opt.dataset.group;
            document.querySelectorAll(`.radio-option[data-group="${group}"]`)
                .forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            triggerAutosave();
        });
    });
}

function getSelectedRadio(group) {
    const sel = document.querySelector(`.radio-option[data-group="${group}"].selected`);
    return sel ? sel.dataset.value : null;
}

// ============================================================
// CHECKBOX GROUPS (AI Preferences)
// ============================================================
function initCheckboxes() {
    document.querySelectorAll('.checkbox-option').forEach(opt => {
        opt.addEventListener('click', () => {
            opt.classList.toggle('checked');
            triggerAutosave();
        });
    });
}

function getCheckedBoxes(containerSelector) {
    return [...document.querySelectorAll(`${containerSelector} .checkbox-option.checked`)]
        .map(c => c.dataset.value);
}

// ============================================================
// AVATAR UPLOAD
// ============================================================
function initAvatarUpload() {
    const avatarInput = document.getElementById('avatarFileInput');
    const avatarPreview = document.getElementById('avatarPreview');
    const avatarInitials = document.getElementById('avatarInitials');

    if (!avatarInput) return;

    document.getElementById('avatarUploadBtn').addEventListener('click', () => avatarInput.click());
    avatarPreview.addEventListener('click', () => avatarInput.click());

    avatarInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            showError('Avatar file must be under 5MB.');
            return;
        }
        const reader = new FileReader();

reader.onload = (ev) => {
    avatarInitials.style.display = 'none';

    const img = avatarPreview.querySelector('img') || document.createElement('img');
    img.src = ev.target.result;

    if (!avatarPreview.contains(img)) {
        avatarPreview.appendChild(img);
    }

    // Keep the preview
    onboardingData.profileImage = ev.target.result;

    // Keep the actual file for Cloudinary upload
    onboardingData.profileImageFile = file;
};

reader.readAsDataURL(file);
    });

    // Update initials from fullName field
    const fullNameField = document.getElementById('obFullName');
    if (fullNameField) {
        fullNameField.addEventListener('input', () => {
            const name = fullNameField.value.trim();
            if (name) {
                avatarInitials.textContent = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            }
        });
    }
}

// ============================================================
// RESUME UPLOAD
// ============================================================
function initResumeUpload() {
    const resumeInput = document.getElementById('resumeFileInput');
    const resumeZone = document.getElementById('resumeDropZone');
    const resumeFileName = document.getElementById('resumeFileName');
    const resumeNameText = document.getElementById('resumeNameText');

    if (!resumeInput) return;

    resumeZone.addEventListener('click', () => resumeInput.click());
    resumeZone.addEventListener('dragover', e => { e.preventDefault(); resumeZone.classList.add('dragover'); });
    resumeZone.addEventListener('dragleave', () => resumeZone.classList.remove('dragover'));
    resumeZone.addEventListener('drop', e => {
        e.preventDefault();
        resumeZone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) handleResume(file);
    });

    resumeInput.addEventListener('change', e => {
        if (e.target.files[0]) handleResume(e.target.files[0]);
    });

    function handleResume(file) {
        const allowed = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowed.includes(file.type)) {
            showError('Please upload a PDF or Word document.');
            return;
        }
        resumeNameText.textContent = file.name;
        resumeFileName.classList.add('visible');
        onboardingData.resume = file.name; // store name; actual upload to backend later
    }
}

// ============================================================
// AUTOSAVE
// ============================================================
let autosaveTimer;
function triggerAutosave() {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
        collectCurrentStepData();
        localStorage.setItem('skillsync_onboarding', JSON.stringify({ step: currentStep, data: onboardingData }));
        flashAutosave();
    }, 800);
}

function flashAutosave() {
    autosaveToast.classList.add('show');
    setTimeout(() => autosaveToast.classList.remove('show'), 2000);
}

// Restore previously saved progress
function restoreSavedProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem('skillsync_onboarding'));
        if (!saved) return;
        onboardingData = saved.data || {};
        // Only restore if we're resuming (saved step > 0) — but always start fresh from welcome
    } catch (_) {}
}

// ============================================================
// DATA COLLECTION  (called before going to next step)
// ============================================================
function collectCurrentStepData() {
    switch (currentStep) {
        case 1: collectStep1(); break;
        case 2: collectStep2(); break;
        case 3: collectStep3(); break;
        case 4: collectStep4(); break;
        case 5: collectStep5(); break;
        case 6: collectStep6(); break;
        case 7: collectStep7(); break;
    }
}

function v(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function collectStep1() {
    onboardingData.fullName   = v('obFullName');
    onboardingData.username   = v('obUsername');
    onboardingData.gender     = v('obGender');
    onboardingData.dateOfBirth = v('obDOB');
    onboardingData.phoneNumber = v('obPhone');
    onboardingData.location   = v('obLocation');
    onboardingData.bio        = v('obBio');
}

function collectStep2() {
    onboardingData.college        = v('obCollege');
    onboardingData.degree         = v('obDegree');
    onboardingData.branch         = v('obBranch');
    onboardingData.semester       = parseInt(v('obSemester')) || null;
    onboardingData.section        = v('obSection');
    onboardingData.usn            = v('obUSN');
    onboardingData.graduationYear = parseInt(v('obGradYear')) || null;
    onboardingData.cgpa           = parseFloat(v('obCGPA')) || null;
}

function collectStep3() {
    onboardingData.skills = [
        ...getSelectedChips('#chips-programming'),
        ...getSelectedChips('#chips-web'),
        ...getSelectedChips('#chips-ai'),
        ...getSelectedChips('#chips-mobile'),
        ...getSelectedChips('#chips-cloud'),
    ];
}

function collectStep4() {
    onboardingData.interests       = getSelectedChips('#chips-interests');
    onboardingData.preferredDomains = getSelectedChips('#chips-domains');
    onboardingData.preferredRoles  = getSelectedChips('#chips-roles');
    onboardingData.careerGoals     = getSelectedChips('#chips-goals');
    onboardingData.projectTypes    = getSelectedChips('#chips-project-types');
    onboardingData.experienceLevel = getSelectedRadio('experience');
}

function collectStep5() {
    onboardingData.lookingForTeam   = getSelectedRadio('lookingForTeam') === 'yes';
    onboardingData.preferredTeamSize = getSelectedRadio('teamSize');
    onboardingData.availability     = getSelectedRadio('availability');
    onboardingData.workingStyle     = getSelectedRadio('workingStyle');
    onboardingData.languages        = getSelectedChips('#chips-languages');
}

function collectStep6() {
    onboardingData.github    = v('obGithub');
    onboardingData.linkedin  = v('obLinkedin');
    onboardingData.portfolio = v('obPortfolio');
    onboardingData.leetcode  = v('obLeetcode');
    onboardingData.codechef  = v('obCodechef');
    onboardingData.hackerrank = v('obHackerrank');
    onboardingData.codeforces = v('obCodeforces');
}

function collectStep7() {
    const aiPrefs = getCheckedBoxes('#ai-prefs-container');
    onboardingData.aiFeatures    = aiPrefs;
    onboardingData.aiTone        = getSelectedRadio('aiTone');
    onboardingData.isProfileCompleted = true;
}

// ============================================================
// VALIDATION
// ============================================================
function validateStep(step) {
    if (step === 1) {
        const name = v('obFullName');
        if (!name) { showError('Full name is required.'); return false; }
        const username = v('obUsername');
        if (!username) { showError('Username is required.'); return false; }
        if (username.length < 3) { showError('Username must be at least 3 characters.'); return false; }
    }
    if (step === 3) {
        const skills = [
            ...getSelectedChips('#chips-programming'),
            ...getSelectedChips('#chips-web'),
            ...getSelectedChips('#chips-ai'),
            ...getSelectedChips('#chips-mobile'),
            ...getSelectedChips('#chips-cloud'),
        ];
        if (skills.length === 0) { showError('Please select at least one skill.'); return false; }
    }
    return true;
}

function showError(msg) {
    const existing = document.querySelector('.ob-error-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'ob-error-toast autosave-toast';
    toast.style.background = 'rgba(244,63,94,0.15)';
    toast.style.borderColor = 'rgba(244,63,94,0.3)';
    toast.style.color = '#f43f5e';
    toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ============================================================
// SUBMIT TO BACKEND  (placeholder — connect to your API)
// ============================================================
async function submitOnboarding() {
    collectCurrentStepData();
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    try {
        console.log("FINAL ONBOARDING DATA:", onboardingData);

        const formData = new FormData();

Object.entries(onboardingData).forEach(([key, value]) => {
    if (
    key !== "profileImage" &&
    key !== "profileImageFile" &&
    key !== "resume"
) {
        if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, value ?? "");
        }
    }
});
   if (onboardingData.profileImageFile) {
     formData.append(
        "profileImage",
        onboardingData.profileImageFile
      );
 } 
        
       const res = await fetch(`${BASE_URL}/user/onboarding`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(onboardingData)
        });
        const json = await res.json();
        if (json.user) {
            // Update local storage
            localStorage.setItem('user', JSON.stringify(json.user));
        }
        // Clear onboarding cache
        localStorage.removeItem('skillsync_onboarding');
    } catch (err) {
        console.warn('Backend not connected yet — saving locally.', err);
        // Still proceed to complete screen in dev/demo mode
    }

    showStep(8); // Complete screen
}

// ============================================================
// BUTTON EVENT BINDINGS
// ============================================================
function bindButtons() {
    // Welcome → Step 1
    document.getElementById('btnGetStarted').addEventListener('click', () => showStep(1));

    // Step back buttons
    document.querySelectorAll('[data-action="back"]').forEach(btn => {
        btn.addEventListener('click', () => prevStep());
    });

    // Step next buttons (with validation)
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                collectCurrentStepData();
                triggerAutosave();
                nextStep();
            }
        });
    });

    // Skip buttons
    document.querySelectorAll('[data-action="skip"]').forEach(btn => {
        btn.addEventListener('click', () => nextStep());
    });

    // Final submit
    const btnFinish = document.getElementById('btnFinish');
    if (btnFinish) btnFinish.addEventListener('click', submitOnboarding);

    // Auto-save on all inputs
    document.querySelectorAll('.ob-input, .ob-textarea, .ob-select').forEach(el => {
        el.addEventListener('input', triggerAutosave);
    });
}

// ============================================================
// PRE-FILL from user data if already logged in
// ============================================================
function prefillFromStorage() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        const user = JSON.parse(userStr);

        const fn = document.getElementById('obFullName');
        const un = document.getElementById('obUsername');
        const welcomeUserName = document.getElementById('welcomeUserName');

        if (fn && user.fullName) fn.value = user.fullName;
        if (un && user.username) un.value = user.username;
        if (welcomeUserName && user.fullName) {
            welcomeUserName.textContent = user.fullName.split(' ')[0];
        }

        // Avatar initials
        const avatarInitials = document.getElementById('avatarInitials');
        if (avatarInitials && user.fullName) {
            avatarInitials.textContent = user.fullName.split(' ')
                .map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
    } catch (_) {}
}

// ============================================================
// AUTH GUARD
// ============================================================
function authGuard() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    authGuard();
    restoreSavedProgress();
    prefillFromStorage();
    initChips();
    initRadios();
    initCheckboxes();
    initAvatarUpload();
    initResumeUpload();
    bindButtons();
    showStep(0); // Start at welcome
});
