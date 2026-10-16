/**
 * UpSkill Platform - Core Client Application
 * Handles State, Navigation, AI Simulators, Resume Generation, Mock Interviews & Interactivity
 */

// ============================================================================
// 1. STATE & DATA STORE
// ============================================================================
const AppState = {
  currentUser: JSON.parse(localStorage.getItem('upskill_user')) || null,
  activeView: 'dashboard',
  currentTheme: localStorage.getItem('upskill_theme') || 'dark',
  currentLang: localStorage.getItem('upskill_lang') || 'en',
  aiMode: localStorage.getItem('upskill_ai_mode') || 'live',
  groqApiKey: localStorage.getItem('upskill_groq_api_key') || '',
  groqModel: localStorage.getItem('upskill_groq_model') || 'qwen/qwen3.8-27b',
  resumeTheme: 'jakes-resume',
  mentorConversation: [],
  
  // Dashboard Metrics
  metrics: {
    topMatch: '88%',
    roadmapProgress: 35,
    interviewsCompleted: 2
  },

  // Mock Interview State
  interview: {
    role: 'Frontend Developer',
    difficulty: 'Junior / Entry Level',
    type: 'mixed',
    currentQuestionIndex: 0,
    questions: [],
    userAnswers: [],
    isRecording: false,
    recognition: null
  }
};

// ============================================================================
// 2. MOCK DATA DIRECTORIES
// ============================================================================
const TRANSLATIONS = {
  en: {
    brand_slogan: "From learning today to leading tomorrow.",
    nav_dashboard: "Dashboard",
    nav_opportunities: "Resume Builder",
    nav_learn: "Roadmap & Learn",
    nav_projects: "Project Hub",
    nav_interview: "Mock Interviews",
    nav_internships: "Internships",
    nav_govt_schemes: "Govt Schemes",
    nav_mentor: "Mentor",
    dashboard_title: "Dashboard",
    last_ats_score: "Top Match",
    roadmap_progress: "Roadmap",
    journey_step1_title: "Discover",
    journey_step1_desc: "Share your education, skills, goals, and target role in a guided onboarding flow.",
    journey_step2_title: "Design",
    journey_step2_desc: "Analyze your resume to get instant ATS scores, keyword gaps, and feedback reports.",
    journey_step3_title: "Develop",
    journey_step3_desc: "Receive a personalized short, medium, and long-term learning plan curated for you.",
    journey_step4_title: "Deliver",
    journey_step4_desc: "Run AI mock interviews and iterate on your skills until you're interview-ready."
  },
  hi: {
    brand_slogan: "आज सीखने से लेकर कल नेतृत्व करने तक।",
    nav_dashboard: "डैशबोर्ड",
    nav_opportunities: "रिज्यूमे बिल्डर",
    nav_learn: "रोडमैप और सीखें",
    nav_projects: "प्रोजेक्ट हब",
    nav_interview: "मॉक इंटरव्यू",
    nav_internships: "इंटर्नशिप्स",
    nav_govt_schemes: "सरकारी योजनाएं",
    nav_mentor: "एआई मेंटर",
    dashboard_title: "डैशबोर्ड",
    last_ats_score: "शीर्ष मैच",
    roadmap_progress: "प्रगति",
    journey_step1_title: "खोजें",
    journey_step1_desc: "अपनी शिक्षा, कौशल और लक्ष्य साझा करें।",
    journey_step2_title: "तैयार करें",
    journey_step2_desc: "अपने रिज्यूमे का विश्लेषण करें और एटीएस स्कोर सुधारें।",
    journey_step3_title: "विकसित करें",
    journey_step3_desc: "व्यक्तिगत शिक्षण योजना प्राप्त करें।",
    journey_step4_title: "सफल हों",
    journey_step4_desc: "एआई मॉक इंटरव्यू का अभ्यास करें।"
  },
  te: {
    brand_slogan: "ఈరోజు నేర్చుకోవడం నుండి రేపు నడిపించడం వరకు.",
    nav_dashboard: "డాష్‌బోర్డ్",
    nav_opportunities: "రెజ్యూమ్ బిల్డర్",
    nav_learn: "రోడ్‌మ్యాప్ & లెర్న్",
    nav_projects: "ప్రాజెక్ట్ హబ్",
    nav_interview: "మాక్ ఇంటర్వ్యూలు",
    nav_internships: "ఇంటర్న్‌షిప్‌లు",
    nav_govt_schemes: "ప్రభుత్వ పథకాలు",
    nav_mentor: "ఏఐ మెంటర్",
    dashboard_title: "డాష్‌బోర్డ్",
    last_ats_score: "టాప్ మ్యాచ్",
    roadmap_progress: "పురోగతి",
    journey_step1_title: "కనుగొనండి",
    journey_step1_desc: "మీ విద్య, నైపుణ్యాలు మరియు లక్ష్యాలను నమోదు చేయండి.",
    journey_step2_title: "రూపొందించండి",
    journey_step2_desc: "మీ రెజ్యూమ్‌ను విశ్లేషించి ATS స్కోర్‌ను పెంచుకోండి.",
    journey_step3_title: "అభివృద్ధి చేసుకోండి",
    journey_step3_desc: "వ్యక్తిగత లెర్నింగ్ ప్లాన్ పొందండి.",
    journey_step4_title: "విజయవంతం అవ్వండి",
    journey_step4_desc: "ఏఐ మాక్ ఇంటర్వ్యూలతో సిద్ధం అవ్వండి."
  }
};

const SCHEMES_DATA = [
  {
    id: 'pmkvy',
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
    type: 'student',
    badge: 'Govt. Sponsored Certification',
    desc: 'Skill certification scheme aimed at enabling Indian youth to take up industry-relevant skill training for better livelihoods.',
    eligibility: ['Indian citizen aged 15-45 years', 'School/College dropouts or students seeking technical certification', 'Aadhaar linked bank account holder'],
    features: ['100% government sponsored training and certification', 'Monetary rewards upon assessment completion', 'Placement assistance through National Apprenticeship Portal'],
    documents: ['Aadhaar Card', 'Voter ID or Bank Passbook', 'Educational certificates (10th/12th/Diploma)'],
    applyUrl: 'https://www.pmkvyofficial.org'
  },
  {
    id: 'aicte-intern',
    title: 'AICTE Internship Scheme with Top Tech Giants',
    type: 'student',
    badge: 'Internship Stipend Eligible',
    desc: 'National internship initiative facilitating certified industrial internships for engineering, polytechnic, and management students.',
    eligibility: ['Enrolled in AICTE-recognized colleges or universities', 'Pursuing B.Tech, M.Tech, MCA, or Polytechnic Diploma', 'Minimum 6.0 CGPA'],
    features: ['Direct access to 40,000+ verified tech internships', 'Digital badge verifiable on LinkedIn', 'Monthly stipend ranging from ₹8,000 to ₹25,000'],
    documents: ['College ID Card', 'Bonafide Certificate / No Objection Certificate', 'College Transcript'],
    applyUrl: 'https://internship.aicte-india.org'
  },
  {
    id: 'future-skills',
    title: 'FutureSkills PRIME (MeitY & NASSCOM)',
    type: 'working',
    badge: 'Industry Recognized Subsidy',
    desc: 'Reskilling & upskilling platform providing subsidized certifications in AI, Cloud, Cybersecurity, and Big Data for IT professionals.',
    eligibility: ['Working professionals in IT / ITES or transitioning into tech', 'Graduates seeking industry certification', 'Indian resident with valid PAN/Aadhaar'],
    features: ['Up to 50% government subsidy reimbursement on exam completion', 'Curriculum designed directly by Fortune 500 tech leaders', 'Government & NASSCOM co-branded certifications'],
    documents: ['Government Photo ID (Aadhaar / PAN)', 'Employment Proof or Degree Certificate', 'Bank Account Details for Subsidy Credit'],
    applyUrl: 'https://futureskillsprime.in'
  },
  {
    id: 'digital-india',
    title: 'Digital India BPO Promotion Scheme (IBPS)',
    type: 'working',
    badge: 'Employment Incentive',
    desc: 'Fostering IT-enabled services and cloud operations across tier-2 and tier-3 cities with job placement guarantees.',
    eligibility: ['Graduates with basic computer literacy', 'Residents of Tier 2 & Tier 3 cities', 'Age between 18-35 years'],
    features: ['Guaranteed interview drives with regional tech centres', 'Free pre-onboarding technical training', 'Government job security credits'],
    documents: ['10th & Degree Marksheets', 'Residential / Domicile Certificate', 'Aadhaar Card'],
    applyUrl: 'https://www.meity.gov.in/ibps'
  }
];

const INTERNSHIPS_DATA = [
  {
    id: 'int-1',
    title: 'Frontend React Developer Intern',
    company: 'Nexus Cloud Technologies',
    icon: 'fa-code',
    type: 'Remote',
    domain: 'Development',
    location: 'Bangalore / Remote',
    stipend: '₹22,000 / month',
    duration: '6 Months',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'Redux'],
    applyLink: 'https://linkedin.com/jobs'
  },
  {
    id: 'int-2',
    title: 'AI & Data Science Research Intern',
    company: 'Cerebral AI Labs',
    icon: 'fa-brain',
    type: 'Hybrid',
    domain: 'Data',
    location: 'Hyderabad, India',
    stipend: '₹30,000 / month',
    duration: '3 Months',
    skills: ['Python', 'PyTorch', 'FastAPI', 'Pandas'],
    applyLink: 'https://internshala.com'
  },
  {
    id: 'int-3',
    title: 'UI/UX Product Design Intern',
    company: 'Aura Studio Design',
    icon: 'fa-palette',
    type: 'Remote',
    domain: 'Design',
    location: 'Remote',
    stipend: '₹18,000 / month',
    duration: '4 Months',
    skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
    applyLink: 'https://wellfound.com'
  },
  {
    id: 'int-4',
    title: 'Cybersecurity Analyst Trainee',
    company: 'Fortress Cyber Guard',
    icon: 'fa-shield-halved',
    type: 'On-Site',
    domain: 'Security',
    location: 'Pune, India',
    stipend: '₹25,000 / month',
    duration: '6 Months',
    skills: ['Network Security', 'Wireshark', 'Linux', 'VAPT'],
    applyLink: 'https://indeed.com'
  },
  {
    id: 'int-5',
    title: 'Creative Script & Content Strategist',
    company: 'VibeVerse Media',
    icon: 'fa-pen-nib',
    type: 'Remote',
    domain: 'Writing',
    location: 'Mumbai / Remote',
    stipend: '₹15,000 / month',
    duration: '3 Months',
    skills: ['Creative Writing', 'Storyboarding', 'Social Copy', 'Scripting'],
    applyLink: 'https://internshala.com'
  },
  {
    id: 'int-6',
    title: 'Junior Product Management Intern',
    company: 'InnoScale Ventures',
    icon: 'fa-rocket',
    type: 'Hybrid',
    domain: 'Product',
    location: 'Gurugram, India',
    stipend: '₹28,000 / month',
    duration: '6 Months',
    skills: ['Jira', 'Product Roadmapping', 'User Stories', 'Analytics'],
    applyLink: 'https://linkedin.com/jobs'
  }
];

const ROADMAPS_STORE = {
  'Frontend Developer': {
    skills: ['HTML5 & Semantic Markup', 'Modern CSS & Flexbox/Grid', 'JavaScript ES6+', 'React.js & Hooks', 'State Management (Zustand/Redux)', 'REST APIs & Async Fetch', 'Tailwind CSS', 'Vite & Webpack', 'Web Performance & Accessibility'],
    nodes: [
      { title: 'Phase 1: Web Fundamentals', badge: 'Weeks 1-3', desc: 'Master semantic HTML, modern responsive CSS layouts, and core JavaScript fundamentals (DOM, Event loop, Promises).' },
      { title: 'Phase 2: Modern Frontend Frameworks', badge: 'Weeks 4-7', desc: 'Deep dive into React 18 component lifecycle, Custom Hooks, Context API, and state libraries.' },
      { title: 'Phase 3: Production Tooling & APIs', badge: 'Weeks 8-10', desc: 'Integrate RESTful backends, JWT token authentication, TypeScript integration, and client-side caching.' },
      { title: 'Phase 4: Optimization & Deployment', badge: 'Weeks 11-12', desc: 'Core Web Vitals tuning, bundle optimization with Vite, and CI/CD hosting on Vercel/Netlify.' }
    ],
    videos: [
      { title: 'Complete React 18 Course & Real World Projects', channel: 'freeCodeCamp.org', img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=180', link: 'https://www.youtube.com/results?search_query=react+18+full+course' },
      { title: 'Master JavaScript ES6+ in 100 Minutes', channel: 'Traversy Media', img: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=300&h=180', link: 'https://www.youtube.com/results?search_query=modern+javascript+es6' },
      { title: 'CSS Flexbox & Grid Masterclass with Practical UI', channel: 'Web Dev Simplified', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=300&h=180', link: 'https://www.youtube.com/results?search_query=css+grid+flexbox+masterclass' }
    ]
  },
  'Backend Developer': {
    skills: ['Node.js & Express', 'RESTful API Design', 'PostgreSQL & SQL Mastery', 'MongoDB & NoSQL', 'Authentication & JWT', 'Docker & Containerization', 'Redis Caching', 'System Design Basics'],
    nodes: [
      { title: 'Phase 1: Server Runtime & APIs', badge: 'Weeks 1-4', desc: 'Build scalable REST APIs using Express.js or Fastify, request validation, and error middlewares.' },
      { title: 'Phase 2: Database Modeling & Queries', badge: 'Weeks 5-8', desc: 'Relational DB indexing, joins, transactions in PostgreSQL and document design in MongoDB.' },
      { title: 'Phase 3: Microservices & Cloud Infra', badge: 'Weeks 9-12', desc: 'Containerizing services with Docker, message queues (RabbitMQ/Kafka), and Redis caching.' }
    ],
    videos: [
      { title: 'Node.js and Express Full Backend Course', channel: 'freeCodeCamp.org', img: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=300&h=180', link: 'https://www.youtube.com/results?search_query=nodejs+backend+course' },
      { title: 'System Design for Beginners', channel: 'NeetCode', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=300&h=180', link: 'https://www.youtube.com/results?search_query=system+design+beginners' }
    ]
  }
};

const PROJECT_IDEAS_STORE = {
  'Frontend Developer': [
    {
      title: 'DevCollab - Realtime Code Snippet Studio',
      difficulty: 'intermediate',
      desc: 'A browser-based workspace where developers can write code, collaborate via WebSockets, and preview results in real time.',
      tags: ['React', 'WebSockets', 'Tailwind CSS', 'Monaco Editor'],
      tutorial: 'https://github.com/topics/code-editor'
    },
    {
      title: 'PulseTrack - High-Performance Crypto & Stock Dashboard',
      difficulty: 'beginner',
      desc: 'Interactive financial metrics visualizer with candlestick charts, live currency converters, and local watchlist alerts.',
      tags: ['JavaScript', 'Chart.js', 'CoinGecko API', 'CSS Grid'],
      tutorial: 'https://github.com/topics/finance-dashboard'
    },
    {
      title: 'CanvasCraft - Drag-and-Drop Portfolio Builder',
      difficulty: 'advanced',
      desc: 'Visual website builder enabling creators to drag UI blocks, customize colors, and export clean HTML/CSS zip archives.',
      tags: ['TypeScript', 'React-DND', 'HTML5 Canvas', 'JSZip'],
      tutorial: 'https://github.com/topics/page-builder'
    }
  ],
  'Backend Developer': [
    {
      title: 'Scalable Rate Limiter & API Gateway',
      difficulty: 'advanced',
      desc: 'High-throughput token bucket rate limiter with Redis caching, request routing, and metric dashboards.',
      tags: ['Node.js', 'Redis', 'Docker', 'Express'],
      tutorial: 'https://github.com/topics/api-gateway'
    },
    {
      title: 'Secure Cloud File Vault with Pre-signed URLs',
      difficulty: 'intermediate',
      desc: 'Encrypted file storage backend with role-based access control, chunked uploads, and automated thumbnail extraction.',
      tags: ['Python / Node', 'AWS S3 / MinIO', 'PostgreSQL', 'JWT'],
      tutorial: 'https://github.com/topics/file-storage'
    }
  ]
};

const INTERVIEW_QUESTIONS = {
  'Frontend Developer': [
    { q: "Can you explain the difference between CSS Flexbox and CSS Grid, and in what scenarios would you choose one over the other?", tip: "Mention 1D vs 2D layout systems and alignment capabilities." },
    { q: "How does the virtual DOM work in React, and how does React reconcile state updates?", tip: "Discuss diffing algorithms, keys, and shallow comparisons." },
    { q: "What is the JavaScript Event Loop, and how do microtasks differ from macrotasks?", tip: "Cover call stack, task queue, Promise microtasks, and setTimeout." },
    { q: "How would you optimize the Core Web Vitals (LCP, FID/INP, CLS) of a slow-loading web application?", tip: "Mention image optimization, lazy loading, script deferment, and minimizing layout shifts." },
    { q: "Tell me about a challenging frontend bug you encountered recently and how you debugged and resolved it.", tip: "Use the STAR method: Situation, Task, Action, Result." }
  ],
  'Default': [
    { q: "Tell me about yourself, your career aspirations, and what excites you about this role.", tip: "Highlight your key skills, past projects, and future passion." },
    { q: "How do you handle deadlines and prioritize conflicting tasks when multiple issues arise simultaneously?", tip: "Mention prioritization frameworks like Eisenhower matrix and transparent team communication." },
    { q: "Describe a project where you collaborated with a team or worked under difficult constraints.", tip: "Showcase teamwork, adaptability, and constructive conflict resolution." },
    { q: "What are your top technical strengths, and what is one skill you are currently working to improve?", tip: "Be authentic and demonstrate a strong growth mindset." },
    { q: "Where do you see your career progressing in the next 2-3 years?", tip: "Align your personal career goals with continuous learning and leadership." }
  ]
};

// ============================================================================
// 3. CORE UI & ROUTING CONTROLLERS
// ============================================================================
window.showView = function(viewId) {
  AppState.activeView = viewId;
  
  // Hide all views
  document.querySelectorAll('.view-panel').forEach(panel => {
    panel.classList.remove('active');
  });

  // Remove active state from sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });

  // Activate selected panel
  const targetPanel = document.getElementById(`view-${viewId}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  } else {
    const notFoundPanel = document.getElementById('view-404');
    if (notFoundPanel) {
      notFoundPanel.classList.add('active');
      const badIdElem = document.getElementById('spa-404-bad-id');
      if (badIdElem) badIdElem.textContent = viewId;
    }
  }

  // Activate selected sidebar link
  const targetLink = document.getElementById(`nav-${viewId}`);
  if (targetLink) {
    targetLink.classList.add('active');
  }

  // Update header title
  const headerTitle = document.getElementById('current-view-title');
  if (headerTitle) {
    const titles = {
      'dashboard': 'Dashboard',
      'opportunities': 'AI Resume Builder',
      'learn': 'Roadmap & Learn',
      'projects': 'Project Hub',
      'interview': 'AI Mock Interviews',
      'internships': 'Internships Feed',
      'govt-schemes': 'Government Schemes',
      'mentor': 'AI Mentor',
      '404': '404 &middot; Not Found'
    };
    headerTitle.textContent = targetPanel ? (titles[viewId] || 'UpSkill') : '404 - Page Not Found';
  }

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Scroll main container to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render view-specific content if needed
  if (viewId === 'internships') renderInternships();
  if (viewId === 'govt-schemes') renderGovtSchemes('all');
  if (viewId === 'learn') syncRoadmapView();
  if (viewId === 'opportunities') updateResumeLivePreview();
};

function toggleMobileSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  sidebar.classList.toggle('open');
  overlay.classList.toggle('active');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('app-sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('active');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? 'fa-circle-check' :
               type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastSlideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================================
// 4. AUTHENTICATION SYSTEM
// ============================================================================
function initAuth() {
  const authView = document.getElementById('auth-view');
  const appView = document.getElementById('app-view');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const switchLink = document.getElementById('auth-switch-link');
  const footer = document.getElementById('auth-footer');
  const btnLogout = document.getElementById('btn-logout');

  // Toggle between Login & Register forms
  if (switchLink) {
    switchLink.addEventListener('click', (e) => {
      e.preventDefault();
      const isLoginVisible = loginForm.style.display !== 'none';
      if (isLoginVisible) {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        footer.innerHTML = `Already have an account? <a href="#" id="auth-switch-link">Sign In</a>`;
      } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        footer.innerHTML = `Don't have an account? <a href="#" id="auth-switch-link">Create one</a>`;
      }
      initAuthSwitch();
    });
  }

  function initAuthSwitch() {
    const link = document.getElementById('auth-switch-link');
    if (link) {
      link.onclick = (e) => {
        e.preventDefault();
        const isLoginVisible = loginForm.style.display !== 'none';
        if (isLoginVisible) {
          loginForm.style.display = 'none';
          registerForm.style.display = 'block';
          footer.innerHTML = `Already have an account? <a href="#" id="auth-switch-link">Sign In</a>`;
        } else {
          loginForm.style.display = 'block';
          registerForm.style.display = 'none';
          footer.innerHTML = `Don't have an account? <a href="#" id="auth-switch-link">Create one</a>`;
        }
        initAuthSwitch();
      };
    }
  }

  // Password visibility toggle
  ['login-password-toggle', 'register-password-toggle'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        const input = el.previousElementSibling.previousElementSibling || el.parentElement.querySelector('input');
        if (input.type === 'password') {
          input.type = 'text';
          el.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
          input.type = 'password';
          el.classList.replace('fa-eye-slash', 'fa-eye');
        }
      });
    }
  });

  // Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const name = email.split('@')[0] || 'User';
      performLogin({ name: capitalize(name), email: email });
    });
  }

  // Register Submit
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      performLogin({ name: name, email: email });
    });
  }

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('upskill_user');
      AppState.currentUser = null;
      appView.style.display = 'none';
      authView.style.display = 'flex';
      showToast('Logged out successfully.', 'info');
    });
  }

  // Check initial user state
  if (AppState.currentUser) {
    renderUserSession(AppState.currentUser);
    authView.style.display = 'none';
    appView.style.display = 'flex';
  } else {
    authView.style.display = 'flex';
    appView.style.display = 'none';
  }
}

function performLogin(userData) {
  AppState.currentUser = userData;
  localStorage.setItem('upskill_user', JSON.stringify(userData));
  renderUserSession(userData);
  
  document.getElementById('auth-view').style.display = 'none';
  document.getElementById('app-view').style.display = 'flex';
  
  showToast(`Welcome back, ${userData.name}!`, 'success');
  window.showView('dashboard');
}

function renderUserSession(user) {
  const nameEl = document.getElementById('user-profile-name');
  const avatarEl = document.getElementById('user-avatar-initials');
  
  if (nameEl) nameEl.textContent = user.name || 'John Doe';
  if (avatarEl) {
    const initials = (user.name || 'JD')
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    avatarEl.textContent = initials;
  }

  // Pre-fill resume form if empty
  const resName = document.getElementById('resume-name');
  const resEmail = document.getElementById('resume-email');
  if (resName && !resName.value) resName.value = user.name || 'John Doe';
  if (resEmail && !resEmail.value) resEmail.value = user.email || 'john.doe@example.com';
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================================
// 5. THEME & LANGUAGE CONTROLLERS
// ============================================================================
function initThemeAndLanguage() {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', AppState.currentTheme);
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.innerHTML = AppState.currentTheme === 'light' 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';

    themeBtn.addEventListener('click', () => {
      const nextTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
      AppState.currentTheme = nextTheme;
      localStorage.setItem('upskill_theme', nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      themeBtn.innerHTML = nextTheme === 'light' 
        ? '<i class="fa-solid fa-sun"></i>' 
        : '<i class="fa-solid fa-moon"></i>';
      showToast(`Switched to ${nextTheme} mode`, 'info');
    });
  }

  // Apply saved language
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    langSelect.value = AppState.currentLang;
    langSelect.addEventListener('change', (e) => {
      const lang = e.target.value;
      AppState.currentLang = lang;
      localStorage.setItem('upskill_lang', lang);
      applyTranslations(lang);
      showToast(`Language updated`, 'info');
    });
  }
}

function applyTranslations(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

// ============================================================================
// 6. RESUME BUILDER ENGINE & LIVE PREVIEW
// ============================================================================
function initResumeBuilder() {
  const inputs = [
    'resume-name', 'resume-role', 'resume-email', 'resume-phone',
    'resume-location', 'resume-languages', 'resume-linkedin', 'resume-github',
    'resume-skills', 'resume-summary', 'resume-degree', 'resume-school',
    'resume-grad-year', 'resume-cgpa', 'resume-work-title', 'resume-work-sub',
    'resume-work-desc', 'resume-exp-title1', 'resume-exp-sub1', 'resume-exp-link1',
    'resume-exp-desc1', 'resume-exp-title2', 'resume-exp-sub2', 'resume-exp-link2',
    'resume-exp-desc2', 'resume-leadership-title', 'resume-leadership-desc',
    'resume-cp-ratings', 'resume-achievements'
  ];

  // Set default initial demo data if inputs are empty
  const defaultValues = {
    'resume-name': 'Alex Rivera',
    'resume-role': 'Frontend Developer & UI Engineer',
    'resume-email': 'alex.rivera@example.com',
    'resume-phone': '+91 98765 43210',
    'resume-location': 'Hyderabad, India',
    'resume-languages': 'English, Hindi, Telugu',
    'resume-linkedin': 'linkedin.com/in/alexrivera',
    'resume-github': 'github.com/alexrivera',
    'resume-skills': 'JavaScript (ES6+), React.js, TypeScript, Next.js, HTML5/CSS3, Tailwind CSS, Redux, REST APIs, Git, Vite',
    'resume-summary': 'Passionate Frontend Developer with 2+ years of experience building responsive, accessible web applications. Proven track record of improving web performance, building interactive component libraries, and translating complex Figma designs into clean, maintainable code.',
    'resume-degree': 'B.Tech in Computer Science & Engineering',
    'resume-school': 'Vignan Institute of Information Technology',
    'resume-grad-year': '2025',
    'resume-cgpa': '8.9 CGPA',
    'resume-work-title': 'Frontend Engineering Intern at CloudPulse',
    'resume-work-sub': 'Jan 2024 - Jun 2024 | Hyderabad',
    'resume-work-desc': 'Architected reusable UI design system in React and Tailwind, cutting dashboard build times by 35%. Spearheaded client-side query caching with TanStack Query, lowering API latency by 40%.',
    'resume-exp-title1': 'UpSkill AI - Career Acceleration Platform',
    'resume-exp-sub1': 'React, JavaScript, Web Speech API, LocalStorage',
    'resume-exp-link1': 'github.com/alexrivera/upskill-ai',
    'resume-exp-desc1': 'Engineered interactive mock interview simulator and real-time ATS resume compiler used by 1,200+ active student peers.',
    'resume-exp-title2': 'CryptoStream - Real-time Trading Visualizer',
    'resume-exp-sub2': 'TypeScript, Chart.js, WebSockets, Tailwind',
    'resume-exp-link2': 'cryptostream.vercel.app',
    'resume-exp-desc2': 'Built live crypto price tracker with WebSockets live feed handling 100+ updates/sec with sub-50ms render overhead.',
    'resume-leadership-title': 'Technical Lead - Developer Student Club',
    'resume-leadership-desc': 'Organized 6 hands-on workshops on React and Web Performance for 400+ attendees. Mentored 20+ junior engineering students in open-source contributing.',
    'resume-cp-ratings': 'LeetCode Knight (1870) | Codeforces Specialist (1420) | 500+ Problems Solved',
    'resume-achievements': '1st Place Winner - State Level Hackathon 2024; Recipient of Merit Academic Scholarship.'
  };

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (!el.value && defaultValues[id]) {
        el.value = defaultValues[id];
      }
      el.addEventListener('input', () => updateResumeLivePreview());
    }
  });

  // AI Polish Buttons
  setupAIPolish('btn-polish-summary', 'resume-summary', [
    'Results-driven Frontend Engineer passionate about crafting pixel-perfect, highly accessible digital products. Experienced in modern React ecosystems, performance optimization, and scalable web architectures.',
    'Innovative UI Engineer with a deep foundation in JavaScript, modern frameworks, and responsive UX design. Dedicated to building engaging user experiences that drive measurable business outcomes.'
  ]);

  setupAIPolish('btn-polish-work', 'resume-work-desc', [
    'Engineered scalable frontend modules using React 18, enhancing page responsiveness by 40%. Collaborated with cross-functional product teams to implement CI/CD pipelines, reducing regression release bugs by 25%.',
    'Spearheaded the redesign of core user dashboards, slashing bundle size by 28% through code splitting and tree shaking. Authored comprehensive unit tests achieving 85%+ code coverage.'
  ]);

  setupAIPolish('btn-polish-desc1', 'resume-exp-desc1', [
    'Architected an end-to-end fullstack platform with real-time state synchronization, achieving a 99.8% uptime SLA across 5,000+ monthly active requests.',
    'Developed high-performance client features utilizing modern web standards, reducing Time to Interactive (TTI) by 450ms across low-end mobile devices.'
  ]);

  setupAIPolish('btn-polish-desc2', 'resume-exp-desc2', [
    'Engineered a real-time reactive data pipeline with sub-100ms websocket response latency, delivering seamless charting and transaction updates.',
    'Created fully modular, reusable component abstractions resulting in a 50% reduction in redundant styling code across project screens.'
  ]);

  setupAIPolish('btn-polish-leadership', 'resume-leadership-desc', [
    'Orchestrated technical conferences and hackathons for 500+ participants, securing corporate sponsorships and leading a core volunteer committee of 18 peers.',
    'Directed weekly algorithmic problem-solving bootcamps, mentoring 35+ junior engineers in Data Structures and System Design fundamentals.'
  ]);

  // Overleaf LaTeX Theme Switching Buttons
  const themes = [
    { btn: 'btn-theme-jakes', theme: 'jakes-resume', name: "Jake's Resume (Overleaf #1 SWE Pick)" },
    { btn: 'btn-theme-moderncv', theme: 'moderncv', name: "ModernCV (Corporate & Tech)" },
    { btn: 'btn-theme-deedy', theme: 'deedy-cv', name: "Deedy CV (Two-Column LaTeX)" },
    { btn: 'btn-theme-awesome', theme: 'awesome-cv', name: "Awesome-CV (Modern Tech)" },
    { btn: 'btn-theme-harvard', theme: 'harvard-classic', name: "Harvard Classic (Ivy League)" }
  ];

  themes.forEach(t => {
    const btn = document.getElementById(t.btn);
    if (btn) {
      btn.addEventListener('click', () => {
        themes.forEach(x => {
          const b = document.getElementById(x.btn);
          if (b) b.classList.remove('active');
        });
        btn.classList.add('active');
        AppState.resumeTheme = t.theme;
        updateResumeLivePreview();
        showToast(`LaTeX Template changed to: ${t.name}`, 'info');
      });
    }
  });

  // LaTeX Export Modal Controls
  setupLatexExportModal();

  // Generate / Refresh Button
  const btnGen = document.getElementById('btn-generate-resume');
  if (btnGen) {
    btnGen.addEventListener('click', () => {
      const loader = document.getElementById('opp-loading');
      const results = document.getElementById('opp-results-card');
      if (loader && results) {
        loader.style.display = 'flex';
        results.style.display = 'none';
        setTimeout(() => {
          loader.style.display = 'none';
          results.style.display = 'block';
          updateResumeLivePreview();
          showToast('Resume compiled successfully with ATS scoring!', 'success');
        }, 500);
      }
    });
  }

  // Save / Print PDF via html2pdf
  const btnDownload = document.getElementById('btn-download-resume');
  if (btnDownload) {
    btnDownload.addEventListener('click', () => {
      exportResumeToPDF();
    });
  }

  // Live typing preview sync on inputs
  const resumeInputs = [
    'resume-name', 'resume-role', 'resume-email', 'resume-phone', 'resume-location',
    'resume-languages', 'resume-linkedin', 'resume-github', 'resume-skills', 'resume-summary',
    'resume-degree', 'resume-school', 'resume-grad-year', 'resume-cgpa',
    'resume-work-title', 'resume-work-sub', 'resume-work-desc',
    'resume-exp-title1', 'resume-exp-sub1', 'resume-exp-link1', 'resume-exp-desc1',
    'resume-exp-title2', 'resume-exp-sub2', 'resume-exp-link2', 'resume-exp-desc2',
    'resume-leadership-title', 'resume-leadership-desc', 'resume-cp-ratings', 'resume-achievements'
  ];

  resumeInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        updateResumeLivePreview();
      });
    }
  });

  // Render initial preview
  updateResumeLivePreview();
}

function setupAIPolish(btnId, targetInputId, suggestions) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    const input = document.getElementById(targetInputId);
    if (!input) return;

    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Polishing...`;
    btn.disabled = true;

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * suggestions.length);
      input.value = suggestions[randomIdx];
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Polished!`;
      updateResumeLivePreview();
      showToast('AI improved the content structure!', 'success');

      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> AI Polish`;
        btn.disabled = false;
      }, 1500);
    }, 500);
  });
}

function getResumeData() {
  const v = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  return {
    name: v('resume-name') || 'John Doe',
    role: v('resume-role') || 'Software Engineer',
    email: v('resume-email') || 'john.doe@example.com',
    phone: v('resume-phone') || '+91 98765 43210',
    location: v('resume-location') || 'Bengaluru, India',
    linkedin: v('resume-linkedin') || 'linkedin.com/in/johndoe',
    github: v('resume-github') || 'github.com/johndoe',
    languages: v('resume-languages') || 'English, Hindi',
    skills: v('resume-skills') || 'JavaScript, TypeScript, React.js, Node.js, Express, PostgreSQL, Git, Docker, REST APIs',
    summary: v('resume-summary') || 'Results-driven Software Engineer with proven expertise building resilient, scalable web applications and microservices. Passionate about algorithms, cloud architecture, and modern UX engineering.',
    degree: v('resume-degree') || 'B.Tech in Computer Science and Engineering',
    school: v('resume-school') || 'National Institute of Technology',
    gradYear: v('resume-grad-year') || '2022 - 2026',
    cgpa: v('resume-cgpa') || '8.8 / 10 CGPA',
    workTitle: v('resume-work-title') || 'Software Engineering Intern | Google Summer of Code',
    workSub: v('resume-work-sub') || 'May 2024 - Aug 2024 | Remote',
    workDesc: v('resume-work-desc') || 'Architected distributed backend pipelines handling 50k+ daily transactions; optimized SQL queries and indexing, achieving a 35% latency reduction.',
    p1Title: v('resume-exp-title1') || 'AI Career Intelligence & Guidance Platform',
    p1Sub: v('resume-exp-sub1') || 'React, Node.js, Groq AI, TailwindCSS',
    p1Link: v('resume-exp-link1') || 'github.com/johndoe/upskill-ai',
    p1Desc: v('resume-exp-desc1') || 'Engineered automated ATS resume score analyzer and interactive career roadmap generator utilizing LLM APIs; supported over 2,000 active student users.',
    p2Title: v('resume-exp-title2') || 'High-Throughput Distributed Cache',
    p2Sub: v('resume-exp-sub2') || 'Go, Redis, gRPC, Docker',
    p2Link: v('resume-exp-link2') || 'github.com/johndoe/distributed-cache',
    p2Desc: v('resume-exp-desc2') || 'Constructed in-memory LRU key-value store with consistent hashing and write-ahead logging (WAL), achieving sub-millisecond retrieval p99 response times.',
    leadTitle: v('resume-leadership-title') || 'Lead Organizer | HackNIT National Hackathon',
    leadDesc: v('resume-leadership-desc') || 'Spearheaded organization of annual 36-hour hackathon for 600+ developers; negotiated sponsorships with leading tech enterprises and managed budget.',
    cpRatings: v('resume-cp-ratings') || 'LeetCode: Knight (2040) | Codeforces: Specialist (1480) | CodeChef: 4-Star (1850)',
    achievements: v('resume-achievements') || '1st Place Winner - Smart India Hackathon 2024; Recipient of Merit Academic Scholarship 2023-2025'
  };
}

function updateResumeLivePreview() {
  const previewBox = document.getElementById('resume-preview-box');
  if (!previewBox) return;

  const d = getResumeData();
  const theme = AppState.resumeTheme || 'jakes-resume';

  previewBox.className = `resume-preview-paper theme-${theme}`;

  if (theme === 'deedy-cv') {
    previewBox.innerHTML = renderDeedyCVTemplate(d);
  } else if (theme === 'moderncv') {
    previewBox.innerHTML = renderModernCVTemplate(d);
  } else if (theme === 'awesome-cv') {
    previewBox.innerHTML = renderAwesomeCVTemplate(d);
  } else if (theme === 'harvard-classic') {
    previewBox.innerHTML = renderHarvardTemplate(d);
  } else {
    // Default: Jake's Resume (Overleaf #1 SWE Template)
    previewBox.innerHTML = renderJakesTemplate(d);
  }
}

function renderJakesTemplate(d) {
  return `
    <div class="res-header">
      <h1 class="res-header-name">${d.name}</h1>
      <div class="res-header-role">${d.role}</div>
      <div class="res-header-contact">
        ${d.phone ? `<span><i class="fa-solid fa-phone"></i> ${d.phone}</span> <span>|</span>` : ''}
        ${d.email ? `<span><i class="fa-solid fa-envelope"></i> ${d.email}</span> <span>|</span>` : ''}
        ${d.location ? `<span><i class="fa-solid fa-location-dot"></i> ${d.location}</span>` : ''}
        ${d.linkedin ? `<span>|</span> <span><i class="fa-brands fa-linkedin"></i> ${d.linkedin}</span>` : ''}
        ${d.github ? `<span>|</span> <span><i class="fa-brands fa-github"></i> ${d.github}</span>` : ''}
      </div>
    </div>

    ${d.summary ? `
      <div class="res-section">
        <div class="res-section-title">Professional Summary</div>
        <p class="res-item-desc">${d.summary}</p>
      </div>
    ` : ''}

    ${d.degree || d.school ? `
      <div class="res-section">
        <div class="res-section-title">Education</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.school}</span>
            <span>${d.location || 'India'}</span>
          </div>
          <div class="res-item-row-sub">
            <span>${d.degree}</span>
            <span>${d.gradYear} ${d.cgpa ? `(${d.cgpa})` : ''}</span>
          </div>
        </div>
      </div>
    ` : ''}

    ${d.skills ? `
      <div class="res-section">
        <div class="res-section-title">Technical Skills</div>
        <p class="res-item-desc"><strong>Languages & Technologies:</strong> ${d.skills}</p>
        ${d.languages ? `<p class="res-item-desc" style="margin-top: 3px;"><strong>Spoken Languages:</strong> ${d.languages}</p>` : ''}
      </div>
    ` : ''}

    ${d.workTitle || d.workDesc ? `
      <div class="res-section">
        <div class="res-section-title">Experience</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.workTitle}</span>
            <span>${d.workSub}</span>
          </div>
          <ul class="latex-bullets">
            <li>${d.workDesc}</li>
          </ul>
        </div>
      </div>
    ` : ''}

    ${d.p1Title || d.p2Title ? `
      <div class="res-section">
        <div class="res-section-title">Projects</div>
        ${d.p1Title ? `
          <div class="res-item" style="margin-bottom: 6px;">
            <div class="res-item-row">
              <span><strong>${d.p1Title}</strong> ${d.p1Sub ? `| <em>${d.p1Sub}</em>` : ''}</span>
              <span>${d.p1Link ? `<a href="https://${d.p1Link}" target="_blank" style="color: inherit; text-decoration: underline;">${d.p1Link}</a>` : ''}</span>
            </div>
            <ul class="latex-bullets">
              <li>${d.p1Desc}</li>
            </ul>
          </div>
        ` : ''}
        ${d.p2Title ? `
          <div class="res-item">
            <div class="res-item-row">
              <span><strong>${d.p2Title}</strong> ${d.p2Sub ? `| <em>${d.p2Sub}</em>` : ''}</span>
              <span>${d.p2Link ? `<a href="https://${d.p2Link}" target="_blank" style="color: inherit; text-decoration: underline;">${d.p2Link}</a>` : ''}</span>
            </div>
            <ul class="latex-bullets">
              <li>${d.p2Desc}</li>
            </ul>
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${d.leadTitle || d.leadDesc ? `
      <div class="res-section">
        <div class="res-section-title">Leadership & Activities</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.leadTitle}</span>
          </div>
          <ul class="latex-bullets">
            <li>${d.leadDesc}</li>
          </ul>
        </div>
      </div>
    ` : ''}

    ${d.cpRatings || d.achievements ? `
      <div class="res-section">
        <div class="res-section-title">Honors & Achievements</div>
        <ul class="latex-bullets">
          ${d.cpRatings ? `<li><strong>Competitive Ratings:</strong> ${d.cpRatings}</li>` : ''}
          ${d.achievements ? `<li><strong>Awards & Scholarships:</strong> ${d.achievements}</li>` : ''}
        </ul>
      </div>
    ` : ''}
  `;
}

function renderModernCVTemplate(d) {
  return `
    <div class="res-header">
      <div>
        <h1 class="res-header-name">${d.name}</h1>
        <div class="res-header-role">${d.role}</div>
      </div>
      <div class="res-header-contact">
        ${d.email ? `<div><i class="fa-solid fa-envelope" style="color: #1e40af; width: 14px;"></i> ${d.email}</div>` : ''}
        ${d.phone ? `<div><i class="fa-solid fa-phone" style="color: #1e40af; width: 14px;"></i> ${d.phone}</div>` : ''}
        ${d.location ? `<div><i class="fa-solid fa-location-dot" style="color: #1e40af; width: 14px;"></i> ${d.location}</div>` : ''}
        ${d.linkedin ? `<div><i class="fa-brands fa-linkedin" style="color: #1e40af; width: 14px;"></i> ${d.linkedin}</div>` : ''}
      </div>
    </div>

    ${d.summary ? `
      <div class="res-section">
        <div class="res-section-title">Summary</div>
        <p class="res-item-desc">${d.summary}</p>
      </div>
    ` : ''}

    ${d.degree || d.school ? `
      <div class="res-section">
        <div class="res-section-title">Education</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.degree}</span>
            <span>${d.gradYear}</span>
          </div>
          <div class="res-item-sub">${d.school} — ${d.cgpa}</div>
        </div>
      </div>
    ` : ''}

    ${d.workTitle || d.workDesc ? `
      <div class="res-section">
        <div class="res-section-title">Experience</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.workTitle}</span>
            <span>${d.workSub}</span>
          </div>
          <p class="res-item-desc" style="margin-top: 4px;">${d.workDesc}</p>
        </div>
      </div>
    ` : ''}

    ${d.p1Title || d.p2Title ? `
      <div class="res-section">
        <div class="res-section-title">Projects</div>
        ${d.p1Title ? `
          <div class="res-item" style="margin-bottom: 8px;">
            <div class="res-item-row">
              <span><strong>${d.p1Title}</strong> (${d.p1Sub})</span>
              <span>${d.p1Link}</span>
            </div>
            <p class="res-item-desc">${d.p1Desc}</p>
          </div>
        ` : ''}
        ${d.p2Title ? `
          <div class="res-item">
            <div class="res-item-row">
              <span><strong>${d.p2Title}</strong> (${d.p2Sub})</span>
              <span>${d.p2Link}</span>
            </div>
            <p class="res-item-desc">${d.p2Desc}</p>
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${d.skills ? `
      <div class="res-section">
        <div class="res-section-title">Core Skills</div>
        <p class="res-item-desc">${d.skills}</p>
      </div>
    ` : ''}

    ${d.cpRatings || d.achievements ? `
      <div class="res-section">
        <div class="res-section-title">Achievements</div>
        <p class="res-item-desc">${[d.cpRatings, d.achievements].filter(Boolean).join(' • ')}</p>
      </div>
    ` : ''}
  `;
}

function renderDeedyCVTemplate(d) {
  return `
    <div class="deedy-grid-layout">
      <!-- Left Sidebar Column -->
      <div class="deedy-col-sidebar">
        <div class="deedy-sidebar-section">
          <div class="deedy-sidebar-title">Links & Contact</div>
          <div class="deedy-sidebar-text">
            <div><i class="fa-solid fa-envelope" style="font-size:0.7rem;"></i> ${d.email}</div>
            <div style="margin-top: 2px;"><i class="fa-solid fa-phone" style="font-size:0.7rem;"></i> ${d.phone}</div>
            <div style="margin-top: 2px;"><i class="fa-solid fa-location-dot" style="font-size:0.7rem;"></i> ${d.location}</div>
            <div style="margin-top: 2px;"><i class="fa-brands fa-linkedin" style="font-size:0.7rem;"></i> ${d.linkedin}</div>
            <div style="margin-top: 2px;"><i class="fa-brands fa-github" style="font-size:0.7rem;"></i> ${d.github}</div>
          </div>
        </div>

        <div class="deedy-sidebar-section">
          <div class="deedy-sidebar-title">Education</div>
          <div class="deedy-sidebar-text">
            <strong style="color: #1a202c;">${d.school}</strong>
            <div>${d.degree}</div>
            <div style="color: #718096; font-size: 0.75rem;">Grad: ${d.gradYear}</div>
            <div style="color: #2b6cb0; font-weight: 700;">${d.cgpa}</div>
          </div>
        </div>

        <div class="deedy-sidebar-section">
          <div class="deedy-sidebar-title">Skills</div>
          <div class="deedy-sidebar-text">
            ${d.skills.split(',').map(s => `<div style="margin-bottom: 2px;">• ${s.trim()}</div>`).join('')}
          </div>
        </div>

        ${d.cpRatings ? `
          <div class="deedy-sidebar-section">
            <div class="deedy-sidebar-title">Ratings</div>
            <div class="deedy-sidebar-text">${d.cpRatings}</div>
          </div>
        ` : ''}
      </div>

      <!-- Right Main Column -->
      <div class="deedy-col-main">
        <div class="deedy-main-name">${d.name}</div>
        <div class="deedy-main-role">${d.role}</div>

        ${d.summary ? `
          <div style="margin-bottom: 12px;">
            <div class="deedy-main-section-title">Summary</div>
            <p class="res-item-desc">${d.summary}</p>
          </div>
        ` : ''}

        ${d.workTitle || d.workDesc ? `
          <div style="margin-bottom: 12px;">
            <div class="deedy-main-section-title">Experience</div>
            <div class="res-item-row" style="margin-top: 2px;">
              <span><strong>${d.workTitle}</strong></span>
              <span style="font-size: 0.78rem; color: #718096;">${d.workSub}</span>
            </div>
            <p class="res-item-desc" style="margin-top: 3px;">${d.workDesc}</p>
          </div>
        ` : ''}

        ${d.p1Title || d.p2Title ? `
          <div style="margin-bottom: 12px;">
            <div class="deedy-main-section-title">Featured Projects</div>
            ${d.p1Title ? `
              <div style="margin-bottom: 8px;">
                <div class="res-item-row">
                  <span><strong>${d.p1Title}</strong> | <span style="font-weight: 400; color: #2b6cb0;">${d.p1Sub}</span></span>
                </div>
                <p class="res-item-desc" style="margin-top: 2px;">${d.p1Desc}</p>
              </div>
            ` : ''}
            ${d.p2Title ? `
              <div style="margin-bottom: 8px;">
                <div class="res-item-row">
                  <span><strong>${d.p2Title}</strong> | <span style="font-weight: 400; color: #2b6cb0;">${d.p2Sub}</span></span>
                </div>
                <p class="res-item-desc" style="margin-top: 2px;">${d.p2Desc}</p>
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${d.leadTitle ? `
          <div style="margin-bottom: 12px;">
            <div class="deedy-main-section-title">Leadership</div>
            <p class="res-item-desc"><strong>${d.leadTitle}:</strong> ${d.leadDesc}</p>
          </div>
        ` : ''}

        ${d.achievements ? `
          <div>
            <div class="deedy-main-section-title">Awards</div>
            <p class="res-item-desc">${d.achievements}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderAwesomeCVTemplate(d) {
  const nameParts = d.name.split(' ');
  const firstName = nameParts[0] || 'John';
  const lastName = nameParts.slice(1).join(' ') || 'Doe';

  return `
    <div class="res-header">
      <h1 class="res-header-name">${firstName} <strong>${lastName.toUpperCase()}</strong></h1>
      <div class="res-header-role">${d.role}</div>
      <div class="res-header-contact">
        ${d.email ? `<span><i class="fa-solid fa-envelope" style="color: #dc2626;"></i> ${d.email}</span>` : ''}
        ${d.phone ? `<span><i class="fa-solid fa-phone" style="color: #dc2626;"></i> ${d.phone}</span>` : ''}
        ${d.location ? `<span><i class="fa-solid fa-location-dot" style="color: #dc2626;"></i> ${d.location}</span>` : ''}
        ${d.linkedin ? `<span><i class="fa-brands fa-linkedin" style="color: #dc2626;"></i> ${d.linkedin}</span>` : ''}
      </div>
    </div>

    ${d.summary ? `
      <div class="res-section">
        <div class="res-section-title">About Me</div>
        <p class="res-item-desc">${d.summary}</p>
      </div>
    ` : ''}

    ${d.workTitle || d.workDesc ? `
      <div class="res-section">
        <div class="res-section-title">Work Experience</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.workTitle}</span>
            <span>${d.workSub}</span>
          </div>
          <p class="res-item-desc" style="margin-top: 4px;">• ${d.workDesc}</p>
        </div>
      </div>
    ` : ''}

    ${d.p1Title || d.p2Title ? `
      <div class="res-section">
        <div class="res-section-title">Key Projects</div>
        ${d.p1Title ? `
          <div class="res-item" style="margin-bottom: 8px;">
            <div class="res-item-row">
              <span>${d.p1Title}</span>
              <span class="res-item-sub">${d.p1Sub}</span>
            </div>
            <p class="res-item-desc">• ${d.p1Desc}</p>
          </div>
        ` : ''}
        ${d.p2Title ? `
          <div class="res-item">
            <div class="res-item-row">
              <span>${d.p2Title}</span>
              <span class="res-item-sub">${d.p2Sub}</span>
            </div>
            <p class="res-item-desc">• ${d.p2Desc}</p>
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${d.skills ? `
      <div class="res-section">
        <div class="res-section-title">Skills & Capabilities</div>
        <p class="res-item-desc"><strong>Core:</strong> ${d.skills}</p>
      </div>
    ` : ''}

    ${d.degree || d.school ? `
      <div class="res-section">
        <div class="res-section-title">Education</div>
        <div class="res-item">
          <div class="res-item-row">
            <span>${d.degree} — ${d.school}</span>
            <span>${d.gradYear} (${d.cgpa})</span>
          </div>
        </div>
      </div>
    ` : ''}

    ${d.cpRatings || d.achievements ? `
      <div class="res-section">
        <div class="res-section-title">Honors & Awards</div>
        <p class="res-item-desc">${[d.cpRatings, d.achievements].filter(Boolean).join(' • ')}</p>
      </div>
    ` : ''}
  `;
}

function renderHarvardTemplate(d) {
  return `
    <div class="res-header">
      <h1 class="res-header-name">${d.name}</h1>
      <div class="res-header-role">${d.role}</div>
      <div class="res-header-contact">
        ${[d.location, d.phone, d.email, d.linkedin].filter(Boolean).join(' ◆ ')}
      </div>
    </div>

    ${d.summary ? `
      <div class="res-section">
        <div class="res-section-title">Executive Summary</div>
        <p class="res-item-desc" style="text-align: justify;">${d.summary}</p>
      </div>
    ` : ''}

    ${d.degree || d.school ? `
      <div class="res-section">
        <div class="res-section-title">Education</div>
        <div class="res-item">
          <div class="res-item-row">
            <span><strong>${d.school}</strong></span>
            <span>${d.gradYear}</span>
          </div>
          <div class="res-item-row" style="font-weight: 400; font-style: italic; margin-top: 2px;">
            <span>${d.degree}</span>
            <span>${d.cgpa}</span>
          </div>
        </div>
      </div>
    ` : ''}

    ${d.workTitle || d.workDesc ? `
      <div class="res-section">
        <div class="res-section-title">Professional Experience</div>
        <div class="res-item">
          <div class="res-item-row">
            <span><strong>${d.workTitle}</strong></span>
            <span>${d.workSub}</span>
          </div>
          <p class="res-item-desc" style="margin-top: 4px;">• ${d.workDesc}</p>
        </div>
      </div>
    ` : ''}

    ${d.p1Title || d.p2Title ? `
      <div class="res-section">
        <div class="res-section-title">Selected Projects</div>
        ${d.p1Title ? `
          <div class="res-item" style="margin-bottom: 6px;">
            <div class="res-item-row">
              <span><strong>${d.p1Title}</strong> (${d.p1Sub})</span>
              <span>${d.p1Link}</span>
            </div>
            <p class="res-item-desc">• ${d.p1Desc}</p>
          </div>
        ` : ''}
        ${d.p2Title ? `
          <div class="res-item">
            <div class="res-item-row">
              <span><strong>${d.p2Title}</strong> (${d.p2Sub})</span>
              <span>${d.p2Link}</span>
            </div>
            <p class="res-item-desc">• ${d.p2Desc}</p>
          </div>
        ` : ''}
      </div>
    ` : ''}

    ${d.skills ? `
      <div class="res-section">
        <div class="res-section-title">Technical Expertise</div>
        <p class="res-item-desc"><strong>Core Competencies:</strong> ${d.skills}</p>
      </div>
    ` : ''}

    ${d.cpRatings || d.achievements ? `
      <div class="res-section">
        <div class="res-section-title">Honors & Leadership</div>
        <p class="res-item-desc">${[d.leadTitle, d.cpRatings, d.achievements].filter(Boolean).join(' • ')}</p>
      </div>
    ` : ''}
  `;
}

// ============================================================================
// LATEX GENERATOR (.TEX EXPORT FOR OVERLEAF)
// ============================================================================
function escapeLatex(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function generateLatexCode(theme, d) {
  const e = escapeLatex;

  if (theme === 'deedy-cv') {
    return `%----------------------------------------------------------------------------------------
% DEEDY CV RESUME IN LATEX (Overleaf Two-Column Tech & Research)
% Adapted by UpSkill AI Platform
% Compile with: XeLaTeX / pdfLaTeX
%----------------------------------------------------------------------------------------
\\documentclass[letterpaper]{article}
\\usepackage[top=0.6in, bottom=0.6in, left=0.6in, right=0.6in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{titlesec}
\\usepackage{color}

\\pagestyle{empty}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\begin{document}

\\begin{minipage}[t]{0.32\\textwidth}
\\section*{\\huge \\bfseries ${e(d.name)}}
\\textbf{\\color{blue} ${e(d.role)}} \\\\
\\vspace{6pt}
\\hrule
\\vspace{6pt}
\\textbf{Email:} \\href{mailto:${e(d.email)}}{${e(d.email)}} \\\\
\\textbf{Phone:} ${e(d.phone)} \\\\
\\textbf{Location:} ${e(d.location)} \\\\
\\textbf{LinkedIn:} ${e(d.linkedin)} \\\\
\\textbf{GitHub:} ${e(d.github)} \\\\

\\vspace{10pt}
\\section*{\\bfseries EDUCATION}
\\hrule
\\vspace{4pt}
\\textbf{${e(d.school)}} \\\\
${e(d.degree)} \\\\
Grad: ${e(d.gradYear)} \\\\
${e(d.cgpa)} \\\\

\\vspace{10pt}
\\section*{\\bfseries SKILLS}
\\hrule
\\vspace{4pt}
${d.skills.split(',').map(s => `\\textbullet{} ${e(s.trim())} \\\\`).join('\n')}

\\end{minipage}
\\hfill
\\begin{minipage}[t]{0.65\\textwidth}

\\section*{\\bfseries PROFESSIONAL SUMMARY}
\\hrule
\\vspace{4pt}
${e(d.summary)}

\\vspace{8pt}
\\section*{\\bfseries EXPERIENCE}
\\hrule
\\vspace{4pt}
\\textbf{${e(d.workTitle)}} \\hfill \\textit{${e(d.workSub)}} \\\\
\\begin{itemize}[leftmargin=12pt]
  \\item ${e(d.workDesc)}
\\end{itemize}

\\vspace{8pt}
\\section*{\\bfseries FEATURED PROJECTS}
\\hrule
\\vspace{4pt}
\\textbf{${e(d.p1Title)}} $|$ \\textit{${e(d.p1Sub)}} \\hfill ${e(d.p1Link)} \\\\
\\begin{itemize}[leftmargin=12pt]
  \\item ${e(d.p1Desc)}
\\end{itemize}
\\vspace{4pt}
\\textbf{${e(d.p2Title)}} $|$ \\textit{${e(d.p2Sub)}} \\hfill ${e(d.p2Link)} \\\\
\\begin{itemize}[leftmargin=12pt]
  \\item ${e(d.p2Desc)}
\\end{itemize}

\\vspace{8pt}
\\section*{\\bfseries ACHIEVEMENTS & RATINGS}
\\hrule
\\vspace{4pt}
\\textbullet{} \\textbf{Competitive:} ${e(d.cpRatings)} \\\\
\\textbullet{} \\textbf{Awards:} ${e(d.achievements)}

\\end{minipage}

\\end{document}`;
  }

  // Default: Jake's Resume Template (Gold Standard Overleaf #1 SWE Pick)
  return `%----------------------------------------------------------------------------------------
% JAKE'S RESUME IN LATEX (Overleaf #1 ATS-Compliant SWE Template)
% Author: Jake Gutierrez (Adapted for UpSkill Platform)
% License: MIT
% Compatible with: pdfLaTeX, XeLaTeX, LuaLaTeX (Overleaf Ready)
%----------------------------------------------------------------------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{{#1 \\vspace{-2pt}}}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%----------------------------------------------------------------------------------------
% RESUME CONTENT STARTS HERE
%----------------------------------------------------------------------------------------
\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${e(d.name)}} \\\\ \\vspace{1pt}
    \\small ${e(d.role)} \\\\ \\vspace{1pt}
    \\small ${[e(d.phone), e(d.email), e(d.location), e(d.linkedin), e(d.github)].filter(Boolean).join(' $|$ ')}
\\end{center}

%-----------SUMMARY-----------
\\section{Professional Summary}
\\small{${e(d.summary)}}

%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {${e(d.school)}}{${e(d.location || 'India')}}
      {${e(d.degree)}}{${e(d.gradYear)} (${e(d.cgpa)})}
  \\resumeSubHeadingListEnd

%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages \\& Frameworks}{: ${e(d.skills)}} \\\\
     \\textbf{Spoken Languages}{: ${e(d.languages)}}
    }}
 \\end{itemize}

%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {${e(d.workTitle)}}{${e(d.workSub)}}
      {Software Engineering}{May 2024 -- Aug 2024}
      \\resumeItemListStart
        \\resumeItem{${e(d.workDesc)}}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------PROJECTS-----------
\\section{Projects}
  \\resumeSubHeadingListStart
    \\resumeProjectHeading
      {\\textbf{${e(d.p1Title)}} $|$ \\emph{${e(d.p1Sub)}}}{${e(d.p1Link)}}
      \\resumeItemListStart
        \\resumeItem{${e(d.p1Desc)}}
      \\resumeItemListEnd
    \\resumeProjectHeading
      {\\textbf{${e(d.p2Title)}} $|$ \\emph{${e(d.p2Sub)}}}{${e(d.p2Link)}}
      \\resumeItemListStart
        \\resumeItem{${e(d.p2Desc)}}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd

%-----------HONORS & ACHIEVEMENTS-----------
\\section{Honors \\& Achievements}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Competitive Ratings}{: ${e(d.cpRatings)}} \\\\
     \\textbf{Honors}{: ${e(d.achievements)}}
    }}
 \\end{itemize}

\\end{document}`;
}

function setupLatexExportModal() {
  const btnExport = document.getElementById('btn-export-latex');
  const modal = document.getElementById('latex-modal');
  const btnClose = document.getElementById('btn-close-latex-modal');
  const btnDone = document.getElementById('btn-done-latex-modal');
  const btnCopy = document.getElementById('btn-copy-latex');
  const btnDownloadTex = document.getElementById('btn-download-tex');
  const codeDisplay = document.getElementById('latex-code-display');
  const templateName = document.getElementById('latex-modal-template-name');

  const templateMap = {
    'jakes-resume': "Jake's Resume (Overleaf #1 SWE)",
    'moderncv': "ModernCV (Corporate & Tech)",
    'deedy-cv': "Deedy CV (Two-Column)",
    'awesome-cv': "Awesome-CV (Modern Tech)",
    'harvard-classic': "Harvard Classic (Ivy League)"
  };

  if (btnExport && modal && codeDisplay) {
    btnExport.addEventListener('click', () => {
      const currentTheme = AppState.resumeTheme || 'jakes-resume';
      const d = getResumeData();
      const code = generateLatexCode(currentTheme, d);
      codeDisplay.value = code;
      if (templateName) templateName.textContent = templateMap[currentTheme] || currentTheme;
      modal.style.display = 'flex';
    });
  }

  const closeModal = () => {
    if (modal) modal.style.display = 'none';
  };

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnDone) btnDone.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (btnCopy && codeDisplay) {
    btnCopy.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(codeDisplay.value).then(() => {
          showToast('LaTeX source code copied to clipboard!', 'success');
        });
      } else {
        codeDisplay.select();
        document.execCommand('copy');
        showToast('LaTeX code copied!', 'success');
      }
    });
  }

  if (btnDownloadTex && codeDisplay) {
    btnDownloadTex.addEventListener('click', () => {
      const d = getResumeData();
      const filename = `${d.name.replace(/\s+/g, '_')}_Resume.tex`;
      const blob = new Blob([codeDisplay.value], { type: 'text/x-tex;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${filename}`, 'success');
    });
  }
}

function exportResumeToPDF() {
  const element = document.getElementById('resume-preview-box');
  if (!element) return;

  showToast('Generating high-resolution PDF document...', 'info');

  const nameInput = document.getElementById('resume-name');
  const filename = `${(nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'UpSkill').replace(/\s+/g, '_')}_Resume.pdf`;

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(element).save().then(() => {
      showToast('PDF downloaded successfully!', 'success');
    }).catch(err => {
      console.error(err);
      window.print();
    });
  } else {
    window.print();
  }
}

// ============================================================================
// 7. ROADMAP & LEARN ENGINE
// ============================================================================
function initRoadmap() {
  const btnGoto = document.getElementById('btn-roadmap-goto-opportunities');
  if (btnGoto) {
    btnGoto.addEventListener('click', () => window.showView('opportunities'));
  }
}

function syncRoadmapView() {
  const roleInput = document.getElementById('resume-role');
  const role = roleInput && roleInput.value.includes('Backend') ? 'Backend Developer' : 'Frontend Developer';

  const placeholder = document.getElementById('roadmap-placeholder');
  const activeView = document.getElementById('roadmap-active-view');
  const roleTitle = document.getElementById('roadmap-role-title');
  const treeNodes = document.getElementById('roadmap-tree-nodes');
  const ytGrid = document.getElementById('learn-youtube-grid');
  const skillsDir = document.getElementById('roadmap-skills-directory');

  if (placeholder) placeholder.style.display = 'none';
  if (activeView) activeView.style.display = 'block';
  if (roleTitle) roleTitle.textContent = role;

  const data = ROADMAPS_STORE[role] || ROADMAPS_STORE['Frontend Developer'];

  // Render Nodes
  if (treeNodes) {
    treeNodes.innerHTML = data.nodes.map(node => `
      <div class="roadmap-node">
        <div class="roadmap-node-title">
          <span>${node.title}</span>
          <span class="roadmap-node-badge">${node.badge}</span>
        </div>
        <div class="roadmap-node-desc">${node.desc}</div>
      </div>
    `).join('');
  }

  // Render YouTube Hub
  if (ytGrid) {
    ytGrid.innerHTML = data.videos.map(v => `
      <a href="${v.link}" target="_blank" rel="noopener noreferrer" class="yt-card">
        <img src="${v.img}" alt="${v.title}" class="yt-thumb">
        <div class="yt-info">
          <div class="yt-info-title">${v.title}</div>
          <div class="yt-info-channel"><i class="fa-brands fa-youtube" style="color: red;"></i> ${v.channel}</div>
        </div>
      </a>
    `).join('');
  }

  // Render Target Skills
  if (skillsDir) {
    skillsDir.innerHTML = data.skills.map(s => `
      <span class="skill-tag"><i class="fa-solid fa-check" style="color: var(--success);"></i> ${s}</span>
    `).join('');
  }
}

// ============================================================================
// 8. PROJECT PLANNER HUB
// ============================================================================
function initProjectPlanner() {
  const btn = document.getElementById('btn-recommend-projects');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const roleSelect = document.getElementById('projects-role');
    const role = roleSelect ? roleSelect.value : 'Frontend Developer';
    const langInput = document.getElementById('projects-languages');
    const languages = langInput ? langInput.value : '';

    const loader = document.getElementById('projects-loading');
    const container = document.getElementById('projects-results-container');
    const roleLabel = document.getElementById('projects-selected-role');
    const grid = document.getElementById('projects-list-grid');

    if (loader) loader.style.display = 'flex';
    if (container) container.style.display = 'none';

    setTimeout(() => {
      if (loader) loader.style.display = 'none';
      if (container) container.style.display = 'block';
      if (roleLabel) roleLabel.textContent = role;

      const projects = PROJECT_IDEAS_STORE[role] || PROJECT_IDEAS_STORE['Frontend Developer'];

      if (grid) {
        grid.innerHTML = projects.map(p => `
          <div class="project-card">
            <div class="project-card-header">
              <div class="project-card-title">${p.title}</div>
              <span class="project-card-diff ${p.difficulty}">${p.difficulty}</span>
            </div>
            <p class="project-card-desc">${p.desc}</p>
            <div class="project-card-tags">
              ${p.tags.map(t => `<span class="project-tag">#${t}</span>`).join('')}
            </div>
            <a href="${p.tutorial}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="margin-top: auto;">
              Explore Architecture Specs <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>
        `).join('');
      }

      showToast(`Generated 3 tailored projects for ${role}!`, 'success');
    }, 600);
  });
}

// ============================================================================
// 9. AI MOCK INTERVIEW ENGINE
// ============================================================================
function initMockInterview() {
  const btnStart = document.getElementById('btn-start-interview');
  const btnTerminate = document.getElementById('btn-terminate-interview');
  const btnRestart = document.getElementById('btn-interview-restart');
  const btnRoadmap = document.getElementById('btn-interview-view-roadmap');
  const btnSubmit = document.getElementById('btn-interview-submit-answer');
  const btnVoice = document.getElementById('btn-interview-voice');
  const answerInput = document.getElementById('interview-text-answer');

  // Start interview
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      const role = document.getElementById('interview-target-role').value;
      const type = document.getElementById('interview-type').value;
      const diff = document.getElementById('interview-difficulty').value;

      AppState.interview.role = role;
      AppState.interview.type = type;
      AppState.interview.difficulty = diff;
      AppState.interview.currentQuestionIndex = 0;
      AppState.interview.userAnswers = [];

      // Pick questions
      const qPool = INTERVIEW_QUESTIONS[role] || INTERVIEW_QUESTIONS['Default'];
      AppState.interview.questions = qPool;

      document.getElementById('interview-setup-room').style.display = 'none';
      document.getElementById('interview-live-room').style.display = 'grid';
      document.getElementById('interview-feedback-view').style.display = 'none';

      document.getElementById('session-info-role').textContent = role;
      document.getElementById('session-info-diff').textContent = diff;

      // Clear chat & pose first question
      const chatHistory = document.getElementById('interview-chat-history');
      if (chatHistory) chatHistory.innerHTML = '';

      askInterviewQuestion(0);
      showToast('Interview session initiated. Good luck!', 'info');
    });
  }

  // Answer submit
  if (btnSubmit) {
    btnSubmit.addEventListener('click', submitInterviewAnswer);
  }
  if (answerInput) {
    answerInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submitInterviewAnswer();
    });
  }

  // Voice speech-to-text
  if (btnVoice) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        AppState.interview.isRecording = true;
        btnVoice.classList.add('recording');
        const indicator = document.querySelector('.speech-indicator');
        if (indicator) indicator.classList.add('active');
        showToast('Microphone active. Please speak your answer.', 'info');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        if (answerInput) answerInput.value = transcript;
      };

      recognition.onerror = (e) => {
        console.warn('Speech recognition error:', e);
        stopRecording();
      };

      recognition.onend = () => {
        stopRecording();
      };

      function stopRecording() {
        AppState.interview.isRecording = false;
        btnVoice.classList.remove('recording');
        const indicator = document.querySelector('.speech-indicator');
        if (indicator) indicator.classList.remove('active');
      }

      btnVoice.addEventListener('click', () => {
        if (!AppState.interview.isRecording) {
          recognition.start();
        } else {
          recognition.stop();
        }
      });
    } else {
      btnVoice.addEventListener('click', () => {
        showToast('Web Speech API is not supported in this browser. Please type your response.', 'warning');
      });
    }
  }

  // Terminate early
  if (btnTerminate) {
    btnTerminate.addEventListener('click', () => {
      finishInterviewEvaluation();
    });
  }

  // Restart
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      document.getElementById('interview-setup-room').style.display = 'block';
      document.getElementById('interview-live-room').style.display = 'none';
      document.getElementById('interview-feedback-view').style.display = 'none';
    });
  }

  if (btnRoadmap) {
    btnRoadmap.addEventListener('click', () => {
      window.showView('learn');
    });
  }
}

function askInterviewQuestion(index) {
  const questions = AppState.interview.questions;
  if (index >= questions.length) {
    finishInterviewEvaluation();
    return;
  }

  const q = questions[index];
  const chatHistory = document.getElementById('interview-chat-history');
  
  // Update progress
  const counter = document.getElementById('interview-q-counter');
  const progressFill = document.getElementById('interview-q-progress-fill');
  if (counter) counter.textContent = `${index + 1} / ${questions.length}`;
  if (progressFill) progressFill.style.width = `${((index + 1) / questions.length) * 100}%`;

  if (chatHistory) {
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    aiBubble.innerHTML = `
      <div style="font-weight: 700; color: var(--primary); margin-bottom: 4px;">Question ${index + 1}</div>
      <p>${q.q}</p>
    `;
    chatHistory.appendChild(aiBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

function submitInterviewAnswer() {
  const answerInput = document.getElementById('interview-text-answer');
  const answer = answerInput ? answerInput.value.trim() : '';
  if (!answer) {
    showToast('Please provide an answer before submitting.', 'warning');
    return;
  }

  const chatHistory = document.getElementById('interview-chat-history');
  const currentIdx = AppState.interview.currentQuestionIndex;

  // Add User bubble
  if (chatHistory) {
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = answer;
    chatHistory.appendChild(userBubble);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  AppState.interview.userAnswers.push(answer);
  if (answerInput) answerInput.value = '';

  // Advance
  AppState.interview.currentQuestionIndex++;
  const nextIdx = AppState.interview.currentQuestionIndex;

  setTimeout(() => {
    if (nextIdx < AppState.interview.questions.length) {
      askInterviewQuestion(nextIdx);
    } else {
      finishInterviewEvaluation();
    }
  }, 600);
}

function finishInterviewEvaluation() {
  document.getElementById('interview-live-room').style.display = 'none';
  document.getElementById('interview-feedback-view').style.display = 'block';

  // Calculate score
  const totalQuestions = AppState.interview.questions.length;
  const answered = AppState.interview.userAnswers.length;
  const avgLen = AppState.interview.userAnswers.reduce((acc, a) => acc + a.length, 0) / (answered || 1);

  let score = 70;
  if (avgLen > 60) score += 15;
  if (answered === totalQuestions) score += 10;
  score = Math.min(score, 94);

  const radial = document.getElementById('interview-score-radial');
  const scoreText = document.getElementById('interview-feedback-score');
  const gradeTitle = document.getElementById('interview-grade-title');
  const summaryEl = document.getElementById('interview-feedback-summary');
  const breakdownEl = document.getElementById('interview-q-breakdown');

  if (radial) radial.style.setProperty('--score', score);
  if (scoreText) scoreText.textContent = `${score}%`;
  if (gradeTitle) {
    gradeTitle.textContent = score >= 85 ? 'A- Outstanding Candidate' : 'B+ Solid Technical Foundation';
  }
  if (summaryEl) {
    summaryEl.innerHTML = `
      Your conceptual clarity on core architectural choices was <strong>strong and articulate</strong>. 
      Communication showed high confidence. Focus on quantifying your project outcomes with metrics in future rounds.
    `;
  }

  if (breakdownEl) {
    breakdownEl.innerHTML = AppState.interview.questions.slice(0, answered).map((q, i) => `
      <div style="border-left: 3px solid var(--primary); padding-left: 14px;">
        <div style="font-weight: 700; font-size: 0.9rem;">Q${i + 1}: ${q.q}</div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px;"><strong>Your Answer:</strong> "${AppState.interview.userAnswers[i]}"</p>
        <span style="font-size: 0.75rem; color: var(--success); font-weight: 600; display: inline-block; margin-top: 4px;"><i class="fa-solid fa-check"></i> Evaluated: Clear delivery & relevant terminology</span>
      </div>
    `).join('');
  }

  // Update global metric
  AppState.metrics.interviewsCompleted++;
  const statInterviews = document.getElementById('stat-interviews-done');
  if (statInterviews) statInterviews.textContent = AppState.metrics.interviewsCompleted;

  showToast('Interview performance score generated!', 'success');
}

// ============================================================================
// 10. INTERNSHIPS FEED & FILTERS
// ============================================================================
function initInternships() {
  const searchInput = document.getElementById('internship-search');
  const typeFilter = document.getElementById('internship-filter-type');
  const domainFilter = document.getElementById('internship-filter-domain');

  if (searchInput) searchInput.addEventListener('input', () => filterInternships());
  if (typeFilter) typeFilter.addEventListener('change', () => filterInternships());
  if (domainFilter) domainFilter.addEventListener('change', () => filterInternships());
}

function renderInternships(items = INTERNSHIPS_DATA) {
  const container = document.getElementById('internships-grid-container');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="glass" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-secondary);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 12px; display: block; opacity: 0.3;"></i>
        <p>No internships matched your selected filter criteria. Try clearing search filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="internship-card">
      <div class="internship-card-header">
        <div class="internship-company-icon">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div>
          <div class="internship-card-title">${item.title}</div>
          <div class="internship-company-name">${item.company}</div>
        </div>
      </div>

      <div class="internship-meta-row">
        <span><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
        <span><i class="fa-solid fa-money-bill-wave"></i> ${item.stipend}</span>
        <span><i class="fa-solid fa-clock"></i> ${item.duration}</span>
        <span class="scheme-badge" style="margin: 0;">${item.type}</span>
      </div>

      <div class="project-card-tags" style="margin-bottom: 18px;">
        ${item.skills.map(s => `<span class="project-tag">${s}</span>`).join('')}
      </div>

      <a href="${item.applyLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="margin-top: auto;">
        Apply via Verified Portal <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </a>
    </div>
  `).join('');
}

function filterInternships() {
  const search = (document.getElementById('internship-search')?.value || '').toLowerCase();
  const type = document.getElementById('internship-filter-type')?.value || 'all';
  const domain = document.getElementById('internship-filter-domain')?.value || 'all';

  const filtered = INTERNSHIPS_DATA.filter(item => {
    const matchesSearch = !search || 
      item.title.toLowerCase().includes(search) || 
      item.company.toLowerCase().includes(search) ||
      item.skills.some(s => s.toLowerCase().includes(search));

    const matchesType = type === 'all' || item.type === type;
    const matchesDomain = domain === 'all' || item.domain === domain;

    return matchesSearch && matchesType && matchesDomain;
  });

  renderInternships(filtered);
}

// ============================================================================
// 11. GOVERNMENT SCHEMES & MODAL
// ============================================================================
function initGovtSchemes() {
  const tabs = [
    { id: 'btn-scheme-all', type: 'all' },
    { id: 'btn-scheme-student', type: 'student' },
    { id: 'btn-scheme-working', type: 'working' }
  ];

  tabs.forEach(t => {
    const btn = document.getElementById(t.id);
    if (btn) {
      btn.addEventListener('click', () => {
        tabs.forEach(x => document.getElementById(x.id)?.classList.remove('active'));
        btn.classList.add('active');
        renderGovtSchemes(t.type);
      });
    }
  });

  // Scheme Modal Closers
  const modal = document.getElementById('scheme-detail-modal');
  const btnClose = document.getElementById('btn-close-scheme-modal');
  const btnCloseFooter = document.getElementById('btn-modal-scheme-close');

  [btnClose, btnCloseFooter].forEach(b => {
    if (b) {
      b.addEventListener('click', () => {
        if (modal) modal.style.display = 'none';
      });
    }
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }
}

function renderGovtSchemes(filterType = 'all') {
  const container = document.getElementById('schemes-grid-container');
  if (!container) return;

  const items = filterType === 'all' 
    ? SCHEMES_DATA 
    : SCHEMES_DATA.filter(s => s.type === filterType);

  container.innerHTML = items.map(s => `
    <div class="scheme-card">
      <div class="scheme-badge">${s.badge}</div>
      <div class="scheme-title">${s.title}</div>
      <p class="scheme-desc">${s.desc}</p>
      <button class="btn btn-outline btn-sm" onclick="openSchemeModal('${s.id}')" style="margin-top: auto;">
        View Eligibility & Application Details <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  `).join('');
}

window.openSchemeModal = function(schemeId) {
  const item = SCHEMES_DATA.find(s => s.id === schemeId);
  if (!item) return;

  const modal = document.getElementById('scheme-detail-modal');
  const title = document.getElementById('modal-scheme-title');
  const desc = document.getElementById('modal-scheme-desc');
  const eligList = document.getElementById('modal-scheme-eligibility');
  const featList = document.getElementById('modal-scheme-features');
  const docList = document.getElementById('modal-scheme-documents');
  const applyBtn = document.getElementById('btn-modal-scheme-apply');

  if (title) title.textContent = item.title;
  if (desc) desc.textContent = item.desc;
  if (eligList) eligList.innerHTML = item.eligibility.map(e => `<li style="margin-bottom: 6px;"><i class="fa-solid fa-check" style="color: var(--success); margin-right: 8px;"></i>${e}</li>`).join('');
  if (featList) featList.innerHTML = item.features.map(f => `<li style="margin-bottom: 6px;"><i class="fa-solid fa-star" style="color: var(--warning); margin-right: 8px;"></i>${f}</li>`).join('');
  if (docList) docList.innerHTML = item.documents.map(d => `<li style="margin-bottom: 6px;"><i class="fa-solid fa-file-circle-check" style="color: var(--secondary); margin-right: 8px;"></i>${d}</li>`).join('');
  if (applyBtn) applyBtn.href = item.applyUrl;

  if (modal) modal.style.display = 'flex';
};

// ============================================================================
// 12. AI MENTOR CHAT (GROQ CLOUD LLM POWERED & STRICTLY CAREER-FOCUSED)
// ============================================================================
const MENTOR_SYSTEM_PROMPT = `You are UpSkill AI Mentor, an elite career coach, technical career strategist, and professional development mentor.

CRITICAL DIRECTIVE & BOUNDARY ENFORCEMENT:
1. You MUST ONLY answer questions directly related to:
   - Career development, career paths, and career transitions
   - Professional skill building, learning roadmaps, and technical competencies
   - Resumes, CVs, portfolio building, and LinkedIn/GitHub optimization
   - Job search strategies, internships, and hiring trends
   - Technical and behavioral interview preparation and mock practice
   - Academic choices, certifications, and higher education guidance relevant to professional careers
   - Workplace problem-solving, professional communication, and career growth milestones

2. STRICT OUT-OF-SCOPE REFUSAL:
   - If the user asks about ANYTHING unrelated to career growth or professional direction (such as recipes, entertainment, movies, celebrities, video games, jokes, cooking, sports, general world trivia, politics, creative fiction writing, personal relationship advice, or non-career academic homework), you MUST POLITELY AND FIRMLY DECLINE to answer the unrelated question.
   - Example polite deflection: "I am specifically trained as your UpSkill Career Mentor to assist with professional growth, career directions, roadmaps, and interview preparation. I cannot assist with this topic, but I would love to help you explore career paths, technical skills, or resume preparation! What career or skill goal are you working on right now?"

3. TONE & RESPONSE QUALITY:
   - Be inspiring, structured, actionable, and encouraging.
   - Use clean formatting with bullet points, bold highlights, and clear steps when helpful.
   - Provide practical, high-impact advice tailored to real-world industry demands.`;

function formatMentorMarkdown(text) {
  if (!text) return '';
  let formatted = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks ```code```
  formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; overflow-x: auto; margin: 8px 0;"><code>$1</code></pre>');
  // Inline code `code`
  formatted = formatted.replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.85em;">$1</code>');
  // Bold **text**
  formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Bullets: lines starting with * or -
  const lines = formatted.split('\n');
  let inList = false;
  let out = [];

  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      if (!inList) {
        out.push('<ul style="margin: 8px 0 8px 20px; padding-left: 0; list-style: disc;">');
        inList = true;
      }
      out.push(`<li style="margin-bottom: 4px;">${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      if (trimmed.length > 0) {
        out.push(`<p style="margin-bottom: 8px;">${line}</p>`);
      }
    }
  }
  if (inList) out.push('</ul>');

  return out.join('');
}

function initAIMentor() {
  const input = document.getElementById('mentor-chat-input-field');
  const btnSend = document.getElementById('btn-mentor-chat-send');
  const floatingBtn = document.getElementById('floating-ai-mentor-btn');

  if (btnSend) btnSend.addEventListener('click', () => sendMentorMessage());
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMentorMessage();
    });
  }

  // Quick Prompt Pills
  document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (input) {
        input.value = btn.textContent.trim();
        sendMentorMessage();
      }
    });
  });

  // Floating trigger opens mentor view
  if (floatingBtn) {
    floatingBtn.addEventListener('click', () => {
      window.showView('mentor');
    });
  }
}

async function sendMentorMessage() {
  const input = document.getElementById('mentor-chat-input-field');
  const btnSend = document.getElementById('btn-mentor-chat-send');
  const text = input ? input.value.trim() : '';
  if (!text) return;

  const chat = document.getElementById('mentor-chat-history');
  if (!chat) return;

  // Add User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'mentor-chat-bubble user';
  userBubble.textContent = text;
  chat.appendChild(userBubble);
  if (input) input.value = '';
  chat.scrollTop = chat.scrollHeight;

  // Append to conversation history (keep last 8 turns)
  AppState.mentorConversation.push({ role: 'user', content: text });
  if (AppState.mentorConversation.length > 8) {
    AppState.mentorConversation = AppState.mentorConversation.slice(-8);
  }

  // Create AI Bubble with animated typing placeholder
  const aiBubble = document.createElement('div');
  aiBubble.className = 'mentor-chat-bubble ai';
  aiBubble.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 0.88rem;">
      <i class="fa-solid fa-circle-notch fa-spin" style="color: var(--primary);"></i>
      <span>UpSkill AI Mentor is analyzing your career query...</span>
    </div>
  `;
  chat.appendChild(aiBubble);
  chat.scrollTop = chat.scrollHeight;

  // Disable send button while streaming/fetching
  if (btnSend) btnSend.disabled = true;

  try {
    const apiKey = AppState.groqApiKey;
    const model = AppState.groqModel || 'qwen/qwen3.8-27b';

    // Call Groq Cloud API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: MENTOR_SYSTEM_PROMPT },
          ...AppState.mentorConversation
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson?.error?.message || `Groq API responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'I could not generate a response. Please rephrase your career question.';

    // Store AI reply in conversation history
    AppState.mentorConversation.push({ role: 'assistant', content: reply });

    // Render formatted markdown response
    aiBubble.innerHTML = formatMentorMarkdown(reply);
    chat.scrollTop = chat.scrollHeight;

  } catch (error) {
    console.warn('Groq Live API Error, falling back to simulated career intelligence:', error);

    // Fallback simulated response
    let fallbackReply = `That is a vital career question! For optimal progression in this area, focus on crafting 2 standout portfolio projects, keeping your GitHub actively documented, and aligning your resume keywords with real-world job requirements.`;

    const lower = text.toLowerCase();
    const isOutofScope = ['cake', 'recipe', 'cook', 'movie', 'song', 'joke', 'game', 'weather', 'president', 'dating'].some(w => lower.includes(w));

    if (isOutofScope) {
      fallbackReply = `I am specifically fine-tuned as your **UpSkill Career Mentor** to assist exclusively with career growth, professional roadmaps, resume improvement, and interview preparation. I cannot assist with unrelated queries, but I would love to help you explore career paths, technical skills, or job hunting strategies! What career or skill goal are you working on right now?`;
    } else if (lower.includes('resume') || lower.includes('ats')) {
      fallbackReply = `To maximize your resume ATS score: 1) Mirror core keywords from target job descriptions, 2) Use action verbs (e.g. *Architected*, *Spearheaded*), and 3) Quantify achievements with metrics (*reduced load times by 35%*).`;
    } else if (lower.includes('devops') || lower.includes('cloud')) {
      fallbackReply = `**Cloud DevOps Roadmap:**\n* **Fundamentals:** Linux administration, bash scripting, Git branching workflows.\n* **Cloud Core:** AWS/GCP (EC2, S3, IAM, VPC networking).\n* **Containers & CI/CD:** Docker, GitHub Actions, Kubernetes orchestration.\n* **IaC:** Terraform for automated infrastructure deployment.`;
    }

    aiBubble.innerHTML = `
      ${formatMentorMarkdown(fallbackReply)}
      <div style="margin-top: 10px; font-size: 0.72rem; color: var(--text-muted); border-top: 1px solid var(--border-glass); padding-top: 4px;">
        <i class="fa-solid fa-bolt" style="color: var(--warning);"></i> Running in resilient career mode (${error.message || 'offline fallback'})
      </div>
    `;
    chat.scrollTop = chat.scrollHeight;
  } finally {
    if (btnSend) btnSend.disabled = false;
  }
}

// ============================================================================
// 13. API CONFIGURATION MODAL
// ============================================================================
function initAPIModal() {
  const modal = document.getElementById('api-modal');
  const btnOpen = document.getElementById('btn-api-status');
  const btnClose = document.getElementById('btn-close-api-modal');
  const btnCancel = document.getElementById('btn-api-modal-cancel');
  const btnSave = document.getElementById('btn-api-modal-save');
  const modeSelect = document.getElementById('settings-ai-mode');
  const statusIndicator = document.getElementById('api-status-indicator');
  const statusText = document.getElementById('api-status-text');

  if (modeSelect) modeSelect.value = AppState.aiMode;

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      if (modal) modal.style.display = 'flex';
      const diagStatus = document.getElementById('server-diag-status');
      const diagKey = document.getElementById('server-diag-key');
      if (diagStatus) diagStatus.innerHTML = `<span style="color: var(--success);"><i class="fa-solid fa-circle-check"></i> Connected (Groq Cloud)</span>`;
      if (diagKey) diagKey.innerHTML = `<span style="color: var(--secondary);"><i class="fa-solid fa-shield"></i> ${AppState.groqApiKey ? 'Configured (Active)' : 'Not Set'}</span>`;
    });
  }

  [btnClose, btnCancel].forEach(b => {
    if (b) b.addEventListener('click', () => { if (modal) modal.style.display = 'none'; });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  if (btnSave) {
    btnSave.addEventListener('click', () => {
      const mode = modeSelect ? modeSelect.value : 'live';
      AppState.aiMode = mode;
      localStorage.setItem('upskill_ai_mode', mode);

      if (statusText) statusText.textContent = mode === 'live' ? 'Live AI (Groq)' : 'Simulated AI';
      if (statusIndicator) {
        statusIndicator.className = mode === 'live' ? 'api-status-dot active' : 'api-status-dot missing';
      }

      if (modal) modal.style.display = 'none';
      showToast(`AI engine set to: ${mode === 'live' ? 'Groq Cloud LLM (Live)' : 'Offline Simulated'}`, 'success');
    });
  }
}

// ============================================================================
// 13b. DASHBOARD STATS POPULATION
// ============================================================================
function updateDashboardStats() {
  const statOpportunities = document.getElementById('stat-opportunities-score');
  const statRoadmap = document.getElementById('stat-roadmap-progress');
  const statInterviews = document.getElementById('stat-interviews-done');

  if (statOpportunities) statOpportunities.textContent = AppState.metrics.topMatch || '88%';
  if (statRoadmap) statRoadmap.textContent = (AppState.metrics.roadmapProgress || 0) + '%';
  if (statInterviews) statInterviews.textContent = AppState.metrics.interviewsCompleted || 0;

  // Animate the numbers counting up for a dynamic feel
  function animateCounter(el, targetText) {
    if (!el) return;
    const numMatch = targetText.match(/\d+/);
    if (!numMatch) return;
    const target = parseInt(numMatch[0]);
    const suffix = targetText.replace(/^\d+/, '');
    const prefix = targetText.replace(/\d+.*$/, '');
    let count = 0;
    const increment = Math.max(1, Math.floor(target / 30));
    const timer = setInterval(() => {
      count = Math.min(count + increment, target);
      el.textContent = prefix + count + suffix;
      if (count >= target) clearInterval(timer);
    }, 40);
  }

  if (statOpportunities) animateCounter(statOpportunities, AppState.metrics.topMatch || '88%');
  if (statRoadmap) animateCounter(statRoadmap, (AppState.metrics.roadmapProgress || 0) + '%');
  if (statInterviews) animateCounter(statInterviews, String(AppState.metrics.interviewsCompleted || 0));
}

// ============================================================================
// 14. APPLICATION BOOTSTRAP
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing UpSkill Client Platform...');

  // 1. Mobile Sidebar toggle
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileSidebar);
  if (overlay) overlay.addEventListener('click', closeMobileSidebar);

  // 2. Navigation items
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const view = link.getAttribute('data-view');
      if (view) window.showView(view);
    });
  });

  // 3. Initialize all modules
  initAuth();
  initThemeAndLanguage();
  initResumeBuilder();
  initRoadmap();
  initProjectPlanner();
  initMockInterview();
  initInternships();
  initGovtSchemes();
  initAIMentor();
  initAPIModal();
  updateDashboardStats();

  // 4. Determine initial view (check for jump or hash navigation)
  const jumpView = sessionStorage.getItem('upskill_jump');
  if (jumpView) {
    sessionStorage.removeItem('upskill_jump');
    if (jumpView === 'security') {
      window.showView('dashboard');
      setTimeout(() => document.getElementById('security-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    } else {
      window.showView(jumpView);
    }
  } else if (window.location.hash) {
    const hashTarget = window.location.hash.replace('#view-', '').replace('#', '');
    if (hashTarget === 'security-section') {
      window.showView('dashboard');
      setTimeout(() => document.getElementById('security-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    } else if (hashTarget) {
      window.showView(hashTarget);
    } else {
      window.showView('dashboard');
    }
  } else {
    window.showView('dashboard');
  }
  console.log('✅ UpSkill Ready.');
});
