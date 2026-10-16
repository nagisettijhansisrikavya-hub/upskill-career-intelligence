# 🚀 UPSKILL — AI-Powered Career Guidance & Intelligence Platform

![UPSKILL Platform](icon_mentor.png)

> **UPSKILL** is an intelligent, full-stack career guidance and upskilling ecosystem designed to empower students, career changers, and tech professionals. By analyzing career goals and current proficiencies, UPSKILL identifies skill gaps, delivers tailored learning roadmaps, conducts interactive AI mock interviews, scores resumes against ATS criteria, and provides real-time AI mentorship.

---

## ✨ Key Features

- 🗺️ **Personalized AI Learning Roadmaps**: Generate step-by-step career milestones tailored to your target role (Frontend, Backend, Full Stack, Data Science, DevOps, AI/ML, and more).
- 📄 **Smart Resume Analyzer & ATS Scorer**: Extract keywords, benchmark strengths, identify missing qualifications, and receive an instant ATS compatibility score with targeted improvement tips.
- 🎙️ **Interactive AI Mock Interviews**: Practice behavioral and technical questions in real time with automated scoring, confidence feedback, and actionable suggestions.
- 🤖 **AI Career Mentor & Chat**: 24/7 intelligent career assistant answering questions on salaries, interview prep, skill requirements, and industry trends.
- 📊 **Dynamic Career Intelligence Dashboard**: Track roadmap completion, mock interview history, analyzed resumes, and profile stats in a unified command center.
- 🔒 **Secure Authentication**: Built-in JSON Web Token (JWT) session management and bcrypt password hashing.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Modern Glassmorphism & Responsive Design), Vanilla JavaScript (Modular ES6+)
- **Backend**: Node.js, Express.js
- **Database**: NeDB (Embedded pure-JS document store, zero external DB configuration required)
- **Security & Utilities**: JWT (`jsonwebtoken`), `bcryptjs`, `cors`, `uuid`, `dotenv`

---

## 📁 Project Architecture

```
UPSKILL-is-an-AI-powered-career-guidance-platform/
├── 403.html                # Forbidden error page
├── 404.html                # Not Found error page
├── 500.html                # Server error page
├── app.js                  # Frontend client application logic
├── auth.js                 # Frontend authentication client
├── dashboard.html          # Interactive Career Intelligence Dashboard
├── db.js                   # NeDB database instance configuration
├── index.html              # Landing page and platform home
├── index.js                # Express server entry point
├── package.json            # Node.js project manifest and dependencies
├── style.css               # Unified modern design system stylesheet
├── middleware/
│   └── auth.js             # JWT verification middleware
├── routes/
│   ├── auth.js             # Signup, login, and user profile endpoints
│   ├── chat.js             # AI career mentor chat endpoints
│   ├── dashboard.js        # Dashboard metrics and activity feeds
│   ├── mockinterview.js    # AI mock interview simulation endpoints
│   ├── resume.js           # Resume ATS scoring and gap analysis endpoints
│   └── roadmap.js          # Learning roadmap generation endpoints
├── .env.example            # Environment variables template
├── .gitignore              # Git ignored files and directories
└── LICENSE                 # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16 or higher) installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nagisettijhansisrikavya-hub/upskill-career-intelligence.git
   cd upskill-career-intelligence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` to set your desired port and JWT secret:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Start the Application**:
   ```bash
   npm start
   ```

5. **Open in Browser**:
   Navigate to [http://localhost:5000](http://localhost:5000) to explore the platform.

---

## 🔌 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/signup` | Register a new user | No |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `POST` | `/api/resume/analyze` | Parse resume and generate ATS score | Yes |
| `GET` | `/api/roadmap` | Retrieve user's personalized roadmap | Yes |
| `POST` | `/api/roadmap/generate` | Generate custom roadmap by target role | Yes |
| `GET` | `/api/chat/history` | Retrieve mentor conversation history | Yes |
| `POST` | `/api/chat/message` | Send query to AI Career Mentor | Yes |
| `POST` | `/api/mock-interviews/start` | Initialize AI mock interview session | Yes |
| `POST` | `/api/mock-interviews/submit` | Submit responses for evaluation | Yes |
| `GET` | `/api/dashboard/stats` | Aggregate user progress statistics | Yes |

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
