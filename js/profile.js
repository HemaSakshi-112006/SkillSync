/**
 * SkillSync Profile Page JavaScript
 * Mirrors the complete onboarding data collection system with interactive edit mode,
 * onboarding chip selectors, radio options, dropdowns, checkbox grids, and photo uploads.
 */

// ============================================================
// DEFAULT MOCK PROFILE DATA (matching onboarding structure)
// ============================================================
const DEFAULT_PROFILE_DATA = {
    // Personal Profile (Step 1)
    fullName: "Ria Jain",
    username: "ria_smart",
    email: "ria.jain@example.com",
    gender: "Female",
    dateOfBirth: "2003-05-14",
    phoneNumber: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    bio: "Passionate AI & Data Science student builder | Full-stack enthusiast | Building next-gen AI tools for student collaboration.",
    
    // Banner & Avatar
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    
    // Academic Profile (Step 2)
    college: "PES University, Bengaluru",
    degree: "B.Tech",
    branch: "Artificial Intelligence & Data Science",
    semester: "4",
    section: "B",
    usn: "1PE22AI042",
    graduationYear: "2026",
    cgpa: "9.2",
    
    // Skills (Step 3 - Categorized)
    skills: ["Python", "Java", "JavaScript", "React", "Node.js", "Express", "MongoDB", "PyTorch", "Flutter", "Azure", "Git"],
    
    // Interests & Goals (Step 4)
    interests: ["Artificial Intelligence", "Machine Learning", "Web Development", "Cloud", "UI/UX"],
    preferredDomains: ["Education", "Automation", "E-commerce"],
    preferredRoles: ["Frontend", "Full Stack", "AI Engineer"],
    careerGoals: ["Build Portfolio", "Get Internship", "Open Source"],
    projectTypes: ["AI/ML Projects", "Web Development", "Startup Ideas"],
    experienceLevel: "Intermediate",
    
    // Collaboration Preferences (Step 5)
    lookingForTeam: true,
    preferredTeamSize: "4",
    availability: "10 hrs/week",
    workingStyle: "Evening",
    languages: ["English", "Hindi", "Kannada"],
    
    // Portfolio & Social Links (Step 6)
    github: "https://github.com/riajain-dev",
    linkedin: "https://linkedin.com/in/ria-jain-dev",
    portfolio: "https://riajain.dev",
    leetcode: "ria_smart",
    codechef: "ria_jain",
    hackerrank: "ria_jain",
    codeforces: "ria_smart",
    
    // AI Preferences (Step 7)
    aiTone: "Professional",
    aiFeatures: [
        "projectRecommendations",
        "teammateRecommendations",
        "featureSuggestions",
        "taskBreakdown",
        "learningRoadmap",
        "learningRecommendations",
        "resumeSuggestions",
        "portfolioReview"
    ],
    
    // Resume Details
    resume: {
        name: "Ria_Jain_Resume.pdf",
        size: "1.2 MB",
        updatedAt: "2026-07-28",
        url: "#"
    },
    
    isProfileCompleted: true
};

// ============================================================
// ONBOARDING MASTER CONSTANTS FOR CHIPS & RADIOS
// ============================================================

const SKILLS_CATEGORIES = [
    {
        title: "Programming Languages",
        items: ["Python", "Java", "C++", "C", "JavaScript", "TypeScript", "C#", "PHP", "Go", "Rust", "Kotlin", "Swift"]
    },
    {
        title: "Web Development",
        items: ["HTML", "CSS", "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "MongoDB", "MySQL", "PostgreSQL", "GraphQL"]
    },
    {
        title: "AI / ML",
        items: ["TensorFlow", "PyTorch", "OpenCV", "Scikit-Learn", "NLP", "Computer Vision", "LangChain", "Hugging Face"]
    },
    {
        title: "Mobile Development",
        items: ["Android", "Flutter", "React Native", "iOS"]
    },
    {
        title: "Cloud & DevOps",
        items: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Firebase", "Git", "Linux", "CI/CD"]
    }
];

const ONBOARDING_INTERESTS = [
    "Artificial Intelligence", "Machine Learning", "Web Development", "Android", "IoT", 
    "Cloud", "Cyber Security", "Blockchain", "Game Development", "Data Science", 
    "AR/VR", "DevOps", "UI/UX", "Robotics"
];

const ONBOARDING_DOMAINS = [
    "Healthcare", "Education", "Finance", "Agriculture", "E-commerce", 
    "Automation", "Entertainment", "Smart Cities", "Government"
];

const ONBOARDING_ROLES = [
    "Frontend", "Backend", "Full Stack", "AI Engineer", "ML Engineer", 
    "Data Scientist", "Android Dev", "Cloud Engineer", "DevOps", "UI Designer", "Project Manager"
];

const ONBOARDING_GOALS = [
    "Get Internship", "Build Portfolio", "Hackathons", "Research", 
    "Higher Studies", "Open Source", "Startup", "Freelancing"
];

const ONBOARDING_PROJECT_TYPES = [
    "AI/ML Projects", "Web Development", "Mobile Apps", "Cloud Computing", "IoT Projects", 
    "Cybersecurity", "Data Science", "Game Development", "E-commerce", 
    "College Mini Projects", "Hackathon Projects", "Startup Ideas", "Research Projects"
];

const ONBOARDING_LANGUAGES = [
    "English", "Hindi", "Kannada", "Tamil", "Telugu", "Malayalam", "Marathi", "Bengali", "Others"
];

const ONBOARDING_AI_FEATURES = [
    { key: "projectRecommendations", label: "Recommend Projects" },
    { key: "teammateRecommendations", label: "Recommend Team Members" },
    { key: "featureSuggestions", label: "Suggest Features" },
    { key: "taskBreakdown", label: "Generate Task Breakdown" },
    { key: "learningRoadmap", label: "Weekly Roadmap" },
    { key: "learningRecommendations", label: "Learning Recommendations" },
    { key: "resumeSuggestions", label: "Resume Feedback" },
    { key: "portfolioReview", label: "Portfolio Review" },
    { key: "codingResources", label: "Coding Resources" }
];

// State
let profileData = {};
let draftData = {};
let isEditing = false;

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    loadProfileData();
    initFileUploadHandlers();
    initSidebarScrollSpy();
    renderProfile();
});

function loadProfileData() {
    try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            profileData = { ...DEFAULT_PROFILE_DATA, ...parsed };
        } else {
            profileData = { ...DEFAULT_PROFILE_DATA };
        }
    } catch (e) {
        console.error("Error loading profile data:", e);
        profileData = { ...DEFAULT_PROFILE_DATA };
    }
}

function saveProfileToStorage() {
    try {
        localStorage.setItem("user", JSON.stringify(profileData));
    } catch (e) {
        console.error("Error saving profile to localStorage:", e);
    }
}

// ============================================================
// EDIT / SAVE / CANCEL CONTROLLER
// ============================================================
function enableEditMode() {
    isEditing = true;
    draftData = JSON.parse(JSON.stringify(profileData));
    renderProfile();
    showFloatingSaveBar(true);
}

function cancelEditMode() {
    isEditing = false;
    draftData = {};
    renderProfile();
    showFloatingSaveBar(false);
}

function saveProfile() {
    // Validate required fields
    const fnInput = document.getElementById("edit-fullName");
    const unInput = document.getElementById("edit-username");
    
    if (fnInput && !fnInput.value.trim()) {
        showToast("Full name is required", "warning");
        return;
    }
    if (unInput && !unInput.value.trim()) {
        showToast("Username is required", "warning");
        return;
    }

    // Collect current values from text/select inputs
    collectFormInputs();

    // Save
    profileData = JSON.parse(JSON.stringify(draftData));
    saveProfileToStorage();

    isEditing = false;
    showFloatingSaveBar(false);
    renderProfile();

    showToast("Profile updated successfully!", "success");
}

function collectFormInputs() {
    if (!isEditing) return;

    const val = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : "";
    };

    draftData.fullName = val("edit-fullName") || draftData.fullName;
    draftData.username = val("edit-username") || draftData.username;
    draftData.email = val("edit-email") || draftData.email;
    draftData.gender = val("edit-gender");
    draftData.dateOfBirth = val("edit-dateOfBirth");
    draftData.phoneNumber = val("edit-phoneNumber");
    draftData.location = val("edit-location");
    draftData.bio = val("edit-bio");

    draftData.college = val("edit-college");
    draftData.degree = val("edit-degree");
    draftData.branch = val("edit-branch");
    draftData.semester = val("edit-semester");
    draftData.section = val("edit-section");
    draftData.usn = val("edit-usn");
    draftData.graduationYear = val("edit-graduationYear");
    draftData.cgpa = val("edit-cgpa");

    draftData.github = val("edit-github");
    draftData.linkedin = val("edit-linkedin");
    draftData.portfolio = val("edit-portfolio");
    draftData.leetcode = val("edit-leetcode");
    draftData.codechef = val("edit-codechef");
    draftData.hackerrank = val("edit-hackerrank");
    draftData.codeforces = val("edit-codeforces");
    draftData.aiTone = val("edit-aiTone");
}

// ============================================================
// MAIN RENDERER
// ============================================================
function renderProfile() {
    const data = isEditing ? draftData : profileData;

    renderHeader(data);
    renderPersonalInfo(data);
    renderAcademicInfo(data);
    renderSkills(data);
    renderCodingProfiles(data);
    renderInterests(data);
    renderExperienceLevel(data);
    renderProjectPreferences(data);
    renderCareerGoals(data);
    renderAvailability(data);
    renderAiPreferences(data);
    renderLanguages(data);
    renderResumeSection(data);
}

// ============================================================
// INDIVIDUAL SECTION RENDERERS
// ============================================================

/* 1. Header Card */
function renderHeader(data) {
    const bannerEl = document.getElementById("profileBanner");
    const avatarImgEl = document.getElementById("avatarImg");
    const avatarPlaceholder = document.getElementById("avatarPlaceholder");
    const fullNameEl = document.getElementById("displayFullName");
    const usernameEl = document.getElementById("displayUsername");
    const bioEl = document.getElementById("displayBio");
    const collegeLocEl = document.getElementById("displayCollegeLoc");
    const resumePillEl = document.getElementById("displayResumePill");
    const headerActions = document.getElementById("headerActions");
    const avatarContainer = document.querySelector(".avatar-container");

    if (bannerEl) bannerEl.style.backgroundImage = `url('${data.bannerImage}')`;

    if (data.profileImage) {
        avatarImgEl.src = data.profileImage;
        avatarImgEl.style.display = "block";
        if (avatarPlaceholder) avatarPlaceholder.style.display = "none";
    } else {
        avatarImgEl.style.display = "none";
        if (avatarPlaceholder) {
            avatarPlaceholder.style.display = "flex";
            const initials = data.fullName ? data.fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "U";
            avatarPlaceholder.textContent = initials;
        }
    }

    if (fullNameEl) fullNameEl.textContent = data.fullName || "User";
    if (usernameEl) usernameEl.textContent = data.username ? (data.username.startsWith("@") ? data.username : `@${data.username}`) : "@username";
    if (bioEl) bioEl.textContent = data.bio || "No bio added yet.";

    if (collegeLocEl) {
        const parts = [data.college, data.location].filter(Boolean);
        collegeLocEl.textContent = parts.length > 0 ? parts.join(" • ") : "Student Developer";
    }

    if (resumePillEl && data.resume) {
        resumePillEl.innerHTML = `<i class="fas fa-file-pdf"></i> ${data.resume.name || "Resume.pdf"}`;
    }

    if (headerActions) {
        if (isEditing) {
            headerActions.innerHTML = `
                <div class="edit-mode-controls">
                    <button class="btn btn-secondary btn-ghost" onclick="cancelEditMode()"><i class="fas fa-times"></i> Cancel</button>
                    <button class="btn btn-success" onclick="saveProfile()"><i class="fas fa-check"></i> Save Changes</button>
                </div>
            `;
        } else {
            headerActions.innerHTML = `
                <button class="btn btn-primary" onclick="enableEditMode()"><i class="fas fa-pen"></i> Edit Profile</button>
            `;
        }
    }

    const bannerEditBtn = document.getElementById("bannerEditBtn");
    const avatarEditOverlay = document.getElementById("avatarEditOverlay");
    if (bannerEditBtn) bannerEditBtn.style.display = isEditing ? "inline-flex" : "none";
    if (avatarEditOverlay) avatarEditOverlay.style.display = isEditing ? "flex" : "none";
    if (avatarContainer) {
        if (isEditing) avatarContainer.classList.add("editing");
        else avatarContainer.classList.remove("editing");
    }
}

/* 2. Personal Profile (Step 1) */
function renderPersonalInfo(data) {
    const container = document.getElementById("personalInfoContent");
    if (!container) return;

    if (!isEditing) {
        container.innerHTML = `
            <div class="fields-grid">
                <div class="field-group">
                    <span class="field-label">Full Name</span>
                    <div class="field-value">${escapeHtml(data.fullName)}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Username</span>
                    <div class="field-value">@${escapeHtml(data.username.replace('@', ''))}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Gender</span>
                    <div class="field-value ${!data.gender ? 'empty-val' : ''}">${escapeHtml(data.gender || 'Not specified')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Date of Birth</span>
                    <div class="field-value ${!data.dateOfBirth ? 'empty-val' : ''}">${escapeHtml(data.dateOfBirth || 'Not specified')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Email Address</span>
                    <div class="field-value">${escapeHtml(data.email)}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Phone Number</span>
                    <div class="field-value ${!data.phoneNumber ? 'empty-val' : ''}">${escapeHtml(data.phoneNumber || 'Not specified')}</div>
                </div>
                <div class="field-group" style="grid-column: 1 / -1">
                    <span class="field-label">Location</span>
                    <div class="field-value ${!data.location ? 'empty-val' : ''}">${escapeHtml(data.location || 'Not specified')}</div>
                </div>
                <div class="field-group" style="grid-column: 1 / -1">
                    <span class="field-label">Bio</span>
                    <div class="field-value ${!data.bio ? 'empty-val' : ''}">${escapeHtml(data.bio || 'Not specified')}</div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-form-grid">
                <div class="ob-field">
                    <label class="ob-label" for="edit-fullName">Full Name <span style="color:#f43f5e">*</span></label>
                    <input class="ob-input" id="edit-fullName" type="text" value="${escapeHtml(data.fullName)}" placeholder="e.g. Hema Sakshi">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-username">Username <span style="color:#f43f5e">*</span></label>
                    <input class="ob-input" id="edit-username" type="text" value="${escapeHtml(data.username)}" placeholder="e.g. hema_sakshi">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-gender">Gender</label>
                    <select class="ob-select" id="edit-gender">
                        <option value="">Select gender</option>
                        <option ${data.gender === 'Male' ? 'selected' : ''}>Male</option>
                        <option ${data.gender === 'Female' ? 'selected' : ''}>Female</option>
                        <option ${data.gender === 'Other' ? 'selected' : ''}>Other</option>
                        <option ${data.gender === 'Prefer not to say' ? 'selected' : ''}>Prefer not to say</option>
                    </select>
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-dateOfBirth">Date of Birth</label>
                    <input class="ob-input" id="edit-dateOfBirth" type="date" value="${escapeHtml(data.dateOfBirth || '')}">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-email">Email Address</label>
                    <input class="ob-input" id="edit-email" type="email" value="${escapeHtml(data.email)}" readonly style="opacity:0.75;cursor:not-allowed;">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-phoneNumber">Phone Number</label>
                    <input class="ob-input" id="edit-phoneNumber" type="tel" value="${escapeHtml(data.phoneNumber || '')}" placeholder="+91 98765 43210">
                </div>
                <div class="ob-field full">
                    <label class="ob-label" for="edit-location">Location</label>
                    <input class="ob-input" id="edit-location" type="text" value="${escapeHtml(data.location || '')}" placeholder="e.g. Bengaluru, Karnataka">
                </div>
                <div class="ob-field full">
                    <label class="ob-label" for="edit-bio">Bio</label>
                    <textarea class="ob-textarea" id="edit-bio" placeholder="Tell other students about yourself, your interests, and what you love building...">${escapeHtml(data.bio || '')}</textarea>
                </div>
            </div>
        `;
    }
}

/* 3. Academic Profile (Step 2) */
function renderAcademicInfo(data) {
    const container = document.getElementById("academicInfoContent");
    if (!container) return;

    if (!isEditing) {
        container.innerHTML = `
            <div class="fields-grid-3">
                <div class="field-group" style="grid-column: 1 / -1">
                    <span class="field-label">College / University</span>
                    <div class="field-value">${escapeHtml(data.college || '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Degree</span>
                    <div class="field-value">${escapeHtml(data.degree || '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Branch / Specialisation</span>
                    <div class="field-value">${escapeHtml(data.branch || '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Current Semester</span>
                    <div class="field-value">${escapeHtml(data.semester ? `Semester ${data.semester}` : '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Section</span>
                    <div class="field-value">${escapeHtml(data.section || '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">USN / Roll Number</span>
                    <div class="field-value">${escapeHtml(data.usn || '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Graduation Year</span>
                    <div class="field-value">${escapeHtml(data.graduationYear || '—')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Current CGPA</span>
                    <div class="field-value">${escapeHtml(data.cgpa || '—')}</div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-form-grid">
                <div class="ob-field full">
                    <label class="ob-label" for="edit-college">College / University</label>
                    <input class="ob-input" id="edit-college" type="text" value="${escapeHtml(data.college || '')}" placeholder="e.g. RV College of Engineering, Bengaluru">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-degree">Degree</label>
                    <select class="ob-select" id="edit-degree">
                        <option value="">Select degree</option>
                        ${['B.E', 'B.Tech', 'M.Tech', 'MCA', 'BCA', 'BSc', 'MSc', 'MBA', 'PhD'].map(d => `<option ${data.degree === d ? 'selected' : ''}>${d}</option>`).join('')}
                    </select>
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-branch">Branch / Specialisation</label>
                    <input class="ob-input" id="edit-branch" type="text" value="${escapeHtml(data.branch || '')}" placeholder="e.g. Artificial Intelligence & Data Science">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-semester">Current Semester</label>
                    <select class="ob-select" id="edit-semester">
                        <option value="">Select semester</option>
                        ${[1,2,3,4,5,6,7,8].map(s => `<option value="${s}" ${String(data.semester) === String(s) ? 'selected' : ''}>Semester ${s}</option>`).join('')}
                    </select>
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-section">Section</label>
                    <input class="ob-input" id="edit-section" type="text" value="${escapeHtml(data.section || '')}" placeholder="e.g. A, B, C">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-usn">USN / Roll Number</label>
                    <input class="ob-input" id="edit-usn" type="text" value="${escapeHtml(data.usn || '')}" placeholder="e.g. 1RV22AI045">
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-graduationYear">Graduation Year</label>
                    <select class="ob-select" id="edit-graduationYear">
                        <option value="">Select year</option>
                        ${['2025', '2026', '2027', '2028', '2029'].map(y => `<option value="${y}" ${String(data.graduationYear) === String(y) ? 'selected' : ''}>${y}</option>`).join('')}
                    </select>
                </div>
                <div class="ob-field">
                    <label class="ob-label" for="edit-cgpa">Current CGPA</label>
                    <input class="ob-input" id="edit-cgpa" type="number" step="0.1" min="0" max="10" value="${escapeHtml(data.cgpa || '')}" placeholder="e.g. 8.9">
                </div>
            </div>
        `;
    }
}

/* 4. Skills (Step 3) */
function renderSkills(data) {
    const container = document.getElementById("skillsContent");
    if (!container) return;

    const userSkills = data.skills || [];

    if (!isEditing) {
        if (userSkills.length === 0) {
            container.innerHTML = `<p class="field-value empty-val">No skills selected yet.</p>`;
            return;
        }
        container.innerHTML = `
            <div class="chips-grid">
                ${userSkills.map(skill => `
                    <div class="chip selected">
                        <span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>
                        ${escapeHtml(skill)}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            ${SKILLS_CATEGORIES.map(cat => `
                <div class="ob-section-title">${cat.title}</div>
                <div class="chips-grid">
                    ${cat.items.map(skill => {
                        const isSel = (draftData.skills || []).includes(skill);
                        return `
                            <div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('skills', '${skill}')">
                                <span class="chip-check"><i class="fas fa-check"></i></span>
                                ${escapeHtml(skill)}
                            </div>
                        `;
                    }).join('')}
                </div>
            `).join('')}

            <div class="add-tag-box" style="margin-top:20px;">
                <input class="ob-input add-tag-input" id="newSkillInput" type="text" placeholder="Add a custom skill (e.g. LangChain, Rust)...">
                <button class="btn btn-secondary btn-sm" onclick="addCustomArrayItem('skills', 'newSkillInput')"><i class="fas fa-plus"></i> Add Skill</button>
            </div>
        `;
    }
}

/* 5. Programming / Coding Profiles (Step 6) */
function renderCodingProfiles(data) {
    const container = document.getElementById("codingProfilesContent");
    if (!container) return;

    const profiles = [
        { key: 'github', name: 'GitHub', icon: 'fa-github', colorClass: 'icon-github', placeholder: 'https://github.com/yourusername' },
        { key: 'linkedin', name: 'LinkedIn', icon: 'fa-linkedin', colorClass: 'icon-linkedin', placeholder: 'https://linkedin.com/in/yourprofile' },
        { key: 'portfolio', name: 'Portfolio', icon: 'fa-globe', colorClass: 'icon-portfolio', placeholder: 'https://yourportfolio.com' },
        { key: 'leetcode', name: 'LeetCode', icon: 'fa-code', colorClass: 'icon-leetcode', placeholder: 'LeetCode username' },
        { key: 'codechef', name: 'CodeChef', icon: 'fa-trophy', colorClass: 'icon-codechef', placeholder: 'CodeChef username' },
        { key: 'hackerrank', name: 'HackerRank', icon: 'fa-terminal', colorClass: 'icon-hackerrank', placeholder: 'HackerRank username' },
        { key: 'codeforces', name: 'Codeforces', icon: 'fa-fire', colorClass: 'icon-codeforces', placeholder: 'Codeforces username' }
    ];

    if (!isEditing) {
        container.innerHTML = `
            <div class="coding-profiles-grid">
                ${profiles.map(p => {
                    const link = data[p.key];
                    let displayUrl = link;
                    if (link && !link.startsWith('http') && (p.key === 'leetcode' || p.key === 'codechef' || p.key === 'hackerrank' || p.key === 'codeforces')) {
                        displayUrl = `https://${p.key}.com/${link}`;
                    }
                    return `
                        <div class="coding-card">
                            <div class="coding-icon-box ${p.colorClass}">
                                <i class="fab ${p.icon.startsWith('fa-') && !p.icon.includes('github') && !p.icon.includes('linkedin') ? 'fas' : 'fab'} ${p.icon}"></i>
                            </div>
                            <div class="coding-info">
                                <span class="coding-name">${p.name}</span>
                                ${link ? `<a class="coding-link-display" href="${escapeHtml(displayUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link)} <i class="fas fa-external-link-alt" style="font-size:0.7rem;"></i></a>` : `<span class="coding-link-display" style="color:var(--text-muted);font-style:italic;">Not connected</span>`}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-form-grid">
                ${profiles.map(p => `
                    <div class="ob-field">
                        <label class="ob-label" for="edit-${p.key}">${p.name}</label>
                        <input class="ob-input" id="edit-${p.key}" type="text" value="${escapeHtml(data[p.key] || '')}" placeholder="${p.placeholder}">
                    </div>
                `).join('')}
            </div>
        `;
    }
}

/* 6. Interests Section (Step 4) */
function renderInterests(data) {
    const container = document.getElementById("interestsContent");
    if (!container) return;

    const userInterests = data.interests || [];

    if (!isEditing) {
        if (userInterests.length === 0) {
            container.innerHTML = `<p class="field-value empty-val">No interests selected yet.</p>`;
            return;
        }
        container.innerHTML = `
            <div class="chips-grid">
                ${userInterests.map(item => `
                    <div class="chip selected">
                        <span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>
                        ${escapeHtml(item)}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-section-title">Select Interests</div>
            <div class="chips-grid">
                ${ONBOARDING_INTERESTS.map(item => {
                    const isSel = (draftData.interests || []).includes(item);
                    return `
                        <div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('interests', '${item}')">
                            <span class="chip-check"><i class="fas fa-check"></i></span>
                            ${escapeHtml(item)}
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="add-tag-box" style="margin-top:16px;">
                <input class="ob-input add-tag-input" id="newInterestInput" type="text" placeholder="Add custom interest...">
                <button class="btn btn-secondary btn-sm" onclick="addCustomArrayItem('interests', 'newInterestInput')"><i class="fas fa-plus"></i> Add Interest</button>
            </div>
        `;
    }
}

/* 7. Experience Level (Step 4) */
function renderExperienceLevel(data) {
    const container = document.getElementById("experienceContent");
    if (!container) return;

    const expOptions = [
        { value: 'Beginner', label: '🌱 Beginner' },
        { value: 'Intermediate', label: '🚀 Intermediate' },
        { value: 'Advanced', label: '⭐ Advanced' }
    ];

    if (!isEditing) {
        container.innerHTML = `
            <div class="field-value">
                <span class="chip selected" style="font-size:0.9rem;">
                    <span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>
                    ${escapeHtml(data.experienceLevel || 'Intermediate')}
                </span>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="radio-group">
                ${expOptions.map(opt => {
                    const isSel = draftData.experienceLevel === opt.value;
                    return `
                        <label class="radio-option ${isSel ? 'selected' : ''}" onclick="selectRadioValue('experienceLevel', '${opt.value}')">
                            <div class="radio-dot"></div> ${opt.label}
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }
}

/* 8. Project Preferences (Steps 4 & 5) */
function renderProjectPreferences(data) {
    const container = document.getElementById("projectPreferencesContent");
    if (!container) return;

    if (!isEditing) {
        container.innerHTML = `
            <div class="fields-grid" style="gap:24px;">
                <div class="field-group" style="grid-column: 1 / -1;">
                    <span class="field-label">Preferred Project Types</span>
                    <div class="chips-grid">
                        ${(data.projectTypes || []).map(t => `<div class="chip selected"><span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>${escapeHtml(t)}</div>`).join('')}
                    </div>
                </div>
                <div class="field-group" style="grid-column: 1 / -1;">
                    <span class="field-label">Preferred Domains</span>
                    <div class="chips-grid">
                        ${(data.preferredDomains || []).map(d => `<div class="chip selected"><span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>${escapeHtml(d)}</div>`).join('')}
                    </div>
                </div>
                <div class="field-group" style="grid-column: 1 / -1;">
                    <span class="field-label">Preferred Roles</span>
                    <div class="chips-grid">
                        ${(data.preferredRoles || []).map(r => `<div class="chip selected"><span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>${escapeHtml(r)}</div>`).join('')}
                    </div>
                </div>
                <div class="field-group">
                    <span class="field-label">Looking for Team</span>
                    <div class="field-value">${data.lookingForTeam ? '👥 Yes, looking for teammates' : '🧑‍💻 No, working solo'}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Preferred Team Size</span>
                    <div class="field-value">${escapeHtml(data.preferredTeamSize || '4')} people</div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-section-title">Preferred Project Types</div>
            <div class="chips-grid">
                ${ONBOARDING_PROJECT_TYPES.map(t => {
                    const isSel = (draftData.projectTypes || []).includes(t);
                    return `<div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('projectTypes', '${t}')"><span class="chip-check"><i class="fas fa-check"></i></span>${escapeHtml(t)}</div>`;
                }).join('')}
            </div>

            <div class="ob-divider"></div>
            <div class="ob-section-title">Preferred Domains</div>
            <div class="chips-grid">
                ${ONBOARDING_DOMAINS.map(d => {
                    const isSel = (draftData.preferredDomains || []).includes(d);
                    return `<div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('preferredDomains', '${d}')"><span class="chip-check"><i class="fas fa-check"></i></span>${escapeHtml(d)}</div>`;
                }).join('')}
            </div>

            <div class="ob-divider"></div>
            <div class="ob-section-title">Preferred Roles</div>
            <div class="chips-grid">
                ${ONBOARDING_ROLES.map(r => {
                    const isSel = (draftData.preferredRoles || []).includes(r);
                    return `<div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('preferredRoles', '${r}')"><span class="chip-check"><i class="fas fa-check"></i></span>${escapeHtml(r)}</div>`;
                }).join('')}
            </div>

            <div class="ob-divider"></div>
            <div class="ob-section-title">Looking for a Team?</div>
            <div class="radio-group">
                <label class="radio-option ${draftData.lookingForTeam ? 'selected' : ''}" onclick="selectRadioValue('lookingForTeam', true)">
                    <div class="radio-dot"></div> 👥 Yes, looking for teammates
                </label>
                <label class="radio-option ${!draftData.lookingForTeam ? 'selected' : ''}" onclick="selectRadioValue('lookingForTeam', false)">
                    <div class="radio-dot"></div> 🧑‍💻 No, working solo
                </label>
            </div>

            <div class="ob-divider"></div>
            <div class="ob-section-title">Preferred Team Size</div>
            <div class="radio-group">
                ${['2', '3', '4', '5+'].map(size => {
                    const isSel = String(draftData.preferredTeamSize) === String(size);
                    return `
                        <label class="radio-option ${isSel ? 'selected' : ''}" onclick="selectRadioValue('preferredTeamSize', '${size}')">
                            <div class="radio-dot"></div> ${size} people
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }
}

/* 9. Career Goals (Step 4) */
function renderCareerGoals(data) {
    const container = document.getElementById("careerGoalsContent");
    if (!container) return;

    const userGoals = data.careerGoals || [];

    if (!isEditing) {
        container.innerHTML = `
            <div class="chips-grid">
                ${userGoals.map(g => `<div class="chip selected"><span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>${escapeHtml(g)}</div>`).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="chips-grid">
                ${ONBOARDING_GOALS.map(g => {
                    const isSel = (draftData.careerGoals || []).includes(g);
                    return `<div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('careerGoals', '${g}')"><span class="chip-check"><i class="fas fa-check"></i></span>${escapeHtml(g)}</div>`;
                }).join('')}
            </div>
        `;
    }
}

/* 10. Availability & Working Style (Step 5) */
function renderAvailability(data) {
    const container = document.getElementById("availabilityContent");
    if (!container) return;

    const availOptions = ['5 hrs/week', '10 hrs/week', '15 hrs/week', '20+ hrs/week'];
    const styleOptions = [
        { value: 'Morning', label: '☀️ Morning' },
        { value: 'Afternoon', label: '🌤️ Afternoon' },
        { value: 'Evening', label: '🌆 Evening' },
        { value: 'Night', label: '🌙 Night' }
    ];

    if (!isEditing) {
        container.innerHTML = `
            <div class="fields-grid">
                <div class="field-group">
                    <span class="field-label">Weekly Availability</span>
                    <div class="field-value">${escapeHtml(data.availability || '10 hrs/week')}</div>
                </div>
                <div class="field-group">
                    <span class="field-label">Preferred Working Hours</span>
                    <div class="field-value">${escapeHtml(data.workingStyle || 'Evening')}</div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-section-title">Weekly Availability</div>
            <div class="radio-group">
                ${availOptions.map(a => {
                    const isSel = draftData.availability === a;
                    return `
                        <label class="radio-option ${isSel ? 'selected' : ''}" onclick="selectRadioValue('availability', '${a}')">
                            <div class="radio-dot"></div> ~${a}
                        </label>
                    `;
                }).join('')}
            </div>

            <div class="ob-divider"></div>
            <div class="ob-section-title">Preferred Working Hours</div>
            <div class="radio-group">
                ${styleOptions.map(s => {
                    const isSel = draftData.workingStyle === s.value;
                    return `
                        <label class="radio-option ${isSel ? 'selected' : ''}" onclick="selectRadioValue('workingStyle', '${s.value}')">
                            <div class="radio-dot"></div> ${s.label}
                        </label>
                    `;
                }).join('')}
            </div>
        `;
    }
}

/* 11. AI Preferences (Step 7) */
function renderAiPreferences(data) {
    const container = document.getElementById("aiPreferencesContent");
    if (!container) return;

    const userFeatures = data.aiFeatures || [];

    if (!isEditing) {
        container.innerHTML = `
            <div class="fields-grid" style="margin-bottom:16px;">
                <div class="field-group">
                    <span class="field-label">AI Response Tone</span>
                    <div class="field-value">${escapeHtml(data.aiTone || 'Professional')}</div>
                </div>
            </div>
            <span class="field-label">Enabled AI Features (${userFeatures.length})</span>
            <div class="checkbox-grid">
                ${ONBOARDING_AI_FEATURES.map(f => {
                    const isChecked = userFeatures.includes(f.key);
                    return `
                        <div class="checkbox-option ${isChecked ? 'checked' : ''}">
                            <div class="checkbox-box"><i class="fas fa-check"></i></div>
                            <span class="checkbox-label">${escapeHtml(f.label)}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="ob-field" style="margin-bottom:20px;">
                <label class="ob-label" for="edit-aiTone">AI Response Tone</label>
                <select class="ob-select" id="edit-aiTone">
                    ${['Friendly', 'Professional', 'Concise', 'Detailed'].map(t => `<option ${data.aiTone === t ? 'selected' : ''}>${t}</option>`).join('')}
                </select>
            </div>
            <label class="ob-label">AI Features to Enable</label>
            <div class="checkbox-grid">
                ${ONBOARDING_AI_FEATURES.map(f => {
                    const isChecked = (draftData.aiFeatures || []).includes(f.key);
                    return `
                        <div class="checkbox-option ${isChecked ? 'checked' : ''}" onclick="toggleArrayItem('aiFeatures', '${f.key}')">
                            <div class="checkbox-box"><i class="fas fa-check"></i></div>
                            <span class="checkbox-label">${escapeHtml(f.label)}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
}

/* 12. Languages (Step 5) */
function renderLanguages(data) {
    const container = document.getElementById("languagesContent");
    if (!container) return;

    const userLangs = data.languages || [];

    if (!isEditing) {
        container.innerHTML = `
            <div class="chips-grid">
                ${userLangs.map(l => `<div class="chip selected"><span class="chip-check" style="opacity:1"><i class="fas fa-check"></i></span>${escapeHtml(l)}</div>`).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="chips-grid">
                ${ONBOARDING_LANGUAGES.map(l => {
                    const isSel = (draftData.languages || []).includes(l);
                    return `<div class="chip ${isSel ? 'selected' : ''}" onclick="toggleArrayItem('languages', '${l}')"><span class="chip-check"><i class="fas fa-check"></i></span>${escapeHtml(l)}</div>`;
                }).join('')}
            </div>
            <div class="add-tag-box" style="margin-top:16px;">
                <input class="ob-input add-tag-input" id="newLanguageInput" type="text" placeholder="Add custom language...">
                <button class="btn btn-secondary btn-sm" onclick="addCustomArrayItem('languages', 'newLanguageInput')"><i class="fas fa-plus"></i> Add Language</button>
            </div>
        `;
    }
}

/* 13. Resume (Step 6) */
function renderResumeSection(data) {
    const container = document.getElementById("resumeContent");
    if (!container) return;

    const resumeInfo = data.resume || { name: 'No resume uploaded', size: '0 KB', updatedAt: '—' };

    container.innerHTML = `
        <div class="resume-box">
            <div class="resume-file-info">
                <div class="resume-icon-badge">
                    <i class="fas fa-file-pdf"></i>
                </div>
                <div class="resume-details">
                    <span class="resume-filename">${escapeHtml(resumeInfo.name)}</span>
                    <span class="resume-meta">Size: ${escapeHtml(resumeInfo.size || '1 MB')} • Updated: ${escapeHtml(resumeInfo.updatedAt || 'Recently')}</span>
                </div>
            </div>
            <div class="resume-actions-group">
                <button class="btn btn-secondary btn-sm" onclick="viewResume()"><i class="fas fa-eye"></i> View Resume</button>
                ${isEditing ? `
                    <button class="btn btn-primary btn-sm" onclick="triggerFileInput('resumeFileInput')"><i class="fas fa-upload"></i> Replace Resume</button>
                ` : ''}
            </div>
        </div>
        ${isEditing ? `
            <div class="resume-drop-zone" onclick="triggerFileInput('resumeFileInput')">
                <i class="fas fa-cloud-upload-alt"></i>
                <p><strong>Click to upload</strong> or replace your resume document</p>
                <small>PDF or Word document &bull; Max 10 MB</small>
            </div>
        ` : ''}
    `;
}

// ============================================================
// SELECTION HELPERS
// ============================================================
function toggleArrayItem(key, item) {
    if (!draftData[key]) draftData[key] = [];
    const index = draftData[key].indexOf(item);
    if (index > -1) {
        draftData[key].splice(index, 1);
    } else {
        draftData[key].push(item);
    }
    renderProfile();
}

function selectRadioValue(key, value) {
    draftData[key] = value;
    renderProfile();
}

function addCustomArrayItem(key, inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const value = input.value.trim();
    if (!value) return;

    if (!draftData[key]) draftData[key] = [];
    if (!draftData[key].includes(value)) {
        draftData[key].push(value);
    }
    input.value = "";
    renderProfile();
}

// ============================================================
// FILE UPLOADS
// ============================================================
function initFileUploadHandlers() {
    const bannerFileInput = document.getElementById("bannerFileInput");
    if (bannerFileInput) {
        bannerFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (draftData) draftData.bannerImage = event.target.result;
                    renderProfile();
                    showToast("Cover banner updated", "info");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const avatarFileInput = document.getElementById("avatarFileInput");
    if (avatarFileInput) {
        avatarFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (draftData) draftData.profileImage = event.target.result;
                    renderProfile();
                    showToast("Profile photo updated", "info");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const resumeFileInput = document.getElementById("resumeFileInput");
    if (resumeFileInput) {
        resumeFileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";
                draftData.resume = {
                    name: file.name,
                    size: sizeMb,
                    updatedAt: new Date().toISOString().split("T")[0],
                    url: "#"
                };
                renderProfile();
                showToast(`Resume selected: ${file.name}`, "info");
            }
        });
    }
}

function triggerFileInput(id) {
    const el = document.getElementById(id);
    if (el) el.click();
}

function viewResume() {
    showToast("Opening resume viewer...", "info");
}

// ============================================================
// UI UTILITIES & TOASTS
// ============================================================
function showFloatingSaveBar(show) {
    const saveBar = document.getElementById("floatingSaveBar");
    if (saveBar) {
        if (show) saveBar.classList.add("active");
        else saveBar.classList.remove("active");
    }
}

function showToast(message, type = "success") {
    let toast = document.getElementById("profileToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "profileToast";
        toast.className = "profile-toast";
        document.body.appendChild(toast);
    }

    let icon = "fa-check-circle";
    if (type === "warning") icon = "fa-exclamation-triangle";
    if (type === "info") icon = "fa-info-circle";

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHtml(message)}</span>`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function initSidebarScrollSpy() {
    const links = document.querySelectorAll(".nav-sidebar-link");
    const sections = Array.from(links).map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);

    // Smooth click handler with offset for top navbar
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href");
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerOffset = 100;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                links.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    });

    // Scroll spy scroll listener
    function onScroll() {
        const scrollPosition = window.scrollY + 160;
        const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

        if (isAtBottom && links.length > 0) {
            links.forEach(l => l.classList.remove("active"));
            links[links.length - 1].classList.add("active");
            return;
        }

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section && section.offsetTop <= scrollPosition) {
                links.forEach(l => l.classList.remove("active"));
                links[i].classList.add("active");
                break;
            }
        }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
}
